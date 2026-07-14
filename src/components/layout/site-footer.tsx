import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { Logo } from "./logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Robotics Kits", href: "/shop/robotics-kits" },
  { label: "Development Boards", href: "/shop/development-boards" },
  { label: "Sensors & Modules", href: "/shop/sensors-modules" },
  { label: "STEM Education", href: "/shop/stem-education" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Engineering Services", href: "/services" },
  { label: "Schools & Institutions", href: "/institutions" },
  { label: "Training & Workshops", href: "/training" },
  { label: "Project Gallery", href: "/gallery" },
  { label: "Resources & Guides", href: "/resources" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Request a Quotation", href: "/quote" },
  { label: "Track Order", href: "/track-order" },
  { label: "Delivery Information", href: "/delivery" },
  { label: "Returns & Warranty", href: "/returns" },
  { label: "FAQs", href: "/faq" },
];

export function SiteFooter({ storeHours }: { storeHours: string }) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-sm text-sm text-muted">
              Zimbabwe&apos;s robotics, electronics and intelligent systems marketplace —
              serving students, engineers, institutions and industry.
            </p>
            <address className="space-y-2 text-sm not-italic text-muted">
              <p className="flex items-start gap-2">
                <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-primary" />
                <span>
                  {CONTACT.address.line1}, {CONTACT.address.line2},<br />
                  {CONTACT.address.line3}, {CONTACT.address.city}, {CONTACT.address.country}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} aria-hidden className="shrink-0 text-primary" />
                <a href={CONTACT.phoneHref} className="hover:text-foreground">{CONTACT.phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle size={16} aria-hidden className="shrink-0 text-primary" />
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  WhatsApp support
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} aria-hidden className="shrink-0 text-primary" />
                <a href={CONTACT.emailHref} className="hover:text-foreground">{CONTACT.email}</a>
              </p>
            </address>
            <p className="text-xs text-subtle">{storeHours}</p>
          </div>

          {[
            { title: "Shop", links: shopLinks },
            { title: "Company", links: companyLinks },
            { title: "Support", links: supportLinks },
          ].map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 grid gap-6 border-t border-border pt-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Stay in the loop</h3>
            <p className="mt-1 text-sm text-muted">
              Product news, guides and workshop dates. No spam.
            </p>
            <NewsletterForm className="mt-3 max-w-sm" />
          </div>
          <div className="text-sm text-muted md:text-right">
            <p className="font-medium text-foreground">Payments</p>
            <p className="mt-1">
              Paynow, EcoCash, bank transfer and pay-on-collection options are being
              finalised — payment methods shown at checkout reflect current availability.
            </p>
            <p className="mt-3 text-xs text-subtle">Social media channels coming soon.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-subtle sm:flex-row">
          <p>© {new Date().getFullYear()} Synergy Dynamics. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms &amp; Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
