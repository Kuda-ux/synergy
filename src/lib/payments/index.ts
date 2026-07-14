import type { PaymentProvider } from "./types";
import { paynowProvider } from "./paynow";

/**
 * Offline methods (bank transfer, pay on collection) are settled manually by
 * staff; they share the same PaymentProvider contract so order handling is
 * uniform. Additional gateways (PayPal, card processors) register here.
 */
const offlineProvider = (id: string, label: string, instructions: string): PaymentProvider => ({
  id,
  label,
  isLive: true, // "live" in the sense that the instructions are real and manual
  async initiate({ orderNumber }) {
    return { providerRef: `${id.toUpperCase()}-${orderNumber}`, instructions };
  },
  async verifyWebhook() {
    return { ok: false, providerRef: "", outcome: "pending" };
  },
});

const providers: Record<string, PaymentProvider> = {
  paynow: paynowProvider,
  bank_transfer: offlineProvider(
    "bank_transfer",
    "Bank Transfer",
    "Banking details will be shared by our team when your order is confirmed. Please quote your order number as the payment reference.",
  ),
  pay_on_collection: offlineProvider(
    "pay_on_collection",
    "Pay on Collection",
    "Pay by cash or card when collecting at Shop F04, Upstairs, Park City Village Mall, 26 Park Street, Harare.",
  ),
};

export function getPaymentProvider(id: string): PaymentProvider {
  const provider = providers[id];
  if (!provider) throw new Error(`Unknown payment provider: ${id}`);
  return provider;
}
