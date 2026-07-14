import { createHash } from "node:crypto";
import type { PaymentInitiation, PaymentProvider, PaymentVerification } from "./types";

/**
 * Paynow (Zimbabwe) provider structure.
 *
 * Runs in MOCK mode until `PAYNOW_INTEGRATION_ID` and `PAYNOW_INTEGRATION_KEY`
 * are configured and end-to-end tested against the Paynow sandbox. In mock
 * mode no external calls are made and no payment is ever marked successful —
 * orders remain `pending_payment` for manual reconciliation.
 *
 * The hash scheme mirrors Paynow's documented SHA512 field-concatenation
 * signature so the switch to live credentials is a configuration change.
 */
const integrationId = process.env.PAYNOW_INTEGRATION_ID;
const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;

function paynowHash(values: string[], key: string): string {
  return createHash("sha512").update(values.join("") + key, "utf8").digest("hex").toUpperCase();
}

export const paynowProvider: PaymentProvider = {
  id: "paynow",
  label: "Paynow (EcoCash, OneMoney, Card)",
  isLive: false, // flip only after sandbox + live verification with real credentials

  async initiate({ orderNumber, totalCents }): Promise<PaymentInitiation> {
    if (!integrationId || !integrationKey) {
      // Mock mode: no external call; the order stays pending_payment.
      return {
        providerRef: `MOCK-PAYNOW-${orderNumber}`,
        instructions:
          "Paynow is running in test mode. Our team will contact you to arrange payment. No money has been taken.",
      };
    }
    // Live structure (unreachable until credentials are configured):
    // POST to https://www.paynow.co.zw/interface/initiatetransaction with
    // reference, amount, returnurl, resulturl and the SHA512 hash, then
    // redirect the customer to the returned browserurl.
    void totalCents;
    throw new Error(
      "Paynow credentials detected but live mode has not been verified. Complete sandbox testing first.",
    );
  },

  async verifyWebhook(rawBody, headers): Promise<PaymentVerification> {
    void headers;
    if (!integrationKey) {
      // Mock mode never confirms payments.
      return { ok: false, providerRef: "", outcome: "pending" };
    }
    const params = new URLSearchParams(rawBody);
    const receivedHash = params.get("hash") ?? "";
    const fields: string[] = [];
    params.forEach((value, key) => {
      if (key.toLowerCase() !== "hash") fields.push(value);
    });
    const expected = paynowHash(fields, integrationKey);
    if (expected !== receivedHash) {
      return { ok: false, providerRef: params.get("reference") ?? "", outcome: "pending" };
    }
    const status = (params.get("status") ?? "").toLowerCase();
    return {
      ok: true,
      providerRef: params.get("paynowreference") ?? params.get("reference") ?? "",
      outcome: status === "paid" || status === "awaiting delivery" ? "paid" : status === "cancelled" ? "failed" : "pending",
    };
  },
};
