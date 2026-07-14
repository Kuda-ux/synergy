import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { parseCatalogParams, type SearchParams } from "@/components/filters/catalog-params";
import { getCategoryBySlug } from "@/lib/catalog";
import { breadcrumbJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description:
      category.description ?? `Shop ${category.name} at Synergy Dynamics — Zimbabwe's robotics and electronics marketplace.`,
    alternates: { canonical: `/shop/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ category: slug }, sp] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const query = { ...parseCatalogParams(sp), categorySlug: slug };
  const crumbs: Crumb[] = [{ name: "Shop", path: "/shop" }];
  if (category.parent) {
    crumbs.push({ name: category.parent.name, path: `/shop/${category.parent.slug}` });
  }
  crumbs.push({ name: category.name });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={crumbs} />
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">{category.name}</h1>
        {category.description && <p className="mt-3 text-muted">{category.description}</p>}
        {category.children.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {category.children.map((child) => (
              <li key={child.slug}>
                <Link
                  href={`/shop/${child.slug}`}
                  className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted hover:border-accent-border hover:text-primary"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <CatalogView
        basePath={`/shop/${slug}`}
        params={sp}
        query={query}
        emptyTitle={`No products in ${category.name} yet`}
        emptyDescription="New stock is added regularly — or ask us on WhatsApp and we'll help you source it."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              crumbs.map((c) => ({ name: c.name, path: c.path ?? `/shop/${slug}` })),
            ),
          ),
        }}
      />
    </div>
  );
}
