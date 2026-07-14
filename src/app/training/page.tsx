import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Training and Workshops",
  description:
    "Project-based robotics, electronics and IoT training for learners, educators and professional teams — delivered by Synergy Dynamics in Zimbabwe.",
  alternates: { canonical: "/training" },
};

const programmes = [
  { title: "Learner workshops", audience: "Students & clubs", text: "Guided, project-based sessions where learners build real robots and circuits — from first LED to line-following robot." },
  { title: "Teacher training", audience: "Educators", text: "Practical professional development that prepares teachers to run robotics and electronics lessons using their school's own equipment." },
  { title: "Institutional programmes", audience: "Schools & universities", text: "Structured learning paths designed with your institution, including curriculum mapping, equipment and ongoing support." },
  { title: "Professional upskilling", audience: "Engineering teams", text: "Focused sessions on embedded systems, IoT and automation for technical teams adopting new tools." },
];

export default function TrainingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Training & Workshops" }]} />
      <SectionHeading
        eyebrow="Training & workshops"
        title="Learning by building"
        description="All Synergy Dynamics training is hands-on and project-based: participants leave having built, coded and debugged something real. Programmes are scheduled on request and priced by quotation."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {programmes.map((programme) => (
          <div key={programme.title} className="rounded-card border border-border bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">{programme.audience}</p>
            <h2 className="mt-2 font-semibold">{programme.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{programme.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-card border border-border bg-surface p-10 text-center">
        <h2 className="text-xl font-semibold">Book a programme</h2>
        <p className="max-w-lg text-sm text-muted">
          Tell us your group size, experience level and goals — we&apos;ll propose a
          programme and a formal quotation.
        </p>
        <ButtonLink href="/quote" size="lg">Request Training Quotation</ButtonLink>
      </div>
    </div>
  );
}
