/**
 * یک نقطهٔ حقیقت برای آدرس‌ها.
 * روی سرور از API_BASE_URL و در مرورگر از NEXT_PUBLIC_API_BASE_URL استفاده می‌شود،
 * اما چون هر دو same-site هستند یک مقدار واحد در .env قرار می‌گیرد.
 */

const DEFAULT_SITE_URL = "https://alavi-fars.ir";
const DEFAULT_API_URL = "https://api.alavi-fars.ir";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export const env = {
  siteUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL),
  apiUrl: trimTrailingSlash(
    (typeof window === "undefined" ? process.env.API_BASE_URL : undefined) ??
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      DEFAULT_API_URL,
  ),
  isProduction: process.env.NODE_ENV === "production",
} as const;
