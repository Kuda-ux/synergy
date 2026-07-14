import type { Metadata } from "next";
import Image from "next/image";
import { Award, BookOpenCheck, Lightbulb, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Synergy Dynamics is a Zimbabwean technology company advancing STEM education and engineering through robotics, electronics, automation and embedded systems.",
  alternates: { canonical: "/about" },
};

const values = [
  { icon: Lightbulb, title: "Innovation", text: "We embrace creativity and emerging technologies to develop impactful learning experiences." },
  { icon: Award, title: "Excellence", text: "We strive to deliver high-quality products, services and training solutions." },
  { icon: ShieldCheck, title: "Integrity", text: "We build trust through professionalism, transparency and accountability." },
  { icon: BookOpenCheck, title: "Continuous Learning", text: "We promote curiosity, exploration and lifelong learning in technology and engineering." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "About Us" }]} />

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="About Synergy Dynamics"
            title="Engineering the future of practical learning"
            description="Synergy Dynamics is a Zimbabwean technology company dedicated to advancing STEM education and engineering through innovative robotics, electronics, automation and embedded systems solutions. We provide practical learning tools and technology experiences that equip students, educators and innovators with the skills needed for the future."
          />
          <div className="mt-6 flex gap-3">
            <ButtonLink href="/shop">Shop the Catalogue</ButtonLink>
            <ButtonLink href="/services" variant="outline">Engineering Services</ButtonLink>
          </div>
        </div>
        <div className="flex justify-center rounded-card border border-border bg-white p-10">
          <Image
            src="/brand/logo.jpeg"
            alt="Synergy Dynamics official logo"
            width={420}
            height={420}
            className="h-auto w-full max-w-sm"
          />
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-card border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Vision</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            To become a leading provider of STEM and technology learning solutions
            that inspire innovation, creativity and technological excellence across Africa.
          </p>
        </div>
        <div className="rounded-card border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            To bridge the gap between theory and practice by delivering accessible,
            engaging and industry-relevant robotics, electronics and automation
            learning solutions.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <SectionHeading eyebrow="Core values" title="The principles behind our work" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-card border border-border bg-surface p-5">
              <Icon size={22} aria-hidden className="text-primary" />
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
