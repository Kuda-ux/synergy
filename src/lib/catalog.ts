import "server-only";
import { db } from "./db";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Storefront catalogue queries. `costUsdCents` (admin-only) is never selected
 * here, so it can never leak into a page payload.
 */

export const productCardSelect = {
  id: true,
  slug: true,
  sku: true,
  name: true,
  shortDescription: true,
  priceUsdCents: true,
  compareAtUsdCents: true,
  stockQty: true,
  lowStockThreshold: true,
  status: true,
  isNewArrival: true,
  isBestSeller: true,
  isDemo: true,
  brand: { select: { name: true, slug: true } },
  category: { select: { name: true, slug: true, parent: { select: { slug: true } } } },
  images: { select: { url: true, alt: true }, orderBy: { sortOrder: "asc" as const }, take: 1 },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

const visibleStatuses = ["active", "preorder"];

export async function getTopCategories() {
  return db.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { status: { in: visibleStatuses } } } } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getNewArrivals(take = 8) {
  return db.product.findMany({
    where: { status: { in: visibleStatuses }, isNewArrival: true },
    select: productCardSelect,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getFeaturedProducts(take = 8) {
  return db.product.findMany({
    where: { status: { in: visibleStatuses }, isFeatured: true },
    select: productCardSelect,
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export async function getFeaturedRobotics(take = 3) {
  return db.product.findMany({
    where: {
      status: { in: visibleStatuses },
      isFeatured: true,
      category: { OR: [{ slug: "robotics-kits" }, { parent: { slug: "robotics-kits" } }] },
    },
    select: productCardSelect,
    take,
  });
}

export async function getBrands() {
  return db.brand.findMany({ orderBy: { name: "asc" } });
}

export type CatalogSort = "relevance" | "price-asc" | "price-desc" | "newest" | "popular";

export interface CatalogQuery {
  q?: string;
  categorySlug?: string;
  brandSlugs?: string[];
  minPriceCents?: number;
  maxPriceCents?: number;
  inStockOnly?: boolean;
  newArrivalsOnly?: boolean;
  sort?: CatalogSort;
  page?: number;
  perPage?: number;
}

export interface CatalogResult {
  products: ProductCardData[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function searchProducts(query: CatalogQuery): Promise<CatalogResult> {
  const perPage = Math.min(Math.max(query.perPage ?? 12, 1), 48);
  const page = Math.max(query.page ?? 1, 1);

  const where: Prisma.ProductWhereInput = { status: { in: visibleStatuses } };

  if (query.q) {
    const q = query.q.trim();
    where.OR = [
      { name: { contains: q } },
      { sku: { contains: q } },
      { tags: { contains: q.toLowerCase() } },
      { shortDescription: { contains: q } },
      { brand: { name: { contains: q } } },
    ];
  }
  if (query.categorySlug) {
    // Match the category itself or any direct child (two-level tree).
    where.category = {
      OR: [{ slug: query.categorySlug }, { parent: { slug: query.categorySlug } }],
    };
  }
  if (query.brandSlugs?.length) {
    where.brand = { slug: { in: query.brandSlugs } };
  }
  if (query.minPriceCents != null || query.maxPriceCents != null) {
    where.priceUsdCents = {
      ...(query.minPriceCents != null ? { gte: query.minPriceCents } : {}),
      ...(query.maxPriceCents != null ? { lte: query.maxPriceCents } : {}),
    };
  }
  if (query.inStockOnly) {
    where.stockQty = { gt: 0 };
  }
  if (query.newArrivalsOnly) {
    where.isNewArrival = true;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput[] = (() => {
    switch (query.sort) {
      case "price-asc":
        return [{ priceUsdCents: "asc" }];
      case "price-desc":
        return [{ priceUsdCents: "desc" }];
      case "newest":
        return [{ createdAt: "desc" }];
      case "popular":
        return [{ isBestSeller: "desc" }, { isFeatured: "desc" }, { createdAt: "desc" }];
      default:
        return [{ isFeatured: "desc" }, { isBestSeller: "desc" }, { createdAt: "desc" }];
    }
  })();

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      select: productCardSelect,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.product.count({ where }),
  ]);

  return { products, total, page, perPage, totalPages: Math.max(Math.ceil(total / perPage), 1) };
}

/** Lightweight predictive search for the header search box. */
export async function suggestProducts(q: string, take = 6) {
  const term = q.trim();
  if (term.length < 2) return [];
  return db.product.findMany({
    where: {
      status: { in: visibleStatuses },
      OR: [
        { name: { contains: term } },
        { sku: { contains: term } },
        { tags: { contains: term.toLowerCase() } },
        { brand: { name: { contains: term } } },
      ],
    },
    select: productCardSelect,
    take,
  });
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    select: {
      ...productCardSelect,
      description: true,
      specsJson: true,
      packageContentsJson: true,
      compatibilityJson: true,
      downloadsJson: true,
      videoUrl: true,
      warranty: true,
      shippingNote: true,
      weightGrams: true,
      dimensionsMm: true,
      seoTitle: true,
      seoDescription: true,
      images: { select: { url: true, alt: true }, orderBy: { sortOrder: "asc" as const } },
    },
  });
}

export type ProductDetailData = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

export async function getRelatedProducts(productId: string, categorySlug: string, take = 4) {
  return db.product.findMany({
    where: {
      status: { in: visibleStatuses },
      id: { not: productId },
      category: { OR: [{ slug: categorySlug }, { parent: { slug: categorySlug } }] },
    },
    select: productCardSelect,
    take,
  });
}

/** Resolve the canonical URL path for a product (top-level category in the path). */
export function productPath(product: {
  slug: string;
  category: { slug: string; parent?: { slug: string } | null };
}): string {
  const topSlug = product.category.parent?.slug ?? product.category.slug;
  return `/shop/${topSlug}/${product.slug}`;
}
