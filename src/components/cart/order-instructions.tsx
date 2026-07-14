"use client";

import { useMemo } from "react";
import { useSessionStorageString } from "@/hooks/use-session-storage";

function parseInstructions(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "instructions" in parsed) {
      const value = (parsed as { instructions: unknown }).instructions;
      if (typeof value === "string") return value;
    }
  } catch {
    // no instructions available — the email/notification covers it
  }
  return null;
}

/** Shows payment instructions handed over from checkout via sessionStorage. */
export function OrderInstructions({ orderNumber }: { orderNumber: string }) {
  const raw = useSessionStorageString(`sd-order-${orderNumber}`);
  const instructions = useMemo(() => parseInstructions(raw), [raw]);

  if (!instructions) return null;
  return (
    <div className="mt-6 rounded-card border border-info/40 bg-info-surface px-5 py-4 text-left text-sm text-info">
      <p className="font-semibold">Next steps</p>
      <p className="mt-1">{instructions}</p>
    </div>
  );
}
