import Image from "next/image";
import {
  Bot,
  CircuitBoard,
  Cog,
  Cpu,
  GraduationCap,
  Radar,
  Wifi,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  cpu: Cpu,
  bot: Bot,
  radar: Radar,
  cog: Cog,
  wifi: Wifi,
  "circuit-board": CircuitBoard,
  wrench: Wrench,
  "graduation-cap": GraduationCap,
};

/**
 * Renders a product image, or a clearly-labelled branded placeholder for demo
 * products whose image url uses the `placeholder:<iconKey>` convention. Real
 * product photography replaces placeholders without any code changes.
 */
export function ProductImage({
  url,
  alt,
  className,
  iconSize = 56,
  sizes,
  priority,
}: {
  url: string | null;
  alt: string;
  className?: string;
  iconSize?: number;
  sizes?: string;
  priority?: boolean;
}) {
  if (url && !url.startsWith("placeholder:")) {
    return (
      <div className={cn("relative overflow-hidden bg-surface", className)}>
        <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  const key = (url ?? "placeholder:cpu").slice("placeholder:".length).replace(/-alt$/, "");
  const Icon = iconMap[key] ?? Cpu;
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "circuit-grid relative flex items-center justify-center overflow-hidden",
        "bg-accent-surface text-primary dark:bg-ink-surface",
        className,
      )}
    >
      <Icon size={iconSize} strokeWidth={1.25} aria-hidden />
      <span className="absolute bottom-2 right-2 rounded bg-surface/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
        Demo image
      </span>
    </div>
  );
}
