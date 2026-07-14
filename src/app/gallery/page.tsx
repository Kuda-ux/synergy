import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading, EmptyState } from "@/components/ui/states";

export const metadata: Metadata = {
  title: "Project Gallery",
  description: "Robotics builds, lab installations and training sessions from Synergy Dynamics.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Project Gallery" }]} />
      <SectionHeading
        eyebrow="Project gallery"
        title="Our work in the field"
        description="Photos of real builds, installations and training sessions will appear here."
        className="mb-10"
      />
      <EmptyState
        icon={<ImageIcon size={40} aria-hidden />}
        title="Gallery photos coming soon"
        description="We're preparing approved photography of recent projects and workshops. In the meantime, ask us on WhatsApp for examples relevant to your project."
        actionHref="/contact"
        actionLabel="Contact us"
      />
    </div>
  );
}
