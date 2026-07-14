"use client";

import { AlertTriangle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <AlertTriangle size={48} aria-hidden className="text-warning" />
      <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Something went wrong</h1>
      <p className="mt-3 text-muted">
        An unexpected error occurred. Please try again — if it keeps happening,
        contact us on WhatsApp and mention what you were doing.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-subtle">Error reference: {error.digest}</p>
      )}
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <ButtonLink href="/" variant="outline">Back to Home</ButtonLink>
      </div>
    </div>
  );
}
