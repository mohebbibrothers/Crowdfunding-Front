import { z } from "zod";

/**
 * اسکیمای زمان‌اجرا برای مرز داده.
 *
 * چرا لازم است: در قرارداد OpenAPI، اشیای تودرتو مثل `benefactor`، `category` و
 * `active_matching_grant` با `additionalProperties: {}` تعریف شده‌اند و تایپ
 * تولیدشده `Record<string, unknown>` است. بدون اعتبارسنجی، هر تغییر بک‌اند
 * می‌تواند بی‌صدا صفحه را بشکند. اینجا همان نقطه‌ها با zod تایپ واقعی می‌گیرند
 * و مقدار پیش‌فرض امن دارند تا صفحه هرگز با دادهٔ ناقص سفید نشود.
 */

const safeString = z.string().catch("");
const safeNumber = z.number().catch(0);
const nullableString = z.string().nullable().catch(null);

export const benefactorRefSchema = z
  .object({
    id: safeString,
    name: safeString,
    slug: safeString,
    logo_url: safeString,
    is_verified: z.boolean().catch(false),
  })
  .catch({ id: "", name: "", slug: "", logo_url: "", is_verified: false });

export const categoryRefSchema = z
  .object({
    id: safeString,
    title: safeString,
    slug: safeString,
    icon_name: safeString,
  })
  .nullable()
  .catch(null);

export const matchingGrantSchema = z
  .object({
    id: safeString,
    sponsor_name: safeString,
    sponsor_logo_url: safeString,
    match_ratio: safeNumber,
    total_pool_shares: safeNumber,
    consumed_shares: safeNumber,
  })
  .nullable()
  .catch(null);

export const campaignStatusSchema = z
  .enum(["draft", "active", "funded", "completed", "cancelled", "expired", "archived"])
  .catch("active");

export const campaignUrgencySchema = z
  .enum(["normal", "important", "emergency", "critical"])
  .catch("normal");

export const campaignSummarySchema = z.object({
  id: safeString,
  title: safeString,
  slug: safeString,
  short_code: safeString,
  subtitle: safeString,
  cover_image_url: safeString,
  province: safeString,
  city: safeString,
  status: campaignStatusSchema,
  urgency_level: campaignUrgencySchema,
  is_featured: z.boolean().catch(false),
  benefactor: benefactorRefSchema,
  category: categoryRefSchema,
  total_shares: safeNumber,
  paid_shares: safeNumber,
  matched_shares: safeNumber,
  external_shares: safeNumber,
  reserved_shares: safeNumber,
  funded_shares: safeNumber,
  remaining_shares: safeNumber,
  progress_percent: safeNumber,
  physical_progress_percent: safeNumber,
  supporter_count: safeNumber,
  share_price_rial: safeNumber,
  share_price_toman: safeNumber,
  target_amount_rial: safeNumber,
  target_amount_toman: safeNumber,
  total_funded_rial: safeNumber,
  total_funded_toman: safeNumber,
  disbursed_amount_rial: safeNumber,
  disbursed_amount_toman: safeNumber,
  active_matching_grant: matchingGrantSchema,
  ends_at: nullableString,
  ends_at_jalali: nullableString,
  created_at: safeString,
  created_at_jalali: nullableString,
});

export type CampaignCard = z.infer<typeof campaignSummarySchema>;

export const campaignListSchema = z.object({
  ordering: safeString,
  count: safeNumber,
  results: z.array(campaignSummarySchema).catch([]),
});

export const benefactorPublicSchema = z.object({
  id: safeString,
  name: safeString,
  slug: safeString,
  registration_number: safeString,
  province: safeString,
  city: safeString,
  short_bio: safeString,
  description: safeString,
  logo_url: safeString,
  cover_url: safeString,
  website_url: safeString,
  is_verified: z.boolean().catch(false),
  active_campaigns_count: safeNumber,
  completed_campaigns_count: safeNumber,
  total_raised_rial: safeNumber,
  total_raised_toman: safeNumber,
  total_disbursed_rial: safeNumber,
  total_disbursed_toman: safeNumber,
});

export type BenefactorCard = z.infer<typeof benefactorPublicSchema>;

export const charityJarSchema = z.object({
  id: safeString,
  benefactor_id: safeString,
  benefactor_name: safeString,
  benefactor_slug: safeString,
  benefactor_logo_url: safeString,
  title: safeString,
  slug: safeString,
  short_code: safeString,
  description: safeString,
  suggested_amounts_toman: z.array(z.number()).catch([]),
  min_amount_toman: safeNumber,
  max_amount_toman: safeNumber,
  monthly_goal_toman: safeNumber,
  total_raised_toman: safeNumber,
  donor_count: safeNumber,
  is_active: z.boolean().catch(true),
});

export type CharityJarCard = z.infer<typeof charityJarSchema>;

export const categorySchema = z.object({
  id: safeString,
  title: safeString,
  slug: safeString,
  icon_name: safeString,
  description: safeString,
  display_order: safeNumber,
});

export type CategoryItem = z.infer<typeof categorySchema>;

/** پرچم‌های ویژگی — بلوک‌های رابط بر اساس همین‌ها نمایش داده می‌شوند، نه حدس. */
export const platformMetaSchema = z.object({
  service: safeString,
  environment: safeString,
  api_version: safeString,
  app_version: safeString,
  currency_base: safeString,
  timezone: safeString,
  today_jalali: safeString,
  share_hold_ttl_minutes: safeNumber,
  features: z
    .object({
      express_one_step_checkout: z.boolean().catch(false),
      spiritual_dedications: z.boolean().catch(false),
      anonymous_and_live_feed: z.boolean().catch(false),
      impact_updates: z.boolean().catch(false),
      merkle_transparency: z.boolean().catch(false),
      external_offline_funding: z.boolean().catch(false),
      shortlinks_and_ambassadors: z.boolean().catch(false),
      charity_general_jars: z.boolean().catch(false),
      matching_grants: z.boolean().catch(false),
    })
    .catch({
      express_one_step_checkout: false,
      spiritual_dedications: false,
      anonymous_and_live_feed: false,
      impact_updates: false,
      merkle_transparency: false,
      external_offline_funding: false,
      shortlinks_and_ambassadors: false,
      charity_general_jars: false,
      matching_grants: false,
    }),
});

export type PlatformFeatures = z.infer<typeof platformMetaSchema>["features"];
