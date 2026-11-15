/**
 * سرور نمونهٔ قرارداد API — فقط برای بازبینی بصری و توسعهٔ آفلاین.
 *
 * چرا هست: پیش از اتصال به سرور واقعی، باید بتوانیم هر صفحه را با دادهٔ
 * واقع‌نما رندر و بررسی کنیم. این فایل در بستهٔ تولید استفاده نمی‌شود.
 *
 *   node tools/mock-api.mjs 4010
 *   API_BASE_URL=http://127.0.0.1:4010/api/v1 npm run dev
 */
import { createServer } from "node:http";

const PORT = Number(process.argv[2] ?? 4010);

const benefactor = (over = {}) => ({
  id: "0192f000-0000-7000-8000-000000000001",
  name: "مؤسسه خیریه مهرآفرین سلامت کودکان",
  slug: "mehrafin-health",
  logo_url: "",
  is_verified: true,
  ...over,
});

const category = (title = "درمان و سلامت کودکان", icon = "heart-pulse") => ({
  id: "0192f000-0000-7000-8000-0000000000c1",
  title,
  slug: "health-care",
  icon_name: icon,
});

const campaign = (over = {}) => {
  const total_shares = over.total_shares ?? 200;
  const share_price_toman = over.share_price_toman ?? 500000;
  const funded_shares = over.funded_shares ?? 128;
  const remaining_shares = total_shares - funded_shares;
  return {
    id: "0192f000-0000-7000-8000-0000000000a1",
    title: "تأمین هزینه عمل جراحی قلب باز کودک ۷ ساله در سیستان",
    slug: "heart-surgery-little-zahra",
    short_code: "ZAHRA7",
    subtitle: "دختری هفت‌ساله که از بدو تولد با نقص مادرزادی قلب زندگی کرده است.",
    cover_image_url: "",
    province: "سیستان و بلوچستان",
    city: "زاهدان",
    status: "active",
    urgency_level: "emergency",
    is_featured: true,
    benefactor: benefactor(),
    category: category(),
    total_shares,
    paid_shares: funded_shares,
    matched_shares: 0,
    external_shares: 0,
    reserved_shares: 3,
    funded_shares,
    remaining_shares,
    progress_percent: Math.round((funded_shares / total_shares) * 100),
    physical_progress_percent: 0,
    supporter_count: 74,
    share_price_rial: share_price_toman * 10,
    share_price_toman,
    target_amount_rial: total_shares * share_price_toman * 10,
    target_amount_toman: total_shares * share_price_toman,
    total_funded_rial: funded_shares * share_price_toman * 10,
    total_funded_toman: funded_shares * share_price_toman,
    disbursed_amount_rial: 0,
    disbursed_amount_toman: 0,
    active_matching_grant: null,
    ends_at: "2026-12-04T23:59:59+03:30",
    ends_at_jalali: "۱۴۰۵-۰۹-۱۳",
    created_at: "2026-10-02T10:12:00+03:30",
    created_at_jalali: "۱۴۰۵-۰۷-۱۰",
    ...over,
  };
};

const campaigns = [
  campaign(),
  campaign({
    id: "0192f000-0000-7000-8000-0000000000a2",
    title: "آزادی پدرِ یک خانواده از بند بدهی کارگاه",
    slug: "release-father-workshop-debt",
    short_code: "DEBT500",
    subtitle: "کارگاه کوچک چوب‌بری پس از بیماری صاحبش تعطیل شد و ۵۰۰ میلیون تومان بدهی برجای ماند.",
    total_shares: 500,
    share_price_toman: 100000,
    funded_shares: 431,
    supporter_count: 291,
    urgency_level: "important",
    active_matching_grant: {
      id: "0192f000-0000-7000-8000-0000000000b1",
      sponsor_name: "بنیاد نیکوکاری سپهر دانش",
      sponsor_logo_url: "",
      match_ratio: 1,
      total_pool_shares: 60,
      consumed_shares: 24,
    },
    ends_at: "2026-12-19T23:59:59+03:30",
    ends_at_jalali: "۱۴۰۵-۰۹-۲۸",
  }),
  campaign({
    id: "0192f000-0000-7000-8000-0000000000a3",
    title: "بازسازی کلاس درس روستای کوهستانی پس از سیل",
    slug: "rebuild-village-classroom",
    short_code: "CLASS1",
    subtitle: "سیل پاییزی، سقف تنها کلاس درس ۲۳ دانش‌آموز را با خود برد.",
    total_shares: 300,
    share_price_toman: 250000,
    funded_shares: 87,
    supporter_count: 41,
    urgency_level: "normal",
    category: category("آموزش و پرورش", "graduation-cap"),
    ends_at: "2027-01-08T23:59:59+03:30",
    ends_at_jalali: "۱۴۰۵-۱۰-۱۸",
  }),
  campaign({
    id: "0192f000-0000-7000-8000-0000000000a4",
    title: "تأمین ویلچر برقی برای دانشجوی نخبهٔ معلول",
    slug: "electric-wheelchair-student",
    short_code: "WHEEL9",
    subtitle: "مسیر دانشگاه تا خانه، هر روز چهار ساعت با ویلچر دستی.",
    total_shares: 120,
    share_price_toman: 400000,
    funded_shares: 118,
    supporter_count: 96,
    urgency_level: "critical",
    ends_at: "2026-11-25T23:59:59+03:30",
    ends_at_jalali: "۱۴۰۵-۰۹-۰۴",
  }),
];

