"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Heart, Moon, ShoppingCart, Sun } from "lucide-react";
import { usePreferences } from "@/store/preferences";
import { useCart, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useStoreConfig } from "@/components/providers";
import { CURRENCIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

const iconButton =
  "relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent-surface hover:text-foreground";

export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      className={iconButton}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}

export function CurrencyToggle() {
  const mounted = useMounted();
  const currency = usePreferences((s) => s.currency);
  const setCurrency = usePreferences((s) => s.setCurrency);
  const { zwgCentsPerUsd } = useStoreConfig();

  // ZWG display only becomes available once an admin-configured rate exists.
  if (!zwgCentsPerUsd) return null;
  const active = mounted ? currency : "USD";
  return (
    <div className="hidden items-center rounded-lg border border-border p-0.5 sm:inline-flex" role="group" aria-label="Display currency">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={active === c}
          className={cn(
            "rounded-md px-2 py-1 font-mono text-xs transition-colors",
            active === c ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function CountBubble({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function CartButton() {
  const mounted = useMounted();
  const count = useCart(selectCartCount);
  return (
    <Link href="/cart" className={iconButton} aria-label={`Cart, ${mounted ? count : 0} items`}>
      <ShoppingCart size={18} aria-hidden />
      {mounted && <CountBubble count={count} />}
    </Link>
  );
}

export function WishlistHeaderButton() {
  const mounted = useMounted();
  const count = useWishlist((s) => s.items.length);
  return (
    <Link href="/wishlist" className={iconButton} aria-label={`Wishlist, ${mounted ? count : 0} items`}>
      <Heart size={18} aria-hidden />
      {mounted && <CountBubble count={count} />}
    </Link>
  );
}
