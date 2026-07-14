"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "./catalog-params";

export function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="catalog-sort" className="text-sm text-muted">
        Sort by
      </label>
      <select
        id="catalog-sort"
        value={current}
        onChange={(e) => {
          const sp = new URLSearchParams(searchParams.toString());
          sp.set("sort", e.target.value);
          sp.delete("page");
          router.replace(`${pathname}?${sp.toString()}`);
        }}
        className="h-9 rounded-lg border border-border bg-surface px-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
