import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { productPath } from "@/lib/catalog";
import { getGuides } from "@/lib/resources";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/shop",
    "/new-arrivals",
    "/quote",
    "/about",
    "/services",
    "/institutions",
    "/training",
    "/gallery",
    "/resources",
    "/support",
    "/contact",
    "/faq",
    "/track-order",
    "/delivery",
    "/returns",
    "/privacy",
    "/terms",
  ];

  const [categories, products] = await Promise.all([
    db.category.findMany({ select: { slug: true, updatedAt: true } }),
    db.product.findMany({
      where: { status: { in: ["active", "preorder"] } },
      select: {
        slug: true,
        updatedAt: true,
        category: { select: { slug: true, parent: { select: { slug: true } } } },
      },
    }),
  ]);

  return [
    ...staticPaths.map((path) => ({ url: `${siteUrl}${path}` })),
    ...getGuides().map((g) => ({ url: `${siteUrl}/resources/${g.slug}` })),
    ...categories.map((c) => ({ url: `${siteUrl}/shop/${c.slug}`, lastModified: c.updatedAt })),
    ...products.map((p) => ({ url: `${siteUrl}${productPath(p)}`, lastModified: p.updatedAt })),
  ];
}
