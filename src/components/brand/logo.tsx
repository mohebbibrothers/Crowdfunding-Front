import { cn } from "@/lib/utils/cn";

/**
 * نشان «هم‌سهم» — سه سهم هم‌گرا که یک دایرهٔ کامل می‌سازند.
 * SVG درون‌خطی: بدون درخواست شبکه، مقیاس‌پذیر و قابل رنگ‌گیری با currentColor.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="نشان هم‌سهم"
      className={cn("size-9", className)}
      fill="none"
    >
      <circle cx="20" cy="20" r="18.25" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M20 7.5 L20 20 L11 25.2 Z" fill="currentColor" opacity="0.95" />
      <path d="M20 20 L32.2 20 L26.1 30.6 Z" fill="currentColor" opacity="0.62" />
      <path d="M20 20 L7.8 20 L13.9 30.6 Z" fill="currentColor" opacity="0.34" />
      <circle cx="20" cy="20" r="2.1" fill="var(--gold)" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-accent", className)}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[1.06rem] font-extrabold tracking-tight">هم‌سهم</span>
          <span className="mt-0.5 text-[0.62rem] font-medium text-muted">هر سهم، یک قدم</span>
        </span>
      )}
    </span>
  );
}
