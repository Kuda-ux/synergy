import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { OrderInstructions } from "@/components/cart/order-instructions";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 size={48} aria-hidden className="mx-auto text-success" />
      <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Order received — thank you!</h1>
      <p className="mt-3 text-muted">
        Your order number is{" "}
        <span className="font-mono font-semibold text-foreground">{decodeURIComponent(orderNumber)}</span>.
        Keep it safe — you can use it with your email on the{" "}
        <a href="/track-order" className="text-primary underline-offset-2 hover:underline">Track Order</a> page.
      </p>
      <OrderInstructions orderNumber={decodeURIComponent(orderNumber)} />
      <p className="mt-6 text-sm text-muted">
        We&apos;ll be in touch on the phone number or email you provided. Questions?{" "}
        <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">
          Message us on WhatsApp
        </a>{" "}
        or call {CONTACT.phone}.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/track-order" variant="outline">Track Order</ButtonLink>
        <ButtonLink href="/shop">Continue Shopping</ButtonLink>
      </div>
    </div>
  );
}
