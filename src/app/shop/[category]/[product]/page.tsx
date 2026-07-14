import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { ProductGallery } from "@/components/product/gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductTabs } from "@/components/product/product-tabs";
import { Price } from "@/components/product/price";
import { StockBadge, stockState } from "@/components/product/stock-badge";
import { ProductGrid, cartInfoFor } from "@/components/product/product-card";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { getProductBySlug, getRelatedProducts, productPath } from "@/lib/catalog";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string; product: string }>;
}

const specsSchema = z.array(z.object({ group: z.string(), label: z.string(), value: z.string() }));
const stringsSchema = z.array(z.string());
const downloadsSchema = z.array(z.object({ label: z.string(), url: z.string() }));

function parseJson<T>(schema: z.ZodType<T>, raw: string, fallback: T): T {
  try {
    const result = schema.safeParse(JSON.parse(raw));
    return result.success ? result.data : fallback;
  } catch {
    return fallback;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seoTitle ?? `${product.name} (${product.sku})`,
    description: product.seoDescription ?? product.shortDescription,
    alternates: { canonical: productPath(product) },
    openGraph: { title: product.name, description: product.shortDescription },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category: categorySlug, product: slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status === "draft" || product.status === "archived") notFound();

  // Canonicalise the category segment of the URL.
  const canonicalPath = productPath(product);
  if (!canonicalPath.includes(`/${categorySlug}/`)) redirect(canonicalPath);

  const topCategorySlug = product.category.parent?.slug ?? product.category.slug;
  const related = await getRelatedProducts(product.id, topCategorySlug, 4);
  const state = stockState(product);
  const info = cartInfoFor(product);

  const tabsData = {
    description: product.description,
    specs: parseJson(specsSchema, product.specsJson, []),
    contents: parseJson(stringsSchema, product.packageContentsJson, []),
    compatibility: parseJson(stringsSchema, product.compatibilityJson, []),
    downloads: parseJson(downloadsSchema, product.downloadsJson, []),
    warranty: product.warranty,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "Shop", path: "/shop" },
          { name: product.category.name, path: `/shop/${product.category.slug}` },
          { name: product.name },
        ]}
      />

      {product.isDemo && (
        <p className="mb-6 rounded-card border border-warning/40 bg-warning-surface px-4 py-2.5 text-sm text-warning">
          Demo product — pricing, stock and specifications shown here are illustrative
          placeholders pending the live Synergy Dynamics catalogue.
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} videoUrl={product.videoUrl} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{product.brand.name}</Badge>
            {product.isNewArrival && <Badge tone="info">New Arrival</Badge>}
            {product.isBestSeller && <Badge tone="neutral">Best Seller</Badge>}
          </div>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">{product.name}</h1>
          <p className="mt-2 font-mono text-xs text-subtle">SKU: {product.sku}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Price
              usdCents={product.priceUsdCents}
              compareAtUsdCents={product.compareAtUsdCents}
              className="text-2xl"
            />
            <StockBadge state={state} />
          </div>

          <p className="mt-4 max-w-xl text-muted">{product.shortDescription}</p>

          <div className="mt-6">
            <PurchasePanel product={info} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ProductTabs data={tabsData} />
      </div>

      {related.length > 0 && (
        <section aria-label="Related products" className="mt-12">
          <SectionHeading title="You might also need" className="mb-6" />
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed
        current={{
          productId: product.id,
          path: canonicalPath,
          name: product.name,
          imageUrl: product.images[0]?.url ?? null,
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            productJsonLd(product, canonicalPath),
            breadcrumbJsonLd([
              { name: "Shop", path: "/shop" },
              { name: product.category.name, path: `/shop/${product.category.slug}` },
              { name: product.name, path: canonicalPath },
            ]),
          ]),
        }}
      />
    </div>
  );
}
