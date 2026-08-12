import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { parseCatalogParams, type SearchParams } from "@/components/filters/catalog-params";

export const metadata: Metadata = {
  title: "Shop All Products — Electronics, Robotics & IoT Components | Zimbabwe",
  description:
    "Browse and buy robotics kits, Arduino, Raspberry Pi, ESP32, sensors, motors, IoT modules, electronic components and STEM education kits online in Zimbabwe. Store collection in Harare and nationwide delivery.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop All Products | Synergy Robotics",
    description: "Browse robotics kits, development boards, sensors, motors, IoT modules and electronic components.",
    url: "/shop",
    images: [{ url: "/brand/logo.jpeg", alt: "Synergy Robotics Shop" }],
  },
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
        description="Robotics kits, electronic components, IoT devices, development boards and STEM education resources — available for collection in Harare or delivery across Zimbabwe."
        className="mb-8"
      />
      <CatalogView basePath="/shop" params={params} query={query} />
    </div>
  );
}
