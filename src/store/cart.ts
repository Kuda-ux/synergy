"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CartLine,
  cartCount,
  cartSubtotal,
  removeLine,
  setLineQuantity,
  upsertLine,
} from "@/lib/cart-math";

interface CartState {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) => set((s) => ({ lines: upsertLine(s.lines, line) })),
      setQuantity: (productId, quantity) =>
        set((s) => ({ lines: setLineQuantity(s.lines, productId, quantity) })),
      remove: (productId) => set((s) => ({ lines: removeLine(s.lines, productId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "sd-cart-v1" },
  ),
);

export const selectCartCount = (s: CartState) => cartCount(s.lines);
export const selectCartSubtotal = (s: CartState) => cartSubtotal(s.lines);
