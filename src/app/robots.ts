import type { MetadataRoute } from "next";

import { env } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // مسیرهای خصوصی و پنل مدیریت هرگز نباید ایندکس شوند
        disallow: ["/me", "/auth", "/checkout", "/receipt", "/ops-"],
      },
    ],
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}
