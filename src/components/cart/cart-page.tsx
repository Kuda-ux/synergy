"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { ProductImage } from "@/components/product/product-image";
import { QuantityStepper } from "@/components/product/cart-buttons";
import { Price } from "@/components/product/price";
import { useCart, selectCartSubtotal } from "@/store/cart";
import { lineTotal } from "@/lib/cart-math";
import { useMounted } from "@/hooks/use-mounted";

export function CartPageClient() {
  const mounted = useMounted();

  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart(selectCartSubtotal);
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Your cart</h1>
        <div className="mt-8 space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-semibold sm:text-3xl">Your cart</h1>
        <EmptyState
          icon={<ShoppingCart size={40} aria-hidden />}
          title="Your cart is empty"
          description="Browse the catalogue to find robotics kits, boards, sensors and tools."
          actionHref="/shop"
          actionLabel="Start shopping"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold sm:text-3xl">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {lines.map((line) => (
            <li
              key={line.productId}
              className="flex gap-4 rounded-card border border-border bg-surface p-4"
            >
              <Link href={line.path} className="shrink-0">
                <ProductImage url={line.imageUrl} alt={line.imageAlt} className="h-24 w-24 rounded-lg" iconSize={32} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={line.path} className="line-clamp-2 text-sm font-medium hover:text-primary">
                      {line.name}
                    </Link>
                    <p className="mt-0.5 font-mono text-xs text-subtle">{line.sku}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.productId)}
                    aria-label={`Remove ${line.name} from cart`}
                    className="text-subtle transition-colors hover:text-danger"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <QuantityStepper
                    value={line.quantity}
                    max={line.maxQty}
                    onChange={(next) => setQuantity(line.productId, next)}
                    ariaLabel={`Quantity for ${line.name}`}
                  />
                  <Price usdCents={lineTotal(line)} className="text-sm" />
                </div>
                {line.quantity >= line.maxQty && (
                  <p className="mt-2 text-xs text-warning">
                    Maximum available stock reached for this item.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-card border border-border bg-surface p-6 lg:sticky lg:top-44">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>
                <Price usdCents={subtotal} />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-muted">Calculated at checkout</dd>
            </div>
          </dl>

          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              setCouponMessage(
                coupon.trim()
                  ? "Coupon codes are not active yet — any valid promotions will be applied by our team when confirming your order."
                  : "Enter a coupon code first.",
              );
            }}
          >
            <label htmlFor="coupon" className="text-sm font-medium">
              Coupon code
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter code"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm uppercase placeholder:font-sans placeholder:normal-case placeholder:text-subtle"
              />
              <Button type="submit" variant="outline">
                Apply
              </Button>
            </div>
            {couponMessage && (
              <p role="status" className="mt-2 text-xs text-muted">
                {couponMessage}
              </p>
            )}
          </form>

          <div className="mt-6 space-y-3">
            <ButtonLink href="/checkout" size="lg" className="w-full">
              Proceed to Checkout
            </ButtonLink>
            <ButtonLink href="/shop" variant="outline" className="w-full">
              Continue Shopping
            </ButtonLink>
          </div>
          <p className="mt-4 text-xs text-subtle">
            Prices shown in USD; ZWG display uses the store&apos;s configured rate.
            Stock is re-validated when you place the order.
          </p>
        </aside>
      </div>
    </div>
  );
}
