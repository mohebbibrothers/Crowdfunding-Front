/**
 * پول: همیشه از فیلد آمادهٔ `*_toman` سرور نمایش می‌دهیم.
 * هرگز در کلاینت تقسیم بر ۱۰ نمی‌کنیم (خطای گرد کردن و اختلاف ریال/تومان).
 */

const tomanFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

const compactFormatter = new Intl.NumberFormat("fa-IR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** «۵۰٬۰۰۰ تومان» */
export function formatToman(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return `${tomanFormatter.format(value)} تومان`;
}

/** «۵۰٬۰۰۰» بدون یکای پول — وقتی یکا در کنارش جدا نوشته می‌شود. */
export function formatAmount(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return tomanFormatter.format(value);
}

/** «۱۲٫۵ میلیون» — برای آمار و اعداد بزرگ */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return compactFormatter.format(value);
}

/** تومان → «۱۲٫۵ میلیون تومان» با گرد کردن خوانا */
export function formatTomanCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  if (value >= 1_000_000_000) {
    return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(value / 1_000_000_000)} میلیارد تومان`;
  }
  if (value >= 1_000_000) {
    return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(value / 1_000_000)} میلیون تومان`;
  }
  return `${tomanFormatter.format(value)} تومان`;
}
