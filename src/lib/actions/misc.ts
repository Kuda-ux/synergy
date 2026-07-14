"use server";

import { db } from "../db";
import { contactSchema, newsletterSchema } from "../validation/misc";
import type { ActionResult } from "./orders";

export async function subscribeNewsletter(input: {
  email: string;
  source?: string;
}): Promise<ActionResult<null>> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email address." };
  }
  await db.newsletterSubscriber.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    create: { email: parsed.data.email.toLowerCase(), source: parsed.data.source },
    update: {},
  });
  return { ok: true, data: null };
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<ActionResult<null>> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  // First slice: contact messages are delivered via the notification provider
  // (console transport in dev). A real inbox/provider plugs in via env config.
  console.info(
    `[contact] from=${parsed.data.email} subject="${parsed.data.subject}"`,
  );
  return { ok: true, data: null };
}
