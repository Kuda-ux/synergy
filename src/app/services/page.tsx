import type { Metadata } from "next";
import { Bot, CircuitBoard, Cloud, Cpu, Factory, Leaf, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Engineering Services",
  description:
    "Embedded systems, IoT solutions, industrial automation, smart agriculture, electronic prototyping and custom robotics — engineered in Zimbabwe.",
  alternates: { canonical: "/services" },
};

const services = [
  { icon: Cpu, title: "Embedded systems development", text: "Firmware and custom hardware built around microcontrollers — from concept and schematic to tested, documented units ready for deployment." },
  { icon: Cloud, title: "IoT solutions", text: "Connected sensors, gateways and dashboards for monitoring and automation across sites, using Wi-Fi, GSM or LoRa depending on coverage and power constraints." },
  { icon: Factory, title: "Industrial & commercial automation", text: "Applied control systems that make repetitive technical workflows smarter, safer and easier to manage — from single machines to full lines." },
  { icon: Leaf, title: "Smart agriculture", text: "Soil moisture, climate and irrigation intelligence for farms of every size, designed for local network and power conditions." },
  { icon: CircuitBoard, title: "Electronic prototyping", text: "We take your idea from breadboard to a working, tested prototype and prepare it for the next stage of development." },
  { icon: Bot, title: "Custom robotics & automation projects", text: "Purpose-built robotic platforms for education, research, competition and industry, including mechanics, electronics and software." },
];

const steps = [
  { step: "01", title: "Discovery", text: "We discuss your goals, constraints, environment and budget." },
  { step: "02", title: "Proposal", text: "You receive a written scope, timeline and formal quotation." },
  { step: "03", title: "Build & iterate", text: "We design, prototype and refine with your feedback at each stage." },
  { step: "04", title: "Deploy & support", text: "Installation, training, documentation and ongoing technical support." },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Engineering Services" }]} />
      <SectionHeading
        eyebrow="Engineering services"
        title="Engineering consultation and product development"
        description="Synergy Dynamics is an engineering partner, not just a parts supplier. Our team designs, builds and supports intelligent systems end to end."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="custom-projects">
        {services.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-card border border-border bg-surface p-6">
            <Icon size={24} aria-hidden className="text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <SectionHeading eyebrow="How it works" title="From idea to deployed system" />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.step} className="rounded-card border border-border bg-surface p-5">
              <p className="font-mono text-xs font-semibold text-primary">{s.step}</p>
              <h3 className="mt-2 text-sm font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-card border border-border bg-surface p-10 text-center">
        <h2 className="text-2xl font-semibold">Discuss your project</h2>
        <p className="max-w-lg text-sm text-muted">
          Tell us what you want to build — we&apos;ll respond with questions,
          options and a formal quotation.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/quote" size="lg">Request a Quote</ButtonLink>
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-lg border border-border-strong px-6 text-base font-medium transition-colors hover:bg-accent-surface"
          >
            <MessageCircle size={18} aria-hidden className="text-primary" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
