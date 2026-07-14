import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Quotation Request Received",
  robots: { index: false },
};

export default async function QuoteConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <FileCheck2 size={48} aria-hidden className="mx-auto text-success" />
      <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Quotation request received</h1>
      <p className="mt-3 text-muted">
        Your reference number is{" "}
        <span className="font-mono font-semibold text-foreground">{decodeURIComponent(reference)}</span>.
        Our sales team will review your request and respond by email or phone.
        Please quote this reference in any follow-up.
      </p>
      <p className="mt-6 text-sm text-muted">
        Need it urgently?{" "}
        <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">
          Message us on WhatsApp
        </a>{" "}
        or call {CONTACT.phone}.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/shop" variant="outline">Browse Products</ButtonLink>
        <ButtonLink href="/">Back to Home</ButtonLink>
      </div>
    </div>
  );
}
