import type { Metadata } from "next";
import { Hero, TrustStrip, FinalCta } from "@/components/home/hero";
import {
  CategoryCards,
  InstitutionsBand,
  NewArrivalsSection,
  ResourcesPreview,
  RoboticsShowcase,
  ServicesGrid,
} from "@/components/home/sections";
import { getFeaturedRobotics, getNewArrivals, getTopCategories } from "@/lib/catalog";
import { localBusinessJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description:
    "Shop robotics kits, electronic components, IoT devices and embedded systems for learning, innovation and industry. Store collection in Harare and nationwide delivery across Zimbabwe.",
};

export default async function HomePage() {
  const [categories, newArrivals, robotics] = await Promise.all([
    getTopCategories(),
    getNewArrivals(8),
    getFeaturedRobotics(3),
  ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryCards
        categories={categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          description: c.description,
          iconKey: c.iconKey,
          productCount: c._count.products,
        }))}
      />
      <NewArrivalsSection products={newArrivals} />
      <RoboticsShowcase products={robotics} />
      <InstitutionsBand />
      <ServicesGrid />
      <ResourcesPreview />
      <FinalCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
    </>
  );
}
