"use server";

import { randomInt } from "node:crypto";
import { db } from "../db";
import { quotationSchema, type QuotationInput } from "../validation/quotation";
import { getNotificationProvider } from "../notifications";
import type { ActionResult } from "./orders";

function newQuoteReference(): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `SDQ-${stamp}-${randomInt(1000, 9999)}`;
}

export async function createQuotationRequest(
  input: QuotationInput,
): Promise<ActionResult<{ reference: string }>> {
  const parsed = quotationSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  // Only attach product IDs that really exist; free-text items are kept as-is.
  const ids = data.items.map((i) => i.productId).filter((id): id is string => !!id);
  const existing = new Set(
    (await db.product.findMany({ where: { id: { in: ids } }, select: { id: true } })).map((p) => p.id),
  );

  const reference = newQuoteReference();
  await db.quotationRequest.create({
    data: {
      reference,
      organisationName: data.organisationName,
      organisationType: data.organisationType,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      poReference: data.poReference,
      requirements: data.requirements,
      status: "new",
      items: {
        create: data.items.map((i) => ({
          productId: i.productId && existing.has(i.productId) ? i.productId : null,
          description: i.description,
          quantity: i.quantity,
        })),
      },
    },
  });

  await getNotificationProvider().send({
    to: data.contactEmail,
    template: "quotation_received",
    subject: `Quotation request ${reference} received — Synergy Dynamics`,
    data: { reference },
  });

  return { ok: true, data: { reference } };
}
