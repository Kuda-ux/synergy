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

function hashString(input: string): string {
  return createHash("sha512").update(input, "utf8").digest("hex").toUpperCase();
}

function hashFromValues(values: string[], key: string): string {
  return hashString(values.join("") + key);
}

/** Validate a Paynow inbound message hash per their docs:
 *  1. Split the message by '&' into key=value pairs.
 *  2. Split each pair on the first '=' into a key and a value.
 *  3. URL-decode each value and join all values EXCEPT the 'hash' value.
 *  4. Append the Integration Key.
 *  5. SHA-512 the result, uppercase hex.
 */
function verifyPaynowHash(rawMessage: string, key: string): { received: string; expected: string } {
  const pairs = rawMessage.split("&");
  const values: string[] = [];
  let received = "";
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    const pkey = idx === -1 ? pair : pair.slice(0, idx);
    const pvalue = idx === -1 ? "" : pair.slice(idx + 1);
    if (pkey.toLowerCase() === "hash") {
      received = pvalue;
      continue;
    }
    try {
      values.push(decodeURIComponent(pvalue));
    } catch {
      // If decoding fails, use the raw value.
      values.push(pvalue);
    }
  }
  const expected = hashString(values.join("") + key);
  return { received: received.toUpperCase(), expected };
}

function safeString(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  return String(value);
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
    const { received, expected } = verifyPaynowHash(responseText, integrationKey);
    console.error("Paynow initiate response:", responseText);
    console.error("Paynow hash check — received:", received, "expected:", expected);

    if (received !== expected) {
      throw new Error("Paynow initiate response hash mismatch");
    }

    const responseParams = new URLSearchParams(responseText);
    const status = safeString(responseParams.get("status")).toLowerCase();

    if (status !== "ok") {
      throw new Error(`Paynow initiate failed: ${safeString(responseParams.get("error")) || status || "unknown error"}`);
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
    const { received, expected } = verifyPaynowHash(rawBody, integrationKey);
    console.error("Paynow webhook hash check — received:", received, "expected:", expected);

    if (received !== expected) {
      const params = new URLSearchParams(rawBody);
      return { ok: false, providerRef: params.get("reference") ?? "", outcome: "pending" };
    }

    const params = new URLSearchParams(rawBody);
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
