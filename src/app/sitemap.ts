import type { MetadataRoute } from "next";

import { listCampaigns } from "@/lib/api/public";
import { env } from "@/lib/config/env";

/**
 * نقشهٔ سایت با دادهٔ واقعی حرکت‌ها.
 * اگر API در دسترس نباشد، حداقل مسیرهای ثابت بازگردانده می‌شوند (هرگز ۵۰۰ نمی‌دهیم).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${env.siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${env.siteUrl}/campaigns`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${env.siteUrl}/charities`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${env.siteUrl}/jars`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${env.siteUrl}/transparency`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${env.siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const campaigns = await listCampaigns({ status: "active", page_size: 100 });
  const campaignRoutes: MetadataRoute.Sitemap = campaigns.items.map((campaign) => ({
    url: `${env.siteUrl}/campaigns/${campaign.slug}`,
    lastModified: campaign.created_at || undefined,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...campaignRoutes];
}
