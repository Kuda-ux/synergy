/**
 * Notification provider abstraction. The default transport logs to the server
 * console in development; a real email provider (SMTP/API) plugs in via
 * environment configuration without changing call sites.
 *
 * WhatsApp notifications are intentionally limited to customer-initiated
 * wa.me deep links elsewhere in the app — no unofficial automation.
 */
export type NotificationTemplate =
  | "order_received"
  | "payment_received"
  | "order_processing"
  | "ready_for_collection"
  | "order_dispatched"
  | "order_delivered"
  | "quotation_received"
  | "quotation_updated"
  | "password_reset";

export interface NotificationPayload {
  to: string;
  template: NotificationTemplate;
  subject: string;
  data: Record<string, string>;
}

export interface NotificationProvider {
  send(payload: NotificationPayload): Promise<void>;
}

const consoleProvider: NotificationProvider = {
  async send(payload) {
    // Dev transport: log only. Never include secrets or full card data (none exist).
    console.info(
      `[notification] template=${payload.template} to=${payload.to} subject="${payload.subject}"`,
    );
  },
};

export function getNotificationProvider(): NotificationProvider {
  // Future: return an SMTP/API-backed provider when EMAIL_* env vars are set.
  return consoleProvider;
}
