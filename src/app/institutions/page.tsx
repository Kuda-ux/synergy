import type { Metadata } from "next";
import { Bot, FlaskConical, GraduationCap, Package, ReceiptText, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Schools and Institutions",
  description:
    "Robotics packages, laboratory setup, teacher training and bulk procurement for schools, universities, innovation hubs and government institutions in Zimbabwe.",
  alternates: { canonical: "/institutions" },
};

const offerings = [
  { icon: Bot, title: "School robotics packages", text: "Class-sized robotics kits with spares, storage and teacher materials, matched to your learners' level." },
  { icon: FlaskConical, title: "Laboratory setup", text: "Complete electronics and robotics lab fit-outs: benches, tools, components, kits and safety guidance." },
  { icon: Users, title: "Teacher training", text: "Hands-on workshops that prepare educators to deliver robotics and electronics lessons with confidence." },
  { icon: GraduationCap, title: "University project support", text: "Component sourcing, technical advice and fabrication support for final-year and research projects." },
  { icon: Package, title: "Bulk procurement", text: "Volume supply of components, kits and tools with consistent quality and delivery coordination." },
  { icon: ReceiptText, title: "Formal quotations", text: "Purchase-order friendly quotations and documentation for procurement teams and tender processes." },
];

export default function InstitutionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Schools & Institutions" }]} />
      <SectionHeading
        eyebrow="For institutions"
        title="Equipping schools, universities and innovation labs"
        description="From a single classroom kit to a full national STEM programme — Synergy Dynamics supplies, installs, trains and supports. Every institutional engagement starts with a conversation and a formal quotation."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offerings.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-card border border-border bg-surface p-6">
            <Icon size={24} aria-hidden className="text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-card border border-border bg-surface p-8">
        <h2 className="text-xl font-semibold">How institutional purchasing works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Submit a quotation request with your requirements (or ask us to help scope them).</li>
          <li>Receive a formal quotation with a reference number for your procurement process.</li>
          <li>Confirm with a purchase order — we accept PO references on orders and quotations.</li>
          <li>We deliver, install where needed, and train your team.</li>
          <li>Ongoing technical support keeps your programme running.</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/quote" size="lg">Request a Quotation</ButtonLink>
          <ButtonLink href="/training" variant="outline" size="lg">Training &amp; Workshops</ButtonLink>
        </div>
      </section>
    </div>
  );
}
