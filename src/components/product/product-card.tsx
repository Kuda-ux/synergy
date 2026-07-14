import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type ProductCardData, productPath } from "@/lib/catalog";
import { ProductImage } from "./product-image";
import { Price } from "./price";
import { StockBadge, stockState } from "./stock-badge";
import { AddToCartButton, WishlistButton, type CartProductInfo } from "./cart-buttons";

export function cartInfoFor(product: ProductCardData): CartProductInfo {
  const state = stockState(product);
  return {
    productId: product.id,
    slug: product.slug,
    path: productPath(product),
    name: product.name,
    sku: product.sku,
    unitPriceCents: product.priceUsdCents,
    imageUrl: product.images[0]?.url ?? null,
    imageAlt: product.images[0]?.alt ?? product.name,
    maxQty: product.status === "preorder" ? 99 : product.stockQty,
    purchasable: state !== "out_of_stock",
  };
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const href = productPath(product);
  const state = stockState(product);
  const info = cartInfoFor(product);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-brand-950/5">
      <Link href={href} className="relative block" tabIndex={-1} aria-hidden>
        <ProductImage
          url={product.images[0]?.url ?? null}
          alt={product.images[0]?.alt ?? product.name}
          className="aspect-square w-full"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>
      <div className="absolute left-3 top-3 flex flex-col gap-1.5">
        {product.isNewArrival && <Badge tone="brand">New</Badge>}
        {product.isBestSeller && <Badge tone="neutral">Best Seller</Badge>}
        {product.compareAtUsdCents && product.compareAtUsdCents > product.priceUsdCents && (
          <Badge tone="danger">Sale</Badge>
        )}
      </div>
      <div className="absolute right-3 top-3">
        <WishlistButton product={info} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-subtle">{product.category.name}</p>
        <h3 className="text-sm font-medium leading-snug">
          <Link href={href} className="after:absolute after:inset-0 group-hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Price usdCents={product.priceUsdCents} compareAtUsdCents={product.compareAtUsdCents} className="text-sm" />
          <StockBadge state={state} />
        </div>
        {/* Quick add sits above the stretched link */}
        <div className="relative z-10">
          <AddToCartButton product={info} size="sm" className="w-full" label="Quick Add" />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
