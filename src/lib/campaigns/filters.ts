import type { CampaignOrder, CampaignStatusFilter, CampaignUrgencyFilter } from "@/lib/api/public";

/**
 * لایهٔ فیلترها: تنها جایی که رشتهٔ آدرس به پارامترهای API تبدیل می‌شود.
 *
 * چرا جدا: هم آزمون‌پذیر است (بدون React)، هم یک منبع حقیقت برای هر سه مصرف‌کننده —
 * صفحهٔ سرور، نوار ابزار کلاینت و چیپ‌های «فیلتر فعال».
 * قاعده: فقط مقادیری که بک‌اند می‌شناسد از این‌جا عبور می‌کنند؛ هر چیز دیگر
 * بی‌صدا نادیده گرفته می‌شود تا آدرس دستکاری‌شده صفحه را نشکند.
 */

export const STATUS_VALUES = ["active", "completed", "executing", "fulfilled"] as const;
export const ORDER_VALUES = ["fair", "newest", "ending_soon", "most_funded", "urgent"] as const;
export const URGENCY_VALUES = ["normal", "urgent", "emergency"] as const;

export const STATUS_LABELS: Record<CampaignStatusFilter, string> = {
  active: "در حال جذب",
  executing: "در حال اجرا",
  completed: "تکمیل ظرفیت",
  fulfilled: "اجراشده",
};

export const ORDER_LABELS: Record<CampaignOrder, string> = {
  fair: "پیشنهاد هم‌سهم",
  newest: "تازه‌ترین",
  ending_soon: "نزدیک‌ترین به پایان",
  most_funded: "بیشترین تأمین",
  urgent: "فوری‌ترین",
};

export const URGENCY_LABELS: Record<CampaignUrgencyFilter, string> = {
  normal: "عادی",
  urgent: "فوری",
  emergency: "اضطراری",
};

/** سی‌ویک استان — مقدار دقیقاً همان چیزی است که در فیلد `province` ذخیره می‌شود. */
export const PROVINCES = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
] as const;

export const DEFAULT_STATUS: CampaignStatusFilter = "active";
export const DEFAULT_ORDER: CampaignOrder = "fair";

export interface CampaignFilters {
  q: string;
  category: string;
  province: string;
  urgency: CampaignUrgencyFilter | "";
  status: CampaignStatusFilter;
  order: CampaignOrder;
  matching: boolean;
}

export type RawSearchParams = Record<string, string | string[] | undefined>;

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function oneOf<T extends string>(values: readonly T[], raw: string, fallback: T): T {
  return values.includes(raw as T) ? (raw as T) : fallback;
}

/** پاک‌سازی عبارت جست‌وجو: فاصله‌های اضافی، طول و کاراکترهای کنترلی. */
export function normalizeQuery(raw: string): string {
  return raw
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function parseFilters(params: RawSearchParams): CampaignFilters {
  const category = first(params.category).trim();
  const province = first(params.province).trim();
  return {
    q: normalizeQuery(first(params.q)),
    category: SLUG_RE.test(category) ? category : "",
    province: (PROVINCES as readonly string[]).includes(province) ? province : "",
    urgency: oneOf(URGENCY_VALUES, first(params.urgency), "" as CampaignUrgencyFilter | ""),
    status: oneOf(STATUS_VALUES, first(params.status), DEFAULT_STATUS),
    order: oneOf(ORDER_VALUES, first(params.order), DEFAULT_ORDER),
    matching: first(params.matching) === "1" || first(params.matching) === "true",
  };
}

/** فیلترهای غیرپیش‌فرض — برای ساخت چیپ‌ها و تصمیم noindex. */
export function activeFilterKeys(filters: CampaignFilters): Array<keyof CampaignFilters> {
  const keys: Array<keyof CampaignFilters> = [];
  if (filters.q) keys.push("q");
  if (filters.category) keys.push("category");
  if (filters.province) keys.push("province");
  if (filters.urgency) keys.push("urgency");
  if (filters.status !== DEFAULT_STATUS) keys.push("status");
  if (filters.order !== DEFAULT_ORDER) keys.push("order");
  if (filters.matching) keys.push("matching");
  return keys;
}

export function hasActiveFilters(filters: CampaignFilters): boolean {
  return activeFilterKeys(filters).length > 0;
}

/**
 * ساخت رشتهٔ جست‌وجو با حذف مقادیر پیش‌فرض.
 * آدرس نتیجه کوتاه و قابل اشتراک است و با `order=fair` شلوغ نمی‌شود.
 */
export function toQueryString(filters: Partial<CampaignFilters>): string {
  const params = new URLSearchParams();
  const entries: Array<[string, string | undefined]> = [
    ["q", filters.q?.trim() || undefined],
    ["category", filters.category || undefined],
    ["province", filters.province || undefined],
    ["urgency", filters.urgency || undefined],
    ["status", filters.status && filters.status !== DEFAULT_STATUS ? filters.status : undefined],
    ["order", filters.order && filters.order !== DEFAULT_ORDER ? filters.order : undefined],
    ["matching", filters.matching ? "1" : undefined],
  ];
  for (const [key, value] of entries) if (value) params.set(key, value);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** تغییر یک فیلتر و برگرداندن آدرس تازه (برای دکمه‌های حذف چیپ). */
export function withFilter(filters: CampaignFilters, patch: Partial<CampaignFilters>): string {
  return `/campaigns${toQueryString({ ...filters, ...patch })}`;
}
