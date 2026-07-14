import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FileQuestion, MessageCircle, PackageSearch, ReceiptText, Undo2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/states";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Support",
  description: "Technical product support, order help, returns and resources from Synergy Dynamics.",
  alternates: { canonical: "/support" },
};

const options = [
  { icon: MessageCircle, title: "WhatsApp technical support", text: "Wiring, code or product questions — message our engineers directly.", href: CONTACT.whatsappHref, external: true, cta: "Open WhatsApp" },
  { icon: PackageSearch, title: "Track an order", text: "Live status and history using your order number and email.", href: "/track-order", cta: "Track order" },
  { icon: Undo2, title: "Returns & warranty", text: "What to do if something arrives faulty or isn't right.", href: "/returns", cta: "Returns policy" },
  { icon: ReceiptText, title: "Quotations", text: "Formal quotations for institutions, companies and bulk orders.", href: "/quote", cta: "Request a quote" },
  { icon: BookOpen, title: "Guides & resources", text: "Practical guides on boards, sensors, robotics kits and IoT.", href: "/resources", cta: "Browse guides" },
  { icon: FileQuestion, title: "FAQs", text: "Quick answers about ordering, delivery, payment and collection.", href: "/faq", cta: "Read FAQs" },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Support" }]} />
      <SectionHeading
        eyebrow="Support"
        title="How can we help?"
        description={`Talk to a real engineer: ${CONTACT.phone} (phone or WhatsApp), or email ${CONTACT.email}.`}
        className="mb-10"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map(({ icon: Icon, title, text, href, cta, external }) => (
          <div key={title} className="flex flex-col rounded-card border border-border bg-surface p-6">
            <Icon size={24} aria-hidden className="text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{text}</p>
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-medium text-primary hover:underline">
                {cta} →
              </a>
            ) : (
              <Link href={href} className="mt-4 text-sm font-medium text-primary hover:underline">
                {cta} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
