"use client";

import { useState, useTransition } from "react";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/product/price";
import { trackOrder, type TrackedOrder } from "@/lib/actions/orders";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";

export function TrackOrderForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await trackOrder({
        orderNumber: String(form.get("orderNumber") ?? ""),
        email: String(form.get("email") ?? ""),
      });
      if (result.ok && result.data) {
        setOrder(result.data);
      } else {
        setOrder(null);
        setError(result.error ?? "Unable to look up that order right now.");
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <InputField
          label="Order number"
          name="orderNumber"
          required
          placeholder="SD-260713-1234"
          error={fieldErrors.orderNumber}
          className="font-mono uppercase"
        />
        <InputField label="Email used on the order" name="email" type="email" required error={fieldErrors.email} />
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Searching…" : "Track Order"}
        </Button>
      </form>

      {error && (
        <p role="alert" className="mt-6 rounded-card border border-danger/40 bg-danger-surface px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8 rounded-card border border-border bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-muted">{order.orderNumber}</p>
              <p className="text-xs text-subtle">
                Placed {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <Badge tone={order.status === "delivered" ? "success" : order.status === "cancelled" || order.status === "refunded" ? "danger" : "info"}>
              {order.statusLabel}
            </Badge>
          </div>

          <ul className="mt-4 divide-y divide-border text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between py-2">
                <span>{item.name}</span>
                <span className="font-mono text-muted">× {item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
            <span>Total (USD)</span>
            <Price usdCents={order.totalCents} />
          </p>

          <h2 className="mt-6 text-sm font-semibold">Status history</h2>
          <ol className="mt-2 space-y-2 border-l-2 border-border pl-4 text-sm">
            {order.history.map((event, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden />
                <p className="font-medium">
                  {ORDER_STATUS_LABELS[event.toStatus as OrderStatus] ?? event.toStatus}
                </p>
                <p className="text-xs text-subtle">
                  {new Date(event.createdAt).toLocaleString("en-GB")}
                  {event.note ? ` — ${event.note}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!order && !error && (
        <div className="mt-10 flex flex-col items-center text-center text-sm text-muted">
          <PackageSearch size={32} aria-hidden className="mb-2 text-subtle" />
          Enter your order number and email to see live status and history.
        </div>
      )}
    </div>
  );
}
