"use client";

import { formatCents, formatDisplayPrice } from "@/lib/money";
import { usePreferences } from "@/store/preferences";
import { useStoreConfig } from "@/components/providers";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Displays a USD-stored price in the shopper's selected display currency.
 * Renders USD until mounted to keep server/client HTML identical.
 */
export function Price({
  usdCents,
  compareAtUsdCents,
  className,
  compareClassName,
}: {
  usdCents: number;
  compareAtUsdCents?: number | null;
  className?: string;
  compareClassName?: string;
}) {
  const mounted = useMounted();
  const currency = usePreferences((s) => s.currency);
  const { zwgCentsPerUsd } = useStoreConfig();

  const display = mounted
    ? formatDisplayPrice(usdCents, currency, zwgCentsPerUsd)
    : formatCents(usdCents, "USD");
  const compare =
    compareAtUsdCents && compareAtUsdCents > usdCents
      ? mounted
        ? formatDisplayPrice(compareAtUsdCents, currency, zwgCentsPerUsd)
        : formatCents(compareAtUsdCents, "USD")
      : null;

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-mono font-semibold tabular-nums">{display}</span>
      {compare && (
        <s className={cn("font-mono text-xs text-subtle tabular-nums", compareClassName)}>{compare}</s>
      )}
    </span>
  );
}
