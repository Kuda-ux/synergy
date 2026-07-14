import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { parseCatalogParams, type SearchParams } from "@/components/filters/catalog-params";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse robotics kits, development boards, sensors, motors, IoT modules, electronic components and STEM education kits.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = parseCatalogParams(params);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Shop" }]} />
      <SectionHeading
        title="Shop all products"
        description="Robotics, electronics, IoT and STEM education — demo catalogue pending the live product list."
        className="mb-8"
      />
      <CatalogView basePath="/shop" params={params} query={query} />
    </div>
  );
}
