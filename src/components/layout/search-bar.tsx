"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  name: string;
  sku: string;
  path: string;
  priceLabel: string;
  category: string;
}

/** Predictive product search backed by /api/search (name, SKU, brand, keywords). */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Suggestion[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = (await res.json()) as { results: Suggestion[] };
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch {
        // aborted or offline — keep previous results
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) {
            setOpen(false);
            router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }
        }}
      >
        <label htmlFor="site-search" className="sr-only">
          Search products by name, SKU or keyword
        </label>
        <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          id="site-search"
          type="search"
          placeholder="Search products, SKUs, brands…"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            const next = e.target.value;
            setQ(next);
            setOpen(true);
            const term = next.trim();
            if (term.length < 2) {
              setResults([]);
              setLoading(false);
            } else {
              setLoading(true);
            }
          }}
          onFocus={() => setOpen(true)}
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
        />
        {loading && (
          <Loader2 size={16} aria-hidden className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-subtle" />
        )}
      </form>
      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-card border border-border bg-surface shadow-xl">
          {results.length === 0 && !loading ? (
            <p className="px-4 py-6 text-center text-sm text-muted">
              No products match “{q.trim()}”.
            </p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.path}>
                  <Link
                    href={r.path}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-accent-surface"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{r.name}</span>
                      <span className="block truncate text-xs text-subtle">
                        {r.category} · <span className="font-mono">{r.sku}</span>
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs">{r.priceLabel}</span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-border">
                <Link
                  href={`/search?q=${encodeURIComponent(q.trim())}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-accent-surface"
                >
                  View all results
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
