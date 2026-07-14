"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/lib/constants";

interface PreferencesState {
  /** Display currency only — settlement is always confirmed at checkout. */
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "sd-preferences-v1" },
  ),
);
