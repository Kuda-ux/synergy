import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { getGuideBySlug, getGuides } from "@/lib/resources";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/resources/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Resources", path: "/resources" }, { name: guide.title }]} />
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{guide.topic}</p>
      <h1 className="mt-2 text-3xl font-semibold">{guide.title}</h1>
      <p className="mt-2 inline-flex items-center gap-1 text-xs text-subtle">
        <Clock size={12} aria-hidden /> {guide.minutes} min read
      </p>

      <div className="mt-8 space-y-8">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <p className="mt-3 leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-card border border-border bg-surface p-6 text-center">
        <p className="font-medium">Ready to put it into practice?</p>
        <div className="mt-4 flex justify-center gap-3">
          <ButtonLink href="/shop">Shop Components</ButtonLink>
          <ButtonLink href="/resources" variant="outline">More Guides</ButtonLink>
        </div>
      </div>
    </article>
  );
}
