"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/ui/form";
import { useCart } from "@/store/cart";
import { createQuotationRequest } from "@/lib/actions/quotations";
import { ORGANISATION_TYPES } from "@/lib/constants";

interface QuoteRow {
  key: number;
  productId?: string;
  description: string;
  quantity: number;
}

let rowKey = 0;
const newRow = (partial?: Partial<QuoteRow>): QuoteRow => ({
  key: ++rowKey,
  description: "",
  quantity: 1,
  ...partial,
});

export function QuoteForm() {
  const router = useRouter();
  const cartLines = useCart((s) => s.lines);
  const [rows, setRows] = useState<QuoteRow[]>([newRow()]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function importCart() {
    const existing = new Set(rows.map((r) => r.productId).filter(Boolean));
    const imported = cartLines
      .filter((l) => !existing.has(l.productId))
      .map((l) =>
        newRow({ productId: l.productId, description: `${l.name} (${l.sku})`, quantity: l.quantity }),
      );
    setRows((r) => [...r.filter((row) => row.description.trim() !== "" || row.productId), ...imported]);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await createQuotationRequest({
        organisationName: String(form.get("organisationName") ?? ""),
        organisationType: String(form.get("organisationType") ?? "school"),
        contactName: String(form.get("contactName") ?? ""),
        contactEmail: String(form.get("contactEmail") ?? ""),
        contactPhone: String(form.get("contactPhone") ?? ""),
        poReference: String(form.get("poReference") ?? "") || undefined,
        requirements: String(form.get("requirements") ?? "") || undefined,
        items: rows
          .filter((r) => r.description.trim())
          .map((r) => ({ productId: r.productId, description: r.description.trim(), quantity: r.quantity })),
      });
      if (result.ok && result.data) {
        router.push(`/quote/confirmation/${result.data.reference}`);
      } else {
        setError(result.error ?? "Something went wrong submitting your request.");
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {error && (
        <p role="alert" className="rounded-card border border-danger/40 bg-danger-surface px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <fieldset>
        <legend className="mb-3 text-lg font-semibold">Items to quote</legend>
        {fieldErrors.items && <p className="mb-2 text-xs text-danger">{fieldErrors.items}</p>}
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={row.key} className="flex gap-2">
              <div className="flex-1">
                <label htmlFor={`item-desc-${row.key}`} className="sr-only">Item {i + 1} description</label>
                <input
                  id={`item-desc-${row.key}`}
                  value={row.description}
                  onChange={(e) =>
                    setRows((rs) => rs.map((r) => (r.key === row.key ? { ...r, description: e.target.value } : r)))
                  }
                  placeholder="Product name, SKU or requirement"
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm placeholder:text-subtle"
                />
              </div>
              <div className="w-24">
                <label htmlFor={`item-qty-${row.key}`} className="sr-only">Item {i + 1} quantity</label>
                <input
                  id={`item-qty-${row.key}`}
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) =>
                    setRows((rs) =>
                      rs.map((r) =>
                        r.key === row.key ? { ...r, quantity: Math.max(1, Number.parseInt(e.target.value, 10) || 1) } : r,
                      ),
                    )
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-center font-mono text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== row.key) : rs))}
                aria-label={`Remove item ${i + 1}`}
                className="text-subtle transition-colors hover:text-danger disabled:opacity-40"
                disabled={rows.length <= 1}
              >
                <Trash2 size={16} aria-hidden />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => setRows((rs) => [...rs, newRow()])}>
            <Plus size={14} aria-hidden /> Add item
          </Button>
          {cartLines.length > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={importCart}>
              Import {cartLines.length} item{cartLines.length === 1 ? "" : "s"} from my cart
            </Button>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-semibold">Organisation details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Organisation name" name="organisationName" required error={fieldErrors.organisationName} />
          <SelectField label="Organisation type" name="organisationType" required error={fieldErrors.organisationType}>
            {ORGANISATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </SelectField>
          <InputField label="Contact person" name="contactName" required error={fieldErrors.contactName} />
          <InputField label="Contact email" name="contactEmail" type="email" required error={fieldErrors.contactEmail} />
          <InputField label="Contact phone / WhatsApp" name="contactPhone" type="tel" required error={fieldErrors.contactPhone} />
          <InputField label="Purchase-order reference" name="poReference" error={fieldErrors.poReference} hint="Optional" />
        </div>
        <TextareaField
          label="Custom requirements"
          name="requirements"
          error={fieldErrors.requirements}
          hint="Tell us about quantities, timelines, training needs or custom engineering. You can also email supporting documents to info@synergydynamics.co.zw quoting your reference number."
        />
      </fieldset>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Submitting…" : "Submit Quotation Request"}
      </Button>
    </form>
  );
}
