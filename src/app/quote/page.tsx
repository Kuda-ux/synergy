import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { QuoteForm } from "@/components/forms/quote-form";

export const metadata: Metadata = {
  title: "Request a Quotation",
  description:
    "Formal quotations for schools, universities, government departments, businesses and bulk buyers — with purchase-order support.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "Request a Quotation" }]} />
      <h1 className="text-2xl font-semibold sm:text-3xl">Request a quotation</h1>
      <p className="mt-3 mb-8 text-muted">
        For schools, universities, government departments, companies and bulk
        buyers. Tell us what you need and our team will respond with a formal
        quotation and a reference number you can track.
      </p>
      <QuoteForm />
    </div>
  );
}
