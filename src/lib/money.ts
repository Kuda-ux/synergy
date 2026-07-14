import type { Currency } from "./constants";

/**
 * All monetary values are stored and calculated as integer minor units
 * (USD cents). Floating point is never used for arithmetic; conversion to
 * ZWG uses integer math against an admin-controlled rate expressed in
 * ZWG cents per USD dollar.
 */

export function assertValidCents(cents: number): void {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new Error(`Invalid monetary amount: ${cents}`);
  }
}

export function multiplyCents(unitCents: number, quantity: number): number {
  assertValidCents(unitCents);
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new Error(`Invalid quantity: ${quantity}`);
  }
  const total = unitCents * quantity;
  assertValidCents(total);
  return total;
}

export function sumCents(values: number[]): number {
  return values.reduce((acc, v) => {
    assertValidCents(v);
    return acc + v;
  }, 0);
}

/** Convert USD cents to ZWG cents given a rate in ZWG *cents* per USD *dollar*. */
export function convertUsdCentsToZwgCents(usdCents: number, zwgCentsPerUsd: number): number {
  assertValidCents(usdCents);
  if (!Number.isSafeInteger(zwgCentsPerUsd) || zwgCentsPerUsd <= 0) {
    throw new Error(`Invalid exchange rate: ${zwgCentsPerUsd}`);
  }
  // (usdCents / 100) * zwgCentsPerUsd, rounded half-up in integer math.
  return Math.round((usdCents * zwgCentsPerUsd) / 100);
}

const FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  // ZWG is not yet a registered Intl currency code everywhere; format manually.
  ZWG: new Intl.NumberFormat("en-ZW", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

export function formatCents(cents: number, currency: Currency = "USD"): string {
  assertValidCents(cents);
  const major = cents / 100; // display only — arithmetic is always integer
  if (currency === "ZWG") return `ZWG ${FORMATTERS.ZWG.format(major)}`;
  return FORMATTERS.USD.format(major);
}

/** Display helper: format a USD-cents price in the shopper's selected currency. */
export function formatDisplayPrice(
  usdCents: number,
  displayCurrency: Currency,
  zwgCentsPerUsd: number | null,
): string {
  if (displayCurrency === "ZWG" && zwgCentsPerUsd) {
    return formatCents(convertUsdCentsToZwgCents(usdCents, zwgCentsPerUsd), "ZWG");
  }
  return formatCents(usdCents, "USD");
}
