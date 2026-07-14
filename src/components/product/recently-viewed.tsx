"use client";

import { useEffect } from "react";
import Link from "next/link";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductImage } from "./product-image";
import { useMounted } from "@/hooks/use-mounted";

interface ViewedItem {
  productId: string;
  path: string;
  name: string;
  imageUrl: string | null;
}

interface RecentlyViewedState {
  items: ViewedItem[];
  record: (item: ViewedItem) => void;
}

const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      record: (item) =>
        set((s) => ({
          items: [item, ...s.items.filter((i) => i.productId !== item.productId)].slice(0, 8),
        })),
    }),
    { name: "sd-recently-viewed-v1" },
  ),
);

/** Records the current product and shows the shopper's other recent views. */
export function RecentlyViewed({ current }: { current: ViewedItem }) {
  const mounted = useMounted();
  const record = useRecentlyViewed((s) => s.record);
  const items = useRecentlyViewed((s) => s.items);

  useEffect(() => {
    record(current);
    // record only when the product changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.productId]);

  const others = items.filter((i) => i.productId !== current.productId);
  if (!mounted || others.length === 0) return null;

  return (
    <section aria-label="Recently viewed" className="mt-12">
      <h2 className="text-lg font-semibold">Recently viewed</h2>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {others.map((item) => (
          <Link
            key={item.productId}
            href={item.path}
            className="w-36 shrink-0 rounded-card border border-border bg-surface p-3 transition-colors hover:border-accent-border"
          >
            <ProductImage url={item.imageUrl} alt="" className="aspect-square w-full rounded-lg" iconSize={28} />
            <p className="mt-2 line-clamp-2 text-xs font-medium">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
