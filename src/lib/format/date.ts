/**
 * تاریخ‌ها از فیلد آمادهٔ `*_jalali` سرور خوانده می‌شوند (قالب YYYY-MM-DD).
 * هیچ تبدیل تقویمی در کلاینت انجام نمی‌شود تا اختلاف منطقهٔ زمانی پیش نیاید.
 */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

export function toPersianDigits(value: string): string {
  return value.replace(/\d/g, (digit) => FA_DIGITS[Number(digit)] ?? digit);
}

/** «۱۴۰۵/۰۸/۲۴» */
export function formatJalali(value: string | null | undefined): string {
  if (!value) return "—";
  return toPersianDigits(value.replaceAll("-", "/"));
}

/** فاصلهٔ روزهای باقی‌مانده از یک تاریخ ISO، با مبنای «اکنون». */
export function daysRemaining(
  iso: string | null | undefined,
  now: Date = new Date(),
): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / 86_400_000);
}

/** متن خوانای زمان باقی‌مانده برای کارت حرکت. */
export function formatRemaining(iso: string | null | undefined, now: Date = new Date()): string {
  const days = daysRemaining(iso, now);
  if (days === null) return "بدون مهلت";
  if (days <= 0) return "مهلت تمام شده";
  if (days === 1) return "آخرین روز";
  if (days <= 7) return `${toPersianDigits(String(days))} روز مانده`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${toPersianDigits(String(weeks))} هفته مانده`;
  return `${toPersianDigits(String(Math.floor(days / 30)))} ماه مانده`;
}
