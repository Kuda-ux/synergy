import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { TrackOrderForm } from "@/components/forms/track-order-form";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Check the live status of your Synergy Dynamics order.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Track Order" }]} />
      <h1 className="text-2xl font-semibold sm:text-3xl">Track your order</h1>
      <p className="mt-3 mb-8 text-muted">
        Use the order number from your confirmation together with the email
        address used at checkout.
      </p>
      <TrackOrderForm />
    </div>
  );
}
