import { cn } from "@/lib/utils/cn";
import { clampPercent } from "@/lib/format/numbers";

export interface ProgressProps {
  value: number;
  className?: string;
  /** برچسب دسترس‌پذیری برای صفحه‌خوان */
  label?: string;
  tone?: "brand" | "gold";
}

export function Progress({ value, className, label, tone = "brand" }: ProgressProps) {
  const pct = clampPercent(value);
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "درصد تأمین"}
      className={cn("h-2 w-full overflow-hidden rounded-pill bg-surface-3", className)}
    >
      <div
        className={cn(
          "h-full origin-right rounded-pill transition-[width] duration-700 ease-out-soft motion-safe:animate-progress-in",
          tone === "brand"
            ? "bg-gradient-to-l from-accent to-accent-soft"
            : "bg-gradient-to-l from-gold to-gold-soft",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
