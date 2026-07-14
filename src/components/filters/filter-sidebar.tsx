import Link from "next/link";
import type { CatalogQuery } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

interface BrandOption {
  slug: string;
  name: string;
}

/**
 * Progressive-enhancement filter form: a plain GET form that works without
 * JavaScript. Submitting rebuilds the URL query; sort/search params are
 * preserved via hidden inputs.
 */
export function FilterSidebar({
  basePath,
  query,
  brands,
}: {
  basePath: string;
  query: CatalogQuery;
  brands: BrandOption[];
}) {
  const hasFilters =
    (query.brandSlugs?.length ?? 0) > 0 ||
    query.minPriceCents != null ||
    query.maxPriceCents != null ||
    query.inStockOnly;

  return (
    <form method="GET" action={basePath} className="space-y-6" aria-label="Filter products">
      {query.q && <input type="hidden" name="q" value={query.q} />}
      {query.sort && query.sort !== "relevance" && <input type="hidden" name="sort" value={query.sort} />}

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Availability</legend>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="instock"
            value="1"
            defaultChecked={query.inStockOnly}
            className="h-4 w-4 rounded border-border-strong accent-(--brand-600)"
          />
          In stock only
        </label>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Price (USD)</legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="filter-min">Minimum price</label>
          <input
            id="filter-min"
            type="number"
            name="min"
            min={0}
            step="0.01"
            placeholder="Min"
            defaultValue={query.minPriceCents != null ? query.minPriceCents / 100 : ""}
            className="h-9 w-full rounded-lg border border-border bg-surface px-2 font-mono text-sm"
          />
          <span className="text-subtle">–</span>
          <label className="sr-only" htmlFor="filter-max">Maximum price</label>
          <input
            id="filter-max"
            type="number"
            name="max"
            min={0}
            step="0.01"
            placeholder="Max"
            defaultValue={query.maxPriceCents != null ? query.maxPriceCents / 100 : ""}
            className="h-9 w-full rounded-lg border border-border bg-surface px-2 font-mono text-sm"
          />
        </div>
      </fieldset>

      {brands.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Brand</legend>
          <div className="space-y-1.5">
            {brands.map((brand) => (
              <label key={brand.slug} className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  name="brand"
                  value={brand.slug}
                  defaultChecked={query.brandSlugs?.includes(brand.slug)}
                  className="h-4 w-4 rounded border-border-strong accent-(--brand-600)"
                />
                {brand.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm">
          Apply Filters
        </Button>
        {hasFilters && (
          <Link
            href={query.q ? `${basePath}?q=${encodeURIComponent(query.q)}` : basePath}
            className="text-sm text-muted underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear all
          </Link>
        )}
      </div>
    </form>
  );
}
