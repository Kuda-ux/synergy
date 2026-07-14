import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { parseCatalogParams, type SearchParams } from "@/components/filters/catalog-params";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = parseCatalogParams(params);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Search" }]} />
      <h1 className="mb-8 text-2xl font-semibold sm:text-3xl">
        {query.q ? <>Search results for &ldquo;{query.q}&rdquo;</> : "Search"}
      </h1>
      <CatalogView
        basePath="/search"
        params={params}
        query={query}
        emptyTitle={query.q ? `Nothing matches “${query.q}”` : "Type a search term to begin"}
        emptyDescription="Check the spelling, try a broader keyword, or search by SKU."
      />
    </div>
  );
}
