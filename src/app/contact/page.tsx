import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import { CONTACT } from "@/lib/constants";
import { getStoreHours } from "@/lib/settings";
import { localBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Visit Synergy Dynamics at Park City Village Mall, Harare, or reach us by phone, WhatsApp or email.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const storeHours = await getStoreHours();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Contact Us" }]} />
      <h1 className="text-2xl font-semibold sm:text-3xl">Contact us</h1>
      <p className="mt-3 max-w-xl text-muted">
        Product enquiries, technical support, training requests or project ideas —
        we&apos;d love to hear from you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <ContactForm />

        <aside className="h-fit space-y-5 rounded-card border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Visit or call</h2>
          <address className="space-y-3 text-sm not-italic text-muted">
            <p className="flex items-start gap-2">
              <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
              <span>
                {CONTACT.address.line1}<br />
                {CONTACT.address.line2}<br />
                {CONTACT.address.line3}<br />
                {CONTACT.address.city}, {CONTACT.address.country}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} aria-hidden className="shrink-0 text-primary" />
              <a href={CONTACT.phoneHref} className="hover:text-foreground">{CONTACT.phone}</a>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle size={16} aria-hidden className="shrink-0 text-primary" />
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                Message us on WhatsApp
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} aria-hidden className="shrink-0 text-primary" />
              <a href={CONTACT.emailHref} className="hover:text-foreground">{CONTACT.email}</a>
            </p>
          </address>
          <p className="border-t border-border pt-4 text-xs text-subtle">{storeHours}</p>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
    </div>
  );
}
