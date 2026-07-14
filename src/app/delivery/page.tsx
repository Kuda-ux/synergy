import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DELIVERY_METHODS, CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Delivery Information",
  description: "Store collection, Harare delivery, nationwide courier and international shipping from Synergy Dynamics.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Delivery Information" }]} />
      <h1 className="text-2xl font-semibold sm:text-3xl">Delivery information</h1>
      <p className="mt-3 text-muted">
        Choose the option that suits you at checkout. Delivery charges are
        confirmed with you before dispatch — we never surprise you with fees.
      </p>

      <div className="mt-8 space-y-4">
        {DELIVERY_METHODS.map((method) => (
          <div key={method.value} className="rounded-card border border-border bg-surface p-6">
            <h2 className="font-semibold">{method.label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{method.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-card border border-info/40 bg-info-surface p-6 text-sm text-info">
        <p className="font-semibold">Collection address</p>
        <p className="mt-1">
          {CONTACT.address.line1}, {CONTACT.address.line2}, {CONTACT.address.line3},{" "}
          {CONTACT.address.city}, {CONTACT.address.country}. Please wait for the
          &ldquo;ready for collection&rdquo; confirmation before travelling.
        </p>
      </div>

      <p className="mt-8 text-xs text-subtle">
        Delivery rates and courier partners are being finalised and will be
        published here once confirmed by Synergy Dynamics.
      </p>
    </div>
  );
}
