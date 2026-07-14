import { describe, expect, it } from "vitest";
import {
  assertValidCents,
  convertUsdCentsToZwgCents,
  formatCents,
  formatDisplayPrice,
  multiplyCents,
  sumCents,
} from "@/lib/money";

describe("money (integer minor units)", () => {
  it("rejects non-integer and negative amounts", () => {
    expect(() => assertValidCents(10.5)).toThrow();
    expect(() => assertValidCents(-1)).toThrow();
    expect(() => assertValidCents(Number.NaN)).toThrow();
    expect(() => assertValidCents(100)).not.toThrow();
  });

  it("multiplies unit price by quantity safely", () => {
    expect(multiplyCents(3450, 3)).toBe(10350);
    expect(() => multiplyCents(3450, 0)).toThrow();
    expect(() => multiplyCents(3450, 1.5)).toThrow();
  });

  it("sums line totals", () => {
    expect(sumCents([100, 250, 3450])).toBe(3800);
    expect(sumCents([])).toBe(0);
    expect(() => sumCents([100, -5])).toThrow();
  });

  it("converts USD cents to ZWG cents with integer rounding", () => {
    // $1.00 at 2650 ZWG-cents per USD => 2650 ZWG cents
    expect(convertUsdCentsToZwgCents(100, 2650)).toBe(2650);
    // $34.50 => 34.5 * 2650 = 91425
    expect(convertUsdCentsToZwgCents(3450, 2650)).toBe(91425);
    // rounding: 1 cent at 2650 => 26.5 -> 27 (half-up)
    expect(convertUsdCentsToZwgCents(1, 2650)).toBe(27);
    expect(() => convertUsdCentsToZwgCents(100, 0)).toThrow();
  });

  it("formats both currencies", () => {
    expect(formatCents(3450, "USD")).toBe("$34.50");
    expect(formatCents(91425, "ZWG")).toMatch(/^ZWG/);
  });

  it("falls back to USD when no ZWG rate is configured", () => {
    expect(formatDisplayPrice(3450, "ZWG", null)).toBe("$34.50");
    expect(formatDisplayPrice(3450, "ZWG", 2650)).toMatch(/^ZWG/);
    expect(formatDisplayPrice(3450, "USD", 2650)).toBe("$34.50");
  });
});
