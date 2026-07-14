import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Returns and Warranty",
  description: "Returns process and warranty information for Synergy Dynamics purchases.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Returns & Warranty" }]} />
      <h1 className="text-2xl font-semibold sm:text-3xl">Returns &amp; warranty</h1>

      <p className="mt-4 rounded-card border border-warning/40 bg-warning-surface px-4 py-3 text-sm text-warning">
        Draft policy — this page requires review and approval by Synergy Dynamics
        management before it becomes binding.
      </p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Faulty or incorrect items</h2>
          <p className="mt-2">
            If an item arrives faulty, damaged or different from what you ordered,
            contact us within 7 days of receiving it with your order number and a
            description (photos help). We will arrange repair, replacement or refund
            according to the product&apos;s warranty terms.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Warranty</h2>
          <p className="mt-2">
            Warranty periods vary by product and are shown on each product page
            where applicable. Warranties cover manufacturing defects under normal
            use; they do not cover damage from incorrect wiring, over-voltage,
            physical damage or modification.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Change-of-mind returns</h2>
          <p className="mt-2">
            Unopened items in original packaging may be returned within 7 days for
            store credit or exchange, at our discretion. Consumables, opened
            component packs and cut-to-order items cannot be returned unless faulty.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">How to start a return</h2>
          <p className="mt-2">
            Message us on WhatsApp at {CONTACT.phone} or email {CONTACT.email} with
            your order number. We&apos;ll confirm the next steps, including drop-off
            at our Harare store or courier arrangements.
          </p>
        </section>
      </div>
    </div>
  );
}
