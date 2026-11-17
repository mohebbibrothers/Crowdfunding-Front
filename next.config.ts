import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * خروجی خودبسنده برای هاست.
   * چرا: سهمیهٔ دیسک هاست ۱ گیگابایت است و نصب node_modules کامل (۶۰۰ مگابایت)
   * به‌همراه کش swc (۲۰۰ مگابایت) در آن جا نمی‌شود. پس بیلد در CI انجام می‌شود و
   * هاست فقط خروجی آماده را اجرا می‌کند.
   */
  output: "standalone",
  /**
   * نام‌های مستعار را در خودِ وب‌پک هم می‌بندیم.
   * چرا: Next مسیرهای tsconfig را از طریق بستهٔ typescript می‌خواند؛ اگر در محیط
   * بیلد، typescript نصب نشده باشد (مثلاً نصب وابستگی‌های dev رد شود) همهٔ
   * importهای «@/» بی‌صدا می‌شکنند. این alias آن وابستگی را قطع می‌کند.
   */
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": path.resolve(process.cwd(), "src"),
    };
    return config;
  },
  // فقط برای پیش‌نمایش محلی سندباکس؛ در تولید اثری ندارد.
  allowedDevOrigins: ["127.0.0.1", "localhost", "0.0.0.0"],
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.alavi-fars.ir" },
      { protocol: "https", hostname: "alavi-fars.ir" },
      { protocol: "https", hostname: "www.alavi-fars.ir" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  /**
   * چالش ACME را به یک Route Handler معمولی نگاشت می‌کنیم؛ پوشه‌های نقطه‌دار
   * (`.well-known`) در App Router قابل اتکا نیستند.
   */
  async rewrites() {
    return [
      {
        source: "/.well-known/acme-challenge/:token",
        destination: "/api/acme/:token",
      },
    ];
  },
  async headers() {
    return [
      {
        /**
         * HTML هرگز یک سال «کهنه» نماند.
         * چرا: Next برای صفحهٔ پیش‌ساخته `stale-while-revalidate` بسیار بلند
         * می‌فرستد؛ هر کش میانی (Apache/CDN) می‌تواند نسخهٔ بیلد قبلی را نگه دارد
         * و آن نسخه به دارایی‌های حذف‌شده اشاره کند → صفحهٔ بی‌استایل.
         * این‌جا پنجرهٔ کهنگی به ۶۰ ثانیه محدود می‌شود. دارایی‌های
         * `/_next/static/*` عمداً دست‌نخورده‌اند (immutable یک‌ساله).
         */
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=60",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
