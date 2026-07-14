"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { ProductImage } from "@/components/product/product-image";
import { Price } from "@/components/product/price";
import { useWishlist } from "@/store/wishlist";
import { useMounted } from "@/hooks/use-mounted";

export function WishlistPageClient() {
  const mounted = useMounted();

  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Wishlist</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold sm:text-3xl">Wishlist</h1>
      {items.length === 0 ? (
        <EmptyState
          icon={<Heart size={40} aria-hidden />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later."
          actionHref="/shop"
          actionLabel="Browse products"
        />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.productId} className="group relative rounded-card border border-border bg-surface p-4">
              <Link href={item.path}>
                <ProductImage url={item.imageUrl} alt={item.imageAlt} className="aspect-square w-full rounded-lg" iconSize={40} />
                <p className="mt-3 line-clamp-2 text-sm font-medium group-hover:text-primary">{item.name}</p>
              </Link>
              <div className="mt-2 flex items-center justify-between">
                <Price usdCents={item.unitPriceCents} className="text-sm" />
                <button
                  type="button"
                  onClick={() => remove(item.productId)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="text-subtle transition-colors hover:text-danger"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