const benefactors = [
  {
    id: "0192f000-0000-7000-8000-000000000001",
    name: "مؤسسه خیریه مهرآفرین سلامت کودکان",
    slug: "mehrafin-health",
    registration_number: "۳۸۷۲۱",
    province: "تهران",
    city: "تهران",
    short_bio: "حامی درمان کودکان بی‌بضاعت از سال ۱۳۸۴",
    description: "",
    logo_url: "",
    cover_url: "",
    website_url: "",
    is_verified: true,
    active_campaigns_count: 2,
    completed_campaigns_count: 14,
    total_raised_rial: 48200000000,
    total_raised_toman: 4820000000,
    total_disbursed_rial: 41000000000,
    total_disbursed_toman: 4100000000,
  },
  {
    id: "0192f000-0000-7000-8000-000000000002",
    name: "انجمن حمایت از خانواده‌های زندانی",
    slug: "family-support",
    registration_number: "۲۲۹۰۸",
    province: "فارس",
    city: "شیراز",
    short_bio: "آزادی زندانیان جرایم غیرعمد و توانمندسازی خانواده‌ها",
    description: "",
    logo_url: "",
    cover_url: "",
    website_url: "",
    is_verified: true,
    active_campaigns_count: 5,
    completed_campaigns_count: 31,
    total_raised_rial: 126400000000,
    total_raised_toman: 12640000000,
    total_disbursed_rial: 119800000000,
    total_disbursed_toman: 11980000000,
  },
];

const meta = {
  service: "crowdfunding-back",
  environment: "mock",
  api_version: "v1",
  app_version: "1.5.1",
  currency_base: "IRR",
  currency_display_units: ["IRR", "TOMAN"],
  timezone: "Asia/Tehran",
  today_jalali: "1405-08-24",
  share_hold_ttl_minutes: 15,
  features: {
    express_one_step_checkout: true,
    spiritual_dedications: true,
    anonymous_and_live_feed: true,
    impact_updates: true,
    merkle_transparency: true,
    external_offline_funding: true,
    shortlinks_and_ambassadors: true,
    charity_general_jars: true,
    matching_grants: true,
  },
};

const routes = {
  "/api/v1/meta": () => meta,
  "/api/v1/campaigns": (url) => {
    const size = Number(url.searchParams.get("page_size") ?? 12);
    const results = campaigns.slice(0, Number.isFinite(size) ? size : 12);
    return { ordering: "fair", count: campaigns.length, results };
  },
  "/api/v1/benefactors": () => benefactors,
  "/api/v1/jars": () => [],
  "/api/v1/campaign-categories": () => [
    {
      id: "1",
      title: "درمان و سلامت کودکان",
      slug: "health-care",
      icon_name: "heart-pulse",
      description: "",
      display_order: 1,
    },
  ],
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const { pathname } = url;
  const handler = routes[pathname];
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("access-control-allow-origin", "*");
  if (!handler) {
    res.statusCode = 404;
    res.end(
      JSON.stringify({ type: "about:blank", title: "not found", status: 404, code: "not_found" }),
    );
    return;
  }
  const body = handler(url);
  res.statusCode = 200;
  res.end(JSON.stringify(body));
}).listen(PORT, "0.0.0.0", () => {
  console.log(`mock api on http://0.0.0.0:${PORT}/api/v1`);
});
