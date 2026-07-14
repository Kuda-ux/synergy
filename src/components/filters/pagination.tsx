import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildQueryString, type SearchParams } from "./catalog-params";

export function Pagination({
  basePath,
  params,
  page,
  totalPages,
}: {
  basePath: string;
  params: SearchParams;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (p: number) => `${basePath}${buildQueryString(params, { page: p === 1 ? null : String(p) })}`;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 font-mono text-sm",
      active
        ? "border-transparent bg-primary text-primary-foreground"
        : "border-border text-muted hover:border-accent-border hover:text-foreground",
    );

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={pageHref(page - 1)} className={linkClass(false)} aria-label="Previous page">
          <ChevronLeft size={16} aria-hidden />
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-subtle">…</span>}
          <Link href={pageHref(p)} className={linkClass(p === page)} aria-current={p === page ? "page" : undefined}>
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages && (
        <Link href={pageHref(page + 1)} className={linkClass(false)} aria-label="Next page">
          <ChevronRight size={16} aria-hidden />
        </Link>
      )}
    </nav>
  );
}
