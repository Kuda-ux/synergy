import { NextResponse, type NextRequest } from "next/server";
import { suggestProducts, productPath } from "@/lib/catalog";
import { formatCents } from "@/lib/money";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2 || q.length > 100) {
    return NextResponse.json({ results: [] });
  }
  const products = await suggestProducts(q);
  return NextResponse.json({
    results: products.map((p) => ({
      name: p.name,
      sku: p.sku,
      path: productPath(p),
      priceLabel: formatCents(p.priceUsdCents, "USD"),
      category: p.category.name,
    })),
  });
}
