import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CheckoutForm } from "@/components/forms/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Cart", path: "/cart" }, { name: "Checkout" }]} />
      <h1 className="mb-2 text-2xl font-semibold sm:text-3xl">Checkout</h1>
      <p className="mb-8 max-w-xl text-sm text-muted">
        Guest checkout — no account needed. Prices and stock are re-validated
        securely when you place your order.
      </p>
      <CheckoutForm />
    </div>
  );
}
