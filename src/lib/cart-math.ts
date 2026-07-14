import { multiplyCents, sumCents } from "./money";

/** Client-safe cart line shape persisted in localStorage. Prices held here are
 * for display only — the server re-reads authoritative prices at checkout. */
export interface CartLine {
  productId: string;
  slug: string;
  path: string;
  name: string;
  sku: string;
  unitPriceCents: number;
  imageUrl: string | null;
  imageAlt: string;
  quantity: number;
  maxQty: number; // last-known stock, for optimistic clamping
}

export const MAX_LINE_QTY = 99;

export function clampQuantity(qty: number, maxQty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(Math.floor(qty), Math.min(maxQty, MAX_LINE_QTY)));
}

export function lineTotal(line: Pick<CartLine, "unitPriceCents" | "quantity">): number {
  return multiplyCents(line.unitPriceCents, line.quantity);
}

export function cartSubtotal(lines: Pick<CartLine, "unitPriceCents" | "quantity">[]): number {
  return sumCents(lines.map(lineTotal));
}

export function cartCount(lines: Pick<CartLine, "quantity">[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

export function upsertLine(lines: CartLine[], incoming: CartLine): CartLine[] {
  const existing = lines.find((l) => l.productId === incoming.productId);
  if (!existing) {
    return [...lines, { ...incoming, quantity: clampQuantity(incoming.quantity, incoming.maxQty) }];
  }
  return lines.map((l) =>
    l.productId === incoming.productId
      ? { ...l, ...incoming, quantity: clampQuantity(l.quantity + incoming.quantity, incoming.maxQty) }
      : l,
  );
}

export function setLineQuantity(lines: CartLine[], productId: string, quantity: number): CartLine[] {
  return lines
    .map((l) => (l.productId === productId ? { ...l, quantity: clampQuantity(quantity, l.maxQty) } : l))
    .filter((l) => l.quantity > 0);
}

export function removeLine(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((l) => l.productId !== productId);
}
