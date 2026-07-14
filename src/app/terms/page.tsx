import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for purchasing from Synergy Dynamics.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Terms & Conditions" }]} />
      <h1 className="text-2xl font-semibold sm:text-3xl">Terms &amp; conditions</h1>

      <p className="mt-4 rounded-card border border-warning/40 bg-warning-surface px-4 py-3 text-sm text-warning">
        Draft terms — this page requires review and approval by Synergy Dynamics
        management (and, where appropriate, legal review) before it becomes binding.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Orders and pricing</h2>
          <p className="mt-2">
            Prices are listed in USD. An order is confirmed once we accept it and
            (for online payment methods) payment is verified. In the event of a
            clear pricing or stock error we may cancel and fully refund an order
            before dispatch.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Payment</h2>
          <p className="mt-2">
            Available payment methods are shown at checkout. Payment is confirmed
            server-side by the relevant provider; goods are dispatched or released
            for collection after confirmation, unless pay-on-collection was chosen.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Delivery and collection</h2>
          <p className="mt-2">
            Delivery timelines are estimates and delivery charges are confirmed
            before dispatch. Collection orders should be collected within 14 days
            of the ready-for-collection notice.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Quotations</h2>
          <p className="mt-2">
            Quotations are valid for the period stated on the quotation document
            and are subject to stock and exchange-rate movements until accepted.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Product use</h2>
          <p className="mt-2">
            Electronic components and kits must be used according to their
            documentation. Products are not toys unless explicitly stated; adult
            supervision is required for young learners.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about these terms: {CONTACT.email} or {CONTACT.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}
