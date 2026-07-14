/**
 * Modular payment provider contract.
 *
 * Providers translate an order into a provider-specific payment session and
 * verify asynchronous webhook notifications. Rules enforced by design:
 *  - the browser is never trusted: success is only recorded after
 *    server-side verification (webhook or poll),
 *  - handlers are idempotent: re-delivered webhooks must not double-settle,
 *  - no card data ever touches this application.
 */
export interface PaymentInitiation {
  /** Where to send the customer (hosted payment page), if applicable. */
  redirectUrl?: string;
  /** Provider-side reference to store on the order. */
  providerRef: string;
  /** Human instructions (e.g. bank transfer details) when no redirect exists. */
  instructions?: string;
}

export interface PaymentVerification {
  ok: boolean;
  providerRef: string;
  /** `paid`, `failed` or `pending` after server-side verification. */
  outcome: "paid" | "failed" | "pending";
}

export interface PaymentProvider {
  readonly id: string;
  readonly label: string;
  /** True only when real merchant credentials are configured and verified. */
  readonly isLive: boolean;
  initiate(input: {
    orderNumber: string;
    email: string;
    totalCents: number;
    currency: string;
    returnUrl: string;
    webhookUrl: string;
  }): Promise<PaymentInitiation>;
  /** Verify an incoming webhook payload (signature/hash check included). */
  verifyWebhook(rawBody: string, headers: Record<string, string>): Promise<PaymentVerification>;
}
