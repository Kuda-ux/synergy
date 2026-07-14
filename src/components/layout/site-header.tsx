"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, MessageCircle, Menu, X } from "lucide-react";
import { CONTACT, MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { CartButton, CurrencyToggle, ThemeToggle, WishlistHeaderButton } from "./controls";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-accent-surface lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>

          <Logo className="shrink-0" />

          <SearchBar className="mx-2 hidden flex-1 md:block lg:mx-6 lg:max-w-xl" />

          <div className="ml-auto flex items-center gap-1">
            <CurrencyToggle />
            <ThemeToggle />
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent-surface hover:text-foreground sm:inline-flex"
              aria-label="Chat with us on WhatsApp"
              title="WhatsApp support"
            >
              <MessageCircle size={18} aria-hidden />
            </a>
            <Link
              href="/track-order"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent-surface hover:text-foreground sm:inline-flex"
              aria-label="Account and order tracking"
              title="Track order"
            >
              <CircleUserRound size={18} aria-hidden />
            </Link>
            <WishlistHeaderButton />
            <CartButton />
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>

        {/* Desktop category navigation */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="-mx-2 flex items-center gap-1 pb-2 text-sm">
            {MAIN_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-accent-surface hover:text-foreground",
                    pathname === item.href && "font-medium text-primary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-border bg-surface lg:hidden">
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {MAIN_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-accent-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-border pt-2">
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg px-3 py-2 text-sm text-primary hover:bg-accent-surface"
              >
                WhatsApp support: {CONTACT.phone}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
