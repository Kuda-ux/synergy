"use client";

import { useId, useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface Spec {
  group: string;
  label: string;
  value: string;
}

interface DownloadLink {
  label: string;
  url: string;
}

export interface ProductTabsData {
  description: string;
  specs: Spec[];
  contents: string[];
  compatibility: string[];
  downloads: DownloadLink[];
  warranty: string | null;
}

export function ProductTabs({ data }: { data: ProductTabsData }) {
  const baseId = useId();
  const tabs = [
    { key: "description", label: "Description", show: true },
    { key: "specs", label: "Specifications", show: data.specs.length > 0 },
    { key: "contents", label: "Package Contents", show: data.contents.length > 0 },
    { key: "compatibility", label: "Compatibility", show: data.compatibility.length > 0 },
    { key: "downloads", label: "Downloads", show: data.downloads.length > 0 },
    { key: "warranty", label: "Warranty", show: !!data.warranty },
    // Reviews architecture exists but stays hidden until genuine customer
    // reviews are collected — no fake or sample reviews are ever displayed.
  ].filter((t) => t.show);

  const [active, setActive] = useState(tabs[0]?.key ?? "description");

  return (
    <div>
      <div role="tablist" aria-label="Product information" className="flex flex-wrap gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            id={`${baseId}-tab-${tab.key}`}
            aria-selected={active === tab.key}
            aria-controls={`${baseId}-panel-${tab.key}`}
            onClick={() => setActive(tab.key)}
            className={cn(
              "-mb-px rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              active === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="py-6"
      >
        {active === "description" && (
          <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
            {data.description.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
        {active === "specs" && (
          <table className="w-full max-w-3xl border-collapse text-sm">
            <caption className="sr-only">Technical specifications</caption>
            <tbody>
              {data.specs.map((spec, i) => (
                <tr key={i} className="border-b border-border">
                  <th scope="row" className="w-1/3 py-2.5 pr-4 text-left font-medium">
                    {spec.label}
                  </th>
                  <td className="py-2.5 font-mono text-muted">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {active === "contents" && (
          <ul className="max-w-3xl list-disc space-y-1.5 pl-5 text-sm text-muted">
            {data.contents.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        {active === "compatibility" && (
          <ul className="flex max-w-3xl flex-wrap gap-2">
            {data.compatibility.map((item, i) => (
              <li key={i} className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                {item}
              </li>
            ))}
          </ul>
        )}
        {active === "downloads" && (
          <ul className="max-w-3xl space-y-2 text-sm">
            {data.downloads.map((dl, i) => (
              <li key={i}>
                <a
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Download size={14} aria-hidden /> {dl.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        {active === "warranty" && (
          <p className="max-w-3xl text-sm leading-relaxed text-muted">{data.warranty}</p>
        )}
      </div>
    </div>
  );
}
