import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/cart/wishlist-page";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
