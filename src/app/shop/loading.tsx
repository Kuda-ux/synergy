import { ProductGridSkeleton, Skeleton } from "@/components/ui/states";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mb-6 h-4 w-40" />
      <Skeleton className="mb-8 h-9 w-72" />
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <Skeleton className="hidden h-80 lg:block" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
