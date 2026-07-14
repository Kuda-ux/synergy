import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CircuitBoard,
  Cog,
  Cpu,
  Cloud,
  FlaskConical,
  GraduationCap,
  Factory,
  Leaf,
  Radar,
  Users,
  Wifi,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/states";
import { ProductGrid } from "@/components/product/product-card";
import { ProductImage } from "@/components/product/product-image";
import { Price } from "@/components/product/price";
import { type ProductCardData, productPath } from "@/lib/catalog";
import { getGuides } from "@/lib/resources";

const categoryIcons: Record<string, LucideIcon> = {
  cpu: Cpu,
  bot: Bot,
  radar: Radar,
  cog: Cog,
  wifi: Wifi,
  "circuit-board": CircuitBoard,
  wrench: Wrench,
  "graduation-cap": GraduationCap,
};

export interface CategoryCardData {
  slug: string;
  name: string;
  description: string | null;
  iconKey: string | null;
  productCount: number;
}

export function CategoryCards({ categories }: { categories: CategoryCardData[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        eyebrow="Shop by category"
        title="Everything from a single resistor to a full robotics lab"
        description="Database-driven categories covering learning, prototyping and industrial builds."
      />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.iconKey ?? ""] ?? CircuitBoard;
          return (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className="group rounded-card border border-border bg-surface p-5 transition-all hover:border-accent-border hover:shadow-lg hover:shadow-brand-950/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-surface text-primary">
                <Icon size={22} aria-hidden />
              </div>
              <h3 className="mt-4 text-sm font-semibold group-hover:text-primary">{category.name}</h3>
              <p className="mt-1 font-mono text-xs text-subtle">
                {category.productCount} product{category.productCount === 1 ? "" : "s"}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function NewArrivalsSection({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Just landed" title="New arrivals" />
          <ButtonLink href="/new-arrivals" variant="outline" className="hidden sm:inline-flex">
            View all <ArrowRight size={16} aria-hidden />
          </ButtonLink>
        </div>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}

export function RoboticsShowcase({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;
  return (
    <section className="brand-glow bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-brand-300">
              Featured robotics
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Robotics kits at the centre of learning
            </h2>
            <p className="mt-3 text-ink-muted">
              Robot vehicles, robotic arms and educational platforms for classrooms,
              clubs and competitions.
            </p>
          </div>
          <ButtonLink href="/shop/robotics-kits" variant="inverted" className="hidden sm:inline-flex">
            All robotics <ArrowRight size={16} aria-hidden />
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={productPath(product)}
              className="group overflow-hidden rounded-card border border-ink-border bg-ink-surface transition-colors hover:border-brand-700"
            >
              <ProductImage
                url={product.images[0]?.url ?? null}
                alt={product.images[0]?.alt ?? product.name}
                className="aspect-[4/3] w-full !bg-ink-surface text-brand-400"
                iconSize={72}
              />
              <div className="p-5">
                <h3 className="font-semibold group-hover:text-brand-300">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{product.shortDescription}</p>
                <Price usdCents={product.priceUsdCents} className="mt-3 text-brand-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const institutionItems = [
  { icon: Bot, label: "School robotics packages" },
  { icon: FlaskConical, label: "Laboratory setup" },
  { icon: Users, label: "Teacher training" },
  { icon: GraduationCap, label: "University project support" },
  { icon: Factory, label: "Bulk procurement" },
  { icon: ArrowRight, label: "Formal quotations" },
];

export function InstitutionsBand() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="For institutions"
            title="Equipping Schools, Universities and Innovation Labs"
            description="From a single classroom kit to a national STEM programme — we supply, install, train and support. Institutional buyers receive formal quotations with purchase-order support."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/institutions">For Schools &amp; Institutions</ButtonLink>
            <ButtonLink href="/quote" variant="outline">
              Request a Quotation
            </ButtonLink>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {institutionItems.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-card border border-border bg-background px-4 py-3 text-sm font-medium"
            >
              <Icon size={18} aria-hidden className="shrink-0 text-primary" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const services = [
  { icon: Cpu, title: "Embedded systems development", text: "Microcontroller firmware and custom hardware that bridge software and the physical world." },
  { icon: Cloud, title: "IoT solutions", text: "Connected sensors, gateways and dashboards for monitoring and automation." },
  { icon: Factory, title: "Industrial automation", text: "Applied control systems that make technical workflows smarter and safer." },
  { icon: Leaf, title: "Smart agriculture", text: "Soil, climate and irrigation intelligence for farms of every size." },
  { icon: CircuitBoard, title: "Electronic prototyping", text: "From breadboard to tested prototype, engineered for the next stage." },
  { icon: Bot, title: "Custom robotics", text: "Purpose-built robotic platforms for education, research and industry." },
];

export function ServicesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Engineering services"
          title="More than a store — an engineering partner"
          description="Our team designs, builds and supports intelligent systems end to end."
        />
        <ButtonLink href="/services" className="hidden sm:inline-flex">
          Discuss Your Project
        </ButtonLink>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-card border border-border bg-surface p-5">
            <Icon size={22} aria-hidden className="text-primary" />
            <h3 className="mt-3 text-sm font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-muted">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 sm:hidden">
        <ButtonLink href="/services" className="w-full">
          Discuss Your Project
        </ButtonLink>
      </div>
    </section>
  );
}

export function ResourcesPreview() {
  const guides = getGuides().slice(0, 3);
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Resources & guides"
            title="Learn before you build"
            description="Practical guides written for makers, students and educators."
          />
          <ButtonLink href="/resources" variant="outline" className="hidden sm:inline-flex">
            All guides <ArrowRight size={16} aria-hidden />
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/resources/${guide.slug}`}
              className="group rounded-card border border-border bg-background p-5 transition-colors hover:border-accent-border"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-subtle">{guide.topic}</p>
              <h3 className="mt-2 font-semibold group-hover:text-primary">{guide.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{guide.excerpt}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read guide <ArrowRight size={14} aria-hidden />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
