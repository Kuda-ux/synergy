import { Badge } from "@/components/ui/badge";

export type StockState = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export function stockState(product: {
  stockQty: number;
  lowStockThreshold: number;
  status: string;
}): StockState {
  if (product.status === "preorder") return "preorder";
  if (product.stockQty <= 0) return "out_of_stock";
  if (product.stockQty <= product.lowStockThreshold) return "low_stock";
  return "in_stock";
}

const config: Record<StockState, { label: string; tone: "success" | "warning" | "danger" | "info" }> = {
  in_stock: { label: "In Stock", tone: "success" },
  low_stock: { label: "Low Stock", tone: "warning" },
  out_of_stock: { label: "Out of Stock", tone: "danger" },
  preorder: { label: "Pre-Order", tone: "info" },
};

export function StockBadge({ state }: { state: StockState }) {
  const { label, tone } = config[state];
  return <Badge tone={tone}>{label}</Badge>;
}
