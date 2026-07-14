import type { CatalogQuery, CatalogSort } from "@/lib/catalog";

export type SearchParams = Record<string, string | string[] | undefined>;

const sorts: CatalogSort[] = ["relevance", "price-asc", "price-desc", "newest", "popular"];

export const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popularity" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function many(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function dollarsToCents(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.round(n * 100);
}

/** Parse and sanitise catalogue filters from URL search params. */
export function parseCatalogParams(params: SearchParams): CatalogQuery {
  const sortRaw = first(params.sort);
  return {
    q: first(params.q)?.slice(0, 100),
    brandSlugs: many(params.brand).slice(0, 20),
    minPriceCents: dollarsToCents(first(params.min)),
    maxPriceCents: dollarsToCents(first(params.max)),
    inStockOnly: first(params.instock) === "1",
    sort: sorts.includes(sortRaw as CatalogSort) ? (sortRaw as CatalogSort) : "relevance",
    page: Math.max(Number.parseInt(first(params.page) ?? "1", 10) || 1, 1),
  };
}

/** Rebuild a query string, replacing the given keys. */
export function buildQueryString(params: SearchParams, overrides: Record<string, string | string[] | null>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key in overrides) continue;
    for (const v of many(value)) sp.append(key, v);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === null) continue;
    for (const v of Array.isArray(value) ? value : [value]) sp.append(key, v);
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
