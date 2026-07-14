"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions/misc";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={cn("space-y-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await subscribeNewsletter({ email, source: "footer" });
          setStatus(
            result.ok
              ? { ok: true, message: "Thanks — you're subscribed." }
              : { ok: false, message: result.error ?? "Something went wrong. Please try again." },
          );
          if (result.ok) setEmail("");
        });
      }}
    >
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Joining…" : "Subscribe"}
        </Button>
      </div>
      {status && (
        <p role="status" className={cn("text-xs", status.ok ? "text-success" : "text-danger")}>
          {status.message}
        </p>
      )}
    </form>
  );
}
