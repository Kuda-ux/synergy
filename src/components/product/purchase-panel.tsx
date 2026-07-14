"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { CONTACT } from "@/lib/constants";
import { clampQuantity } from "@/lib/cart-math";
import { AddToCartButton, QuantityStepper, WishlistButton, type CartProductInfo } from "./cart-buttons";

export function PurchasePanel({ product }: { product: CartProductInfo }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const addLine = useCart((s) => s.addLine);

  const whatsappText = encodeURIComponent(
    `Hello Synergy Dynamics, I'd like to enquire about: ${product.name} (SKU ${product.sku}).`,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          max={Math.max(product.maxQty, 1)}
          onChange={(next) => setQuantity(clampQuantity(next, product.maxQty))}
        />
        <AddToCartButton product={product} quantity={quantity} size="lg" className="flex-1 min-w-40" />
        <WishlistButton product={product} className="h-12 w-12" />
      </div>
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={!product.purchasable}
        onClick={() => {
          addLine({ ...product, quantity });
          router.push("/checkout");
        }}
      >
        Buy Now
      </Button>
      <a
        href={`${CONTACT.whatsappHref}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border-strong text-sm font-medium transition-colors hover:border-accent-border hover:bg-accent-surface"
      >
        <MessageCircle size={18} aria-hidden className="text-primary" />
        Ask about this product on WhatsApp
      </a>

      <ul className="space-y-2 rounded-card border border-border bg-surface p-4 text-sm text-muted">
        <li className="flex items-start gap-2">
          <Store size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
          <span>
            Free collection from {CONTACT.address.line1}, {CONTACT.address.line2}, {CONTACT.address.city}.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Truck size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
          <span>
            Harare and nationwide delivery available — delivery cost is confirmed
            before dispatch.
          </span>
        </li>
      </ul>
    </div>
  );
}
