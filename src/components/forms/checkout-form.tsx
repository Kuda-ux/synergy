"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, TextareaField } from "@/components/ui/form";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { Price } from "@/components/product/price";
import { useCart, selectCartSubtotal } from "@/store/cart";
import { createOrder } from "@/lib/actions/orders";
import { DELIVERY_METHODS, PAYMENT_METHODS } from "@/lib/constants";
import { lineTotal } from "@/lib/cart-math";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

export function CheckoutForm() {
  const mounted = useMounted();

  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(selectCartSubtotal);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isInstitutional, setIsInstitutional] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string>("collection");
  const [paymentMethod, setPaymentMethod] = useState<string>("paynow");

  if (!mounted) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Skeleton className="h-96" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart size={40} aria-hidden />}
        title="Nothing to check out"
        description="Your cart is empty. Add some products first."
        actionHref="/shop"
        actionLabel="Browse products"
      />
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await createOrder({
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        firstName: String(form.get("firstName") ?? ""),
        lastName: String(form.get("lastName") ?? ""),
        isInstitutional,
        company: String(form.get("company") ?? "") || undefined,
        poReference: String(form.get("poReference") ?? "") || undefined,
        deliveryMethod,
        deliveryAddress: String(form.get("deliveryAddress") ?? "") || undefined,
        city: String(form.get("city") ?? "") || undefined,
        country: String(form.get("country") ?? "") || "Zimbabwe",
        deliveryNotes: String(form.get("deliveryNotes") ?? "") || undefined,
        customerNotes: String(form.get("customerNotes") ?? "") || undefined,
        paymentMethod,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      });
      if (result.ok && result.data) {
        try {
          sessionStorage.setItem(
            `sd-order-${result.data.orderNumber}`,
            JSON.stringify({ instructions: result.data.instructions ?? null }),
          );
        } catch {
          // sessionStorage unavailable — the confirmation page copes without it
        }
        clear();
        if (result.data.redirectUrl) {
          window.location.assign(result.data.redirectUrl);
        } else {
          router.push(`/checkout/confirmation/${result.data.orderNumber}`);
        }
      } else {
        setError(result.error ?? "Something went wrong placing your order.");
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  const radioCard = (active: boolean) =>
    cn(
      "flex cursor-pointer flex-col gap-0.5 rounded-card border p-4 transition-colors",
      active ? "border-primary bg-accent-surface" : "border-border bg-surface hover:border-border-strong",
    );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        {error && (
          <p role="alert" className="rounded-card border border-danger/40 bg-danger-surface px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <fieldset className="space-y-4">
          <legend className="mb-2 text-lg font-semibold">Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="First name" name="firstName" required autoComplete="given-name" error={fieldErrors.firstName} />
            <InputField label="Last name" name="lastName" required autoComplete="family-name" error={fieldErrors.lastName} />
            <InputField label="Email" name="email" type="email" required autoComplete="email" error={fieldErrors.email} />
            <InputField label="Phone / WhatsApp" name="phone" type="tel" required autoComplete="tel" error={fieldErrors.phone} hint="Used for delivery and order updates." />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isInstitutional}
              onChange={(e) => setIsInstitutional(e.target.checked)}
              className="h-4 w-4 rounded border-border-strong accent-(--brand-600)"
            />
            This is a company or institutional purchase
          </label>
          {isInstitutional && (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Organisation name" name="company" required error={fieldErrors.company} />
              <InputField label="Purchase-order number" name="poReference" error={fieldErrors.poReference} hint="Optional" />
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-lg font-semibold">Delivery</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {DELIVERY_METHODS.map((method) => (
              <label key={method.value} className={radioCard(deliveryMethod === method.value)}>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    name="deliveryMethodRadio"
                    value={method.value}
                    checked={deliveryMethod === method.value}
                    onChange={() => setDeliveryMethod(method.value)}
                    className="accent-(--brand-600)"
                  />
                  {method.label}
                </span>
                <span className="pl-5 text-xs text-muted">{method.description}</span>
              </label>
            ))}
          </div>
          {deliveryMethod !== "collection" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextareaField label="Delivery address" name="deliveryAddress" required error={fieldErrors.deliveryAddress} />
              </div>
              <InputField label="City / Town" name="city" error={fieldErrors.city} />
              <InputField
                label="Country"
                name="country"
                defaultValue={deliveryMethod === "international_quote" ? "" : "Zimbabwe"}
                error={fieldErrors.country}
              />
              <div className="sm:col-span-2">
                <InputField label="Delivery notes" name="deliveryNotes" error={fieldErrors.deliveryNotes} hint="Landmarks, preferred courier, gate codes… (optional)" />
              </div>
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-lg font-semibold">Payment</legend>
          <div className="grid gap-3">
            {PAYMENT_METHODS.map((method) => (
              <label key={method.value} className={radioCard(paymentMethod === method.value)}>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    name="paymentMethodRadio"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="accent-(--brand-600)"
                  />
                  {method.label}
                </span>
                <span className="pl-5 text-xs text-muted">{method.description}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-subtle">
            No card details are entered or stored on this website. Online payment is
            confirmed server-side before any order is marked as paid.
          </p>
        </fieldset>

        <TextareaField label="Order notes (optional)" name="customerNotes" error={fieldErrors.customerNotes} />
      </div>

      <aside className="h-fit rounded-card border border-border bg-surface p-6 lg:sticky lg:top-44">
        <h2 className="text-lg font-semibold">Your order</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3 py-2.5">
              <span className="min-w-0">
                <span className="line-clamp-1">{line.name}</span>
                <span className="font-mono text-xs text-subtle">× {line.quantity}</span>
              </span>
              <Price usdCents={lineTotal(line)} />
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd><Price usdCents={subtotal} /></dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="text-muted">Confirmed before dispatch</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total (USD)</dt>
            <dd><Price usdCents={subtotal} /></dd>
          </div>
        </dl>
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
          {pending ? "Placing order…" : "Place Order"}
        </Button>
        <p className="mt-3 text-xs text-subtle">
          By placing this order you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">Terms &amp; Conditions</Link>.
        </p>
      </aside>
    </form>
  );
}
