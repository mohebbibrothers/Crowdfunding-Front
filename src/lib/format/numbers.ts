const integerFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });

/** «۱٬۲۴۰» */
export function formatInt(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return integerFormatter.format(Math.round(value));
}

/** «۶۷٪» — با گِرد به نزدیک‌ترین عدد صحیح و محدودسازی به بازهٔ ۰..۱۰۰ */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "۰٪";
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return `${percentFormatter.format(clamped)}٪`;
}

export function clampPercent(value: number | null | undefined): number {
  if (value === null || value === undefined || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}
