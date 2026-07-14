import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about ordering, delivery, payments, collection and institutional purchasing at Synergy Dynamics.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  { q: "Where can I collect my order?", a: "From our store at Shop F04, Upstairs, Park City Village Mall, 26 Park Street, Harare. Choose “Store Collection” at checkout and wait for the ready-for-collection confirmation before travelling." },
  { q: "Do you deliver outside Harare?", a: "Yes — we deliver nationwide by courier. Delivery cost depends on your location and parcel size, and is confirmed with you before dispatch." },
  { q: "Do you ship internationally?", a: "International orders are handled by quotation: place your enquiry at checkout or via the quotation page and we'll confirm shipping options and cost before any payment." },
  { q: "How can I pay?", a: "Current options are shown at checkout. Online payment via Paynow (EcoCash, OneMoney, card) is being finalised; bank transfer and pay-on-collection are available. No card details are ever entered or stored on this website." },
  { q: "Can I pay in ZWG?", a: "Prices are listed in USD. ZWG display uses the store's configured exchange rate; the settlement currency is always confirmed at checkout and on your order." },
  { q: "Do you supply schools and companies?", a: "Yes. Use the Request a Quotation page for formal quotations with purchase-order support, bulk pricing and delivery coordination." },
  { q: "Do your products come with support?", a: "Yes — we offer technical product support on WhatsApp and in-store. If you're stuck wiring or coding something you bought from us, ask us." },
  { q: "How do I track my order?", a: "Use the Track Order page with your order number and the email you used at checkout." },
  { q: "What if an item arrives faulty?", a: "Contact us as soon as possible with your order number. See the Returns & Warranty page for the process — faulty items are repaired, replaced or refunded according to the product's warranty." },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "FAQs" }]} />
      <h1 className="mb-8 text-2xl font-semibold sm:text-3xl">Frequently asked questions</h1>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.q} className="group rounded-card border border-border bg-surface p-5">
            <summary className="cursor-pointer text-sm font-semibold marker:text-primary">
              {faq.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
}
