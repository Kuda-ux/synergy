import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Vector recreation of the Synergy Dynamics mark (magenta rounded tile with
 * circuit nodes + bold technical wordmark) so it renders crisply in both
 * themes. The original raster logo is kept at /public/brand/logo.jpeg;
 * replace this with the official vector asset when supplied.
 */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Synergy Dynamics logo"
      className={className}
    >
      <rect width="48" height="48" rx="10" fill="var(--brand-500)" />
      <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M24 40V16" />
        <path d="M14 36v-8l5-5" />
        <path d="M34 34v-6l-5-5" />
      </g>
      <g fill="var(--brand-500)" stroke="#fff" strokeWidth="2.4">
        <circle cx="24" cy="12" r="4" />
        <circle cx="14" cy="20" r="3.2" />
        <circle cx="34" cy="20" r="3.2" />
      </g>
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="Synergy Dynamics — home">
      <LogoMark size={36} className="shrink-0" />
      <span
        className={cn(
          "font-heading leading-none tracking-tight",
          inverted ? "text-white" : "text-foreground",
        )}
      >
        <span className="block text-[15px] font-extrabold uppercase tracking-[0.08em]">Synergy</span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.42em]">Dynamics</span>
      </span>
    </Link>
  );
}
