import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { getGuides } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources and Guides",
  description:
    "Practical guides on Arduino, ESP32, sensors, robotics kits, IoT and STEM projects — written for makers, students and educators.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const guides = getGuides();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Resources & Guides" }]} />
      <SectionHeading
        eyebrow="Resources & guides"
        title="Learn before you build"
        description="Practical, plain-language guides for makers, students and educators. New guides and product tutorials are added regularly."
        className="mb-10"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/resources/${guide.slug}`}
            className="group flex flex-col rounded-card border border-border bg-surface p-6 transition-colors hover:border-accent-border"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-subtle">{guide.topic}</p>
            <h2 className="mt-2 font-semibold group-hover:text-primary">{guide.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{guide.excerpt}</p>
            <p className="mt-4 flex items-center justify-between text-xs text-subtle">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} aria-hidden /> {guide.minutes} min read
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-primary">
                Read <ArrowRight size={12} aria-hidden />
              </span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
