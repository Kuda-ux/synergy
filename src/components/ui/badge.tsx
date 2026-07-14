import { cn } from "@/lib/utils";

type Tone = "brand" | "neutral" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  brand: "bg-accent-surface text-primary border-accent-border",
  neutral: "bg-surface text-muted border-border",
  success: "bg-success-surface text-success border-transparent",
  warning: "bg-warning-surface text-warning border-transparent",
  danger: "bg-danger-surface text-danger border-transparent",
  info: "bg-info-surface text-info border-transparent",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
