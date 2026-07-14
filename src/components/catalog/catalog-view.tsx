import { PackageSearch } from "lucide-react";
import { getBrands, searchProducts, type CatalogQuery } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/states";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { SortSelect } from "@/components/filters/sort-select";
import { Pagination } from "@/components/filters/pagination";
import type { SearchParams } from "@/components/filters/catalog-params";

/** Shared catalogue listing used by /shop, category pages, /search and /new-arrivals. */
export async function CatalogView({
  basePath,
  params,
  query,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or search term, or browse the full catalogue.",
}: {
  basePath: string;
  params: SearchParams;
  query: CatalogQuery;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [result, brands] = await Promise.all([searchProducts(query), getBrands()]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-40 lg:self-start">
        <details className="group rounded-card border border-border bg-surface p-4 lg:border-0 lg:bg-transparent lg:p-0" open>
          <summary className="cursor-pointer text-sm font-semibold lg:pointer-events-none lg:list-none">
            Filters
          </summary>
          <div className="mt-4">
            <FilterSidebar basePath={basePath} query={query} brands={brands} />
          </div>
        </details>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {result.total} product{result.total === 1 ? "" : "s"}
            {query.q ? (
              <>
                {" "}for <span className="font-medium text-foreground">“{query.q}”</span>
              </>
            ) : null}
          </p>
          <SortSelect current={query.sort ?? "relevance"} />
        </div>

        {result.products.length === 0 ? (
          <EmptyState
            icon={<PackageSearch size={40} aria-hidden />}
            title={emptyTitle}
            description={emptyDescription}
            actionHref="/shop"
            actionLabel="Browse all products"
          />
        ) : (
          <>
            <ProductGrid products={result.products} />
            <Pagination basePath={basePath} params={params} page={result.page} totalPages={result.totalPages} />
          </>
        )}
      </div>
    </div>
  );
}
