"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, TextareaField } from "@/components/ui/form";
import { submitContactMessage } from "@/lib/actions/misc";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-card border border-success/40 bg-success-surface px-5 py-6 text-center">
        <CheckCircle2 size={32} aria-hidden className="mx-auto text-success" />
        <p className="mt-2 font-medium text-success">Message sent — we&apos;ll get back to you soon.</p>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await submitContactMessage({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? "") || undefined,
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      if (result.ok) {
        setSent(true);
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {error && (
        <p role="alert" className="rounded-card border border-danger/40 bg-danger-surface px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Your name" name="name" required error={fieldErrors.name} autoComplete="name" />
        <InputField label="Email" name="email" type="email" required error={fieldErrors.email} autoComplete="email" />
        <InputField label="Phone / WhatsApp" name="phone" type="tel" error={fieldErrors.phone} hint="Optional" autoComplete="tel" />
        <InputField label="Subject" name="subject" required error={fieldErrors.subject} />
      </div>
      <TextareaField label="Message" name="message" required error={fieldErrors.message} rows={6} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
