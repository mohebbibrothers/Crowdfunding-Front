import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
