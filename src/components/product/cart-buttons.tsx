"use client";

import { useEffect, useState } from "react";
import { Check, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useWishlist, type WishlistItem } from "@/store/wishlist";
import type { CartLine } from "@/lib/cart-math";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

export interface CartProductInfo {
  productId: string;
  slug: string;
  path: string;
  name: string;
  sku: string;
  unitPriceCents: number;
  imageUrl: string | null;
  imageAlt: string;
  maxQty: number;
  purchasable: boolean;
}

function toLine(info: CartProductInfo, quantity: number): CartLine {
  return { ...info, quantity };
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = "md",
  className,
  label = "Add to Cart",
}: {
  product: CartProductInfo;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const addLine = useCart((s) => s.addLine);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  if (!product.purchasable) {
    return (
      <Button size={size} className={className} disabled>
        Out of Stock
      </Button>
    );
  }
  return (
    <Button
      size={size}
      className={className}
      onClick={() => {
        addLine(toLine(product, quantity));
        setAdded(true);
      }}
      aria-live="polite"
    >
      {added ? <Check size={16} aria-hidden /> : <ShoppingCart size={16} aria-hidden />}
      {added ? "Added" : label}
    </Button>
  );
}

export function WishlistButton({
  product,
  className,
}: {
  product: Omit<WishlistItem, "productId"> & { productId: string };
  className?: string;
}) {
  const mounted = useMounted();
  const toggle = useWishlist((s) => s.toggle);
  const saved = useWishlist((s) => s.items.some((i) => i.productId === product.productId));
  const active = mounted && saved;

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={active}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 text-muted transition-colors hover:text-primary",
        active && "border-accent-border text-primary",
        className,
      )}
    >
      <Heart size={16} fill={active ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

export function QuantityStepper({
  value,
  max,
  onChange,
  ariaLabel = "Quantity",
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border-strong" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-muted hover:text-foreground disabled:opacity-40"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={14} aria-hidden />
      </button>
      <span className="w-10 text-center font-mono text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-muted hover:text-foreground disabled:opacity-40"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} aria-hidden />
      </button>
    </div>
  );
}
