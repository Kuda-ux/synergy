import { createHash } from "node:crypto";
import type { PaymentInitiation, PaymentProvider, PaymentVerification } from "./types";

/**
 * Paynow (Zimbabwe) Advanced Integration (API).
 *
 * This is the server-to-server integration for 3rd-party shopping carts.
 * Customer is redirected to Paynow's hosted payment page, then Paynow POSTs
 * the result to /api/paynow/webhook where the SHA512 hash is verified before
 * the order status is updated.
 *
 * Sandbox mode uses https://staging.paynow.co.zw. Set PAYNOW_ENV=sandbox to
 * test, otherwise it points at the live endpoint.
 */
const integrationId = process.env.PAYNOW_INTEGRATION_ID;
const integrationKey = process.env.PAYNOW_INTEGRATION_KEY;
const paynowEnv = process.env.PAYNOW_ENV ?? "production";
const isSandbox = paynowEnv === "sandbox" || paynowEnv === "staging";

const INITIATE_URL = isSandbox
  ? "https://staging.paynow.co.zw/interface/initiatetransaction"
  : "https://www.paynow.co.zw/interface/initiatetransaction";

function isConfigured() {
  return Boolean(integrationId) && Boolean(integrationKey);
}

function hashFromValues(values: string[], key: string): string {
  return createHash("sha512").update(values.join("") + key, "utf8").digest("hex").toUpperCase();
}

/** Build a hash from ordered params, excluding any 'hash' key. */
function hashFromParams(params: URLSearchParams, key: string): string {
  const values: string[] = [];
  params.forEach((value, pkey) => {
    if (pkey.toLowerCase() !== "hash") values.push(decodeURIComponent(value));
  });
  return hashFromValues(values, key);
}

/** Format cents to 2-decimal USD string for Paynow. */
function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

export const paynowProvider: PaymentProvider = {
  id: "paynow",
  label: isConfigured() ? "Paynow (EcoCash, OneMoney, Card)" : "Paynow (test mode)",
  isLive: isConfigured() && !isSandbox,

  async initiate({ orderNumber, email, totalCents, returnUrl, webhookUrl }): Promise<PaymentInitiation> {
    if (!integrationId || !integrationKey) {
      return {
        providerRef: `MOCK-PAYNOW-${orderNumber}`,
        instructions:
          "Paynow is running in test mode. Our team will contact you to arrange payment. No money has been taken.",
      };
    }

    const amount = formatAmount(totalCents);
    const fields = [
      integrationId,
      orderNumber,
      amount,
      `Order ${orderNumber}`,
      returnUrl,
      webhookUrl,
      email,
      "Message",
    ];
    const hash = hashFromValues(fields, integrationKey);

    const body = new URLSearchParams({
      id: integrationId,
      reference: orderNumber,
      amount,
      additionalinfo: `Order ${orderNumber}`,
      returnurl: returnUrl,
      resulturl: webhookUrl,
      authemail: email,
      status: "Message",
      hash,
    });

    const res = await fetch(INITIATE_URL, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!res.ok) {
      throw new Error(`Paynow initiate returned HTTP ${res.status}`);
    }

    const responseText = await res.text();
    const responseParams = new URLSearchParams(responseText);
    const status = (responseParams.get("status") ?? "").toLowerCase();
    const receivedHash = responseParams.get("hash") ?? "";
    const expectedHash = hashFromParams(responseParams, integrationKey);

    if (receivedHash.toUpperCase() !== expectedHash) {
      throw new Error("Paynow initiate response hash mismatch");
    }

    if (status !== "ok") {
      throw new Error(`Paynow initiate failed: ${responseParams.get("error") ?? status}`);
    }

    const browserUrl = responseParams.get("browserurl");
    if (!browserUrl) {
      throw new Error("Paynow did not return a browser URL");
    }

    return {
      providerRef: `PAYNOW-${orderNumber}`,
      redirectUrl: browserUrl,
    };
  },

  async verifyWebhook(rawBody, _headers): Promise<PaymentVerification> {
    if (!integrationKey) {
      return { ok: false, providerRef: "", outcome: "pending" };
    }
    const params = new URLSearchParams(rawBody);
    const receivedHash = params.get("hash") ?? "";
    const expected = hashFromParams(params, integrationKey);

    if (receivedHash.toUpperCase() !== expected) {
      return { ok: false, providerRef: params.get("reference") ?? "", outcome: "pending" };
    }

    const status = (params.get("status") ?? "").toLowerCase();
    return {
      ok: true,
      providerRef: params.get("paynowreference") ?? params.get("reference") ?? "",
      outcome:
        status === "paid" || status === "awaiting delivery"
          ? "paid"
          : status === "cancelled"
            ? "failed"
            : "pending",
    };
  },
};
