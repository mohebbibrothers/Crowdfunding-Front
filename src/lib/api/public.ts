import { apiRequestSafe } from "./client";
import {
  benefactorPublicSchema,
  campaignListSchema,
  categorySchema,
  charityJarSchema,
  platformMetaSchema,
  type BenefactorCard,
  type CampaignCard,
  type CategoryItem,
  type CharityJarCard,
  type PlatformFeatures,
} from "./schemas";

/** پنجرهٔ تازه‌سازی کش صفحه‌های عمومی (ثانیه). */
const PUBLIC_REVALIDATE = 60;

export interface CampaignQuery {
  status?: "active" | "funded" | "completed";
  order?: "fair" | "newest" | "ending" | "progress" | "urgency";
  category?: string;
  province?: string;
  urgency?: "normal" | "important" | "emergency" | "critical";
  has_matching?: boolean;
  q?: string;
  page_size?: number;
}

export interface PublicResult<T> {
  items: T[];
  count: number;
  ok: boolean;
}

export async function listCampaigns(
  query: CampaignQuery = {},
): Promise<PublicResult<CampaignCard>> {
  const raw = await apiRequestSafe("v1_campaigns_list", {
    query: {
      status: query.status ?? "active",
      order: query.order ?? "fair",
      category: query.category,
      province: query.province,
      urgency: query.urgency,
      has_matching: query.has_matching,
      q: query.q,
      page_size: query.page_size ?? 12,
    },
    next: { revalidate: PUBLIC_REVALIDATE, tags: ["campaigns"] },
  });

  const parsed = campaignListSchema.safeParse(raw);
  if (!parsed.success) return { items: [], count: 0, ok: false };
  return {
    items: parsed.data.results,
    count: parsed.data.count,
    ok: true,
  };
}

export async function listBenefactors(): Promise<PublicResult<BenefactorCard>> {
  const raw = await apiRequestSafe("v1_benefactors_list", {
    next: { revalidate: PUBLIC_REVALIDATE * 5, tags: ["benefactors"] },
  });
  if (!Array.isArray(raw)) return { items: [], count: 0, ok: false };
  const items = raw
    .map((item) => benefactorPublicSchema.safeParse(item))
    .filter((r): r is { success: true; data: BenefactorCard } => r.success)
    .map((r) => r.data);
  return { items, count: items.length, ok: true };
}

export async function listJars(): Promise<PublicResult<CharityJarCard>> {
  const raw = await apiRequestSafe("v1_jars_list", {
    next: { revalidate: PUBLIC_REVALIDATE, tags: ["jars"] },
  });
  if (!Array.isArray(raw)) return { items: [], count: 0, ok: false };
  const items = raw
    .map((item) => charityJarSchema.safeParse(item))
    .filter((r): r is { success: true; data: CharityJarCard } => r.success)
    .map((r) => r.data);
  return { items, count: items.length, ok: true };
}

export async function listCategories(): Promise<CategoryItem[]> {
  const raw = await apiRequestSafe("v1_campaign_categories_list", {
    next: { revalidate: PUBLIC_REVALIDATE * 10, tags: ["categories"] },
  });
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => categorySchema.safeParse(item))
    .filter((r): r is { success: true; data: CategoryItem } => r.success)
    .map((r) => r.data);
}

const OFFLINE_FEATURES: PlatformFeatures = {
  express_one_step_checkout: false,
  spiritual_dedications: false,
  anonymous_and_live_feed: false,
  impact_updates: false,
  merkle_transparency: false,
  external_offline_funding: false,
  shortlinks_and_ambassadors: false,
  charity_general_jars: false,
  matching_grants: false,
};

export interface PlatformSnapshot {
  features: PlatformFeatures;
  shareHoldTtlMinutes: number;
  todayJalali: string;
  appVersion: string;
  online: boolean;
}

export async function getPlatform(): Promise<PlatformSnapshot> {
  const raw = await apiRequestSafe("v1_meta_retrieve", {
    next: { revalidate: 300, tags: ["meta"] },
  });
  const parsed = platformMetaSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      features: OFFLINE_FEATURES,
      shareHoldTtlMinutes: 15,
      todayJalali: "",
      appVersion: "",
      online: false,
    };
  }
  return {
    features: parsed.data.features,
    shareHoldTtlMinutes: parsed.data.share_hold_ttl_minutes || 15,
    todayJalali: parsed.data.today_jalali,
    appVersion: parsed.data.app_version,
    online: true,
  };
}
