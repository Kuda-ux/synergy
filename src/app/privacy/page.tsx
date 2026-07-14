import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Synergy Dynamics collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Privacy Policy" }]} />
      <h1 className="text-2xl font-semibold sm:text-3xl">Privacy policy</h1>

      <p className="mt-4 rounded-card border border-warning/40 bg-warning-surface px-4 py-3 text-sm text-warning">
        Draft policy — this page requires review and approval by Synergy Dynamics
        management (and, where appropriate, legal review) before publication.
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
          <p className="mt-2">
            When you place an order or request a quotation we collect the details
            needed to fulfil it: your name, contact details, delivery address and
            order contents. Newsletter signup stores only your email address.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">What we do not collect</h2>
          <p className="mt-2">
            We never see or store card numbers. Online payments are processed by
            the payment provider (e.g. Paynow); we only receive confirmation of
            payment status.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">How we use your information</h2>
          <p className="mt-2">
            To process orders and quotations, arrange delivery, provide support and
            — only if you subscribed — send occasional product and workshop news.
            We do not sell personal information.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Cookies and local storage</h2>
          <p className="mt-2">
            The site uses browser storage to remember your cart, wishlist, theme
            and currency preference on your own device. Analytics, if enabled, will
            be disclosed here.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Your choices</h2>
          <p className="mt-2">
            You may request a copy or deletion of your personal data by contacting{" "}
            {CONTACT.email}. Newsletter emails include an unsubscribe option.
          </p>
        </section>
      </div>
    </div>
  );
}
