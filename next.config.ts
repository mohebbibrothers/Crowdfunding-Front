import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
  async headers() {
    return [
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
