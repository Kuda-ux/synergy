import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";
import { getNotificationProvider } from "@/lib/notifications";

/**
 * Paynow result webhook. Signature-verified and idempotent:
 *  - the payload hash is validated against the integration key,
 *  - an order already marked paid is never re-processed,
 *  - the browser can never trigger this state change directly.
 * In mock mode (no credentials) verification always fails safely.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const provider = getPaymentProvider("paynow");
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const verification = await provider.verifyWebhook(rawBody, headers);
  if (!verification.ok) {
    // Do not leak validation details to the caller.
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const params = new URLSearchParams(rawBody);
  const reference = params.get("reference");
  if (!reference) return NextResponse.json({ received: true }, { status: 200 });

  const order = await db.order.findUnique({ where: { orderNumber: reference } });
  if (!order || order.status !== "pending_payment") {
    // Unknown order or already settled — idempotent no-op.
    return NextResponse.json({ received: true }, { status: 200 });
  }

  if (verification.outcome === "paid") {
    await db.$transaction([
      db.order.update({
        where: { id: order.id },
        data: { status: "paid", paymentRef: verification.providerRef },
      }),
      db.orderStatusEvent.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: "paid",
          note: "Payment confirmed via Paynow webhook",
        },
      }),
    ]);
    await getNotificationProvider().send({
      to: order.email,
      template: "payment_received",
      subject: `Payment received for ${order.orderNumber} — Synergy Dynamics`,
      data: { orderNumber: order.orderNumber },
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
