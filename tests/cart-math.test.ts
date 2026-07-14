import { describe, expect, it } from "vitest";
import {
  cartCount,
  cartSubtotal,
  clampQuantity,
  lineTotal,
  removeLine,
  setLineQuantity,
  upsertLine,
  type CartLine,
} from "@/lib/cart-math";

const line = (overrides: Partial<CartLine> = {}): CartLine => ({
  productId: "p1",
  slug: "demo",
  path: "/shop/robotics-kits/demo",
  name: "Demo Product",
  sku: "SD-XX-0001",
  unitPriceCents: 1000,
  imageUrl: null,
  imageAlt: "",
  quantity: 1,
  maxQty: 10,
  ...overrides,
});

describe("cart math", () => {
  it("clamps quantities to stock and sane bounds", () => {
    expect(clampQuantity(5, 10)).toBe(5);
    expect(clampQuantity(0, 10)).toBe(1);
    expect(clampQuantity(50, 10)).toBe(10);
    expect(clampQuantity(500, 1000)).toBe(99);
    expect(clampQuantity(Number.NaN, 10)).toBe(1);
  });

  it("computes line and cart totals with integer math", () => {
    expect(lineTotal(line({ quantity: 3 }))).toBe(3000);
    const lines = [line(), line({ productId: "p2", unitPriceCents: 250, quantity: 4 })];
    expect(cartSubtotal(lines)).toBe(2000);
    expect(cartCount(lines)).toBe(5);
  });

  it("merges duplicate products on upsert and clamps to stock", () => {
    let lines = upsertLine([], line({ quantity: 2 }));
    lines = upsertLine(lines, line({ quantity: 3 }));
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(5);
    lines = upsertLine(lines, line({ quantity: 99 }));
    expect(lines[0].quantity).toBe(10); // clamped to maxQty
  });

  it("updates and removes lines", () => {
    const lines = [line(), line({ productId: "p2" })];
    const updated = setLineQuantity(lines, "p2", 7);
    expect(updated.find((l) => l.productId === "p2")?.quantity).toBe(7);
    const removed = removeLine(updated, "p1");
    expect(removed).toHaveLength(1);
    expect(removed[0].productId).toBe("p2");
  });
});
