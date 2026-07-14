"use server";

import { randomInt } from "node:crypto";
import { db } from "../db";
import { multiplyCents, sumCents } from "../money";
import { checkoutSchema, type CheckoutInput } from "../validation/checkout";
import { trackOrderSchema } from "../validation/misc";
import { getPaymentProvider } from "../payments";
import { getNotificationProvider } from "../notifications";
import { ORDER_STATUS_LABELS, type OrderStatus } from "../constants";

export interface ActionResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function newOrderNumber(): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `SD-${stamp}-${randomInt(1000, 9999)}`;
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Creates an order from a validated cart. Prices and stock are ALWAYS read
 * from the database — quantities are the only thing taken from the client.
 */
export async function createOrder(
  input: CheckoutInput,
): Promise<ActionResult<{ orderNumber: string; instructions?: string; redirectUrl?: string }>> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;

  const products = await db.product.findMany({
    where: { id: { in: data.items.map((i) => i.productId) }, status: { in: ["active", "preorder"] } },
    select: { id: true, name: true, sku: true, priceUsdCents: true, stockQty: true, status: true },
  });
  const byId = new Map(products.map((prod) => [prod.id, prod]));

  const lines: { productId: string; nameSnapshot: string; skuSnapshot: string; unitPriceCents: number; quantity: number; lineTotalCents: number }[] = [];
  for (const item of data.items) {
    const product = byId.get(item.productId);
    if (!product) return { ok: false, error: "An item in your cart is no longer available. Please review your cart." };
    if (product.status !== "preorder" && product.stockQty < item.quantity) {
      return { ok: false, error: `Only ${product.stockQty} unit(s) of "${product.name}" are in stock. Please adjust your cart.` };
    }
    lines.push({
      productId: product.id,
      nameSnapshot: product.name,
      skuSnapshot: product.sku,
      unitPriceCents: product.priceUsdCents,
      quantity: item.quantity,
      lineTotalCents: multiplyCents(product.priceUsdCents, item.quantity),
    });
  }

  const subtotalCents = sumCents(lines.map((l) => l.lineTotalCents));
  // Delivery rates are quoted per order until real rates are configured by admin.
  const deliveryCents = 0;
  const totalCents = subtotalCents + deliveryCents;
  const orderNumber = newOrderNumber();

  const order = await db.$transaction(async (tx) => {
    // Decrement stock atomically; abort if anything sold out mid-checkout.
    for (const line of lines) {
      const updated = await tx.product.updateMany({
        where: { id: line.productId, OR: [{ stockQty: { gte: line.quantity } }, { status: "preorder" }] },
        data: { stockQty: { decrement: line.quantity } },
      });
      if (updated.count === 0) {
        throw new Error(`STOCK:${line.nameSnapshot}`);
      }
    }
    return tx.order.create({
      data: {
        orderNumber,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        poReference: data.poReference,
        isInstitutional: data.isInstitutional,
        deliveryMethod: data.deliveryMethod,
        deliveryAddress: data.deliveryAddress,
        city: data.city,
        country: data.country,
        deliveryNotes: data.deliveryNotes,
        customerNotes: data.customerNotes,
        currency: "USD",
        subtotalCents,
        deliveryCents,
        totalCents,
        status: "pending_payment",
        paymentProvider: data.paymentMethod,
        items: { create: lines },
        statusEvents: { create: { toStatus: "pending_payment", note: "Order placed" } },
      },
    });
  }).catch((e: unknown) => {
    if (e instanceof Error && e.message.startsWith("STOCK:")) {
      return { stockError: e.message.slice(6) } as const;
    }
    throw e;
  });

  if ("stockError" in order) {
    return { ok: false, error: `"${order.stockError}" sold out while you were checking out. Please review your cart.` };
  }

  const provider = getPaymentProvider(data.paymentMethod);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const initiation = await provider.initiate({
    orderNumber,
    email: data.email,
    totalCents,
    currency: "USD",
    returnUrl: `${siteUrl}/checkout/confirmation/${orderNumber}`,
    webhookUrl: `${siteUrl}/api/paynow/webhook`,
  });

  await db.order.update({ where: { id: order.id }, data: { paymentRef: initiation.providerRef } });

  await getNotificationProvider().send({
    to: data.email,
    template: "order_received",
    subject: `Order ${orderNumber} received — Synergy Dynamics`,
    data: { orderNumber, total: (totalCents / 100).toFixed(2) },
  });

  return { ok: true, data: { orderNumber, instructions: initiation.instructions, redirectUrl: initiation.redirectUrl } };
}

export interface TrackedOrder {
  orderNumber: string;
  status: OrderStatus;
  statusLabel: string;
  createdAt: string;
  totalCents: number;
  deliveryMethod: string;
  items: { name: string; quantity: number }[];
  history: { toStatus: string; note: string | null; createdAt: string }[];
}

export async function trackOrder(input: {
  orderNumber: string;
  email: string;
}): Promise<ActionResult<TrackedOrder>> {
  const parsed = trackOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const order = await db.order.findFirst({
    where: {
      orderNumber: parsed.data.orderNumber.trim().toUpperCase(),
      email: parsed.data.email.trim().toLowerCase(),
    },
    include: {
      items: { select: { nameSnapshot: true, quantity: true } },
      statusEvents: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) {
    return { ok: false, error: "No order was found for that order number and email combination." };
  }
  const status = order.status as OrderStatus;
  return {
    ok: true,
    data: {
      orderNumber: order.orderNumber,
      status,
      statusLabel: ORDER_STATUS_LABELS[status] ?? order.status,
      createdAt: order.createdAt.toISOString(),
      totalCents: order.totalCents,
      deliveryMethod: order.deliveryMethod,
      items: order.items.map((i) => ({ name: i.nameSnapshot, quantity: i.quantity })),
      history: order.statusEvents.map((e) => ({
        toStatus: e.toStatus,
        note: e.note,
        createdAt: e.createdAt.toISOString(),
      })),
    },
  };
}
