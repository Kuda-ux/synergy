import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { parseCatalogParams, type SearchParams } from "@/components/filters/catalog-params";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest robotics kits, boards, sensors and tools to land at Synergy Dynamics.",
  alternates: { canonical: "/new-arrivals" },
};

export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const base = parseCatalogParams(params);
  const query = {
    ...base,
    newArrivalsOnly: true,
    sort: base.sort === "relevance" ? ("newest" as const) : base.sort,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "New Arrivals" }]} />
      <SectionHeading
        title="New arrivals"
        description="Fresh stock, straight to the shelf."
        className="mb-8"
      />
      <CatalogView
        basePath="/new-arrivals"
        params={params}
        query={query}
        emptyTitle="No new arrivals right now"
        emptyDescription="Check back soon — new stock lands regularly."
      />
    </div>
  );
}
