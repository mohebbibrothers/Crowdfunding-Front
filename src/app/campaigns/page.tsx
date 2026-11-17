import { AlertTriangle, ArrowLeft, CircleSlash, Compass, SearchX, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ActiveFilters } from "@/components/campaigns/active-filters";
import { FiltersPanel } from "@/components/campaigns/filters-panel";
import { FiltersSheet } from "@/components/campaigns/filters-sheet";
import { SearchField } from "@/components/campaigns/search-field";
import { ShowMore } from "@/components/campaigns/show-more";
import { SortSelect } from "@/components/campaigns/sort-select";
import { CampaignCard } from "@/components/home/campaign-card";
import { Reveal } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { ButtonLink } from "@/components/ui/button";
import { getPlatform, listCampaigns, listCategories } from "@/lib/api/public";
import {
  STATUS_LABELS,
  hasActiveFilters,
  parseFilters,
  type RawSearchParams,
} from "@/lib/campaigns/filters";
import { env } from "@/lib/config/env";
import { formatInt } from "@/lib/format/numbers";
import { site } from "@/lib/config/site";

type Props = { searchParams: Promise<RawSearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const filtered = hasActiveFilters(filters);
  const title = filtered
    ? `حرکت‌های خیر — ${STATUS_LABELS[filters.status]}`
    : "حرکت‌های خیر — فهرست کامل حرکت‌های سهم‌محور";

  return {
    title,
    description:
      "فهرست کامل حرکت‌های خیرخواهانهٔ بنیاد علوی: هر حرکت یک نیاز واقعی با مبلغ روشن است و به سهم‌های کوچک تقسیم شده. با موضوع، استان، فوریت و حامی مضاعف صافی کنید.",
    alternates: { canonical: "/campaigns" },
    // صفحه‌های صافی‌دار نباید نسخهٔ تکراری صفحهٔ اصلی فهرست ایندکس شوند
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      title,
      description: "همهٔ حرکت‌های در جریان، با سهم روشن و پیشرفت شفاف.",
      url: `${env.siteUrl}/campaigns`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — حرکت‌ها` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "همهٔ حرکت‌های در جریان، با سهم روشن و پیشرفت شفاف.",
      images: ["/og.png"],
    },
  };
}

export default async function CampaignsPage({ searchParams }: Props) {
  const filters = parseFilters(await searchParams);

  const [campaigns, categories, platform] = await Promise.all([
    listCampaigns({
      status: filters.status,
      order: filters.order,
      category: filters.category || undefined,
      province: filters.province || undefined,
      urgency: filters.urgency || undefined,
      has_matching: filters.matching || undefined,
      q: filters.q || undefined,
    }),
    listCategories(),
    getPlatform(),
  ]);

  const matchingAvailable = platform.features.matching_grants;
  const items = campaigns.items;
  const count = campaigns.count;

  return (
    <>
      {/* ── سرصفحهٔ صفحه ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-7 pb-8 sm:pt-9">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-70"
          style={{
            background:
              "radial-gradient(52% 60% at 50% 0%, color-mix(in oklab, var(--brand) 14%, transparent), transparent 72%)",
          }}
        />
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-64 opacity-30"
        />

        <div className="shell relative">
          <nav aria-label="مسیر" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.76rem] text-muted">
              <li>
                <Link
                  href="/"
                  className="-my-1 justify-center px-1 py-1.5 transition-colors hover:text-accent"
                >
                  خانه
                </Link>
              </li>
              <li aria-hidden className="text-line-strong">
                /
              </li>
              <li aria-current="page" className="py-1.5 font-semibold text-ink-soft">
                حرکت‌ها
              </li>
            </ol>
          </nav>

          <Reveal variant="fade" className="max-w-3xl">
            <p className="eyebrow mb-3">
              <span aria-hidden className="h-px w-5 bg-gold" />
              {site.name} · فهرست حرکت‌ها
            </p>
            <h1 className="display-2">
              <Words text="حرکت‌هایی که منتظر سهم تو هستند" delay={60} step={70} />
            </h1>
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-8 text-muted">
              هر کارت یک نیاز واقعی با مبلغ روشن است؛ سهم‌های باقی‌مانده همین حالا به‌روزند. با
              موضوع، استان، فوریت یا حامی مضاعف صافی کن تا به نزدیک‌ترین حرکت برسی.
            </p>
          </Reveal>

          <Reveal
            variant="up"
            delay={160}
            className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-5"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Stat
                value={count}
                label={campaigns.ok ? "حرکت با این صافی‌ها" : "فهرست در دسترس نیست"}
              />
              <span aria-hidden className="hidden h-8 w-px bg-line sm:block" />
              <Stat value={categories.length} label="موضوع فعال" />
            </div>
            <p className="inline-flex items-center gap-1.5 text-[0.8rem] text-muted">
              <Sparkles className="size-3.5 text-gold" aria-hidden />
              رتبه‌بندی پیش‌فرض، توزیع منصفانه است
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── بدنه: ستون صافی + نتایج ──────────────────────────────────────── */}
      <section className="shell pb-24" aria-labelledby="campaigns-results-heading">
        <h2 id="campaigns-results-heading" className="sr-only">
          نتیجهٔ فهرست حرکت‌ها
        </h2>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* صافی‌های دسکتاپ */}
          <aside className="hidden w-[16.5rem] shrink-0 lg:sticky lg:top-28 lg:block">
            <div className="rounded-card border border-line bg-surface p-5 shadow-e1">
              <FiltersPanel
                filters={filters}
                categories={categories}
                matchingAvailable={matchingAvailable}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {/* نوار ابزار */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-full min-w-0 flex-1 sm:w-auto">
                  <SearchField filters={filters} />
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <SortSelect filters={filters} />
                  <FiltersSheet
                    filters={filters}
                    categories={categories}
                    matchingAvailable={matchingAvailable}
                    count={count}
                  />
                </div>
              </div>

              {campaigns.ok ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="num text-[0.8rem] text-muted" aria-live="polite">
                    <span className="font-bold text-ink">{formatInt(count)}</span> حرکت
                    {filters.q ? (
                      <>
                        {" "}
                        برای «<span className="font-semibold text-ink-soft">{filters.q}</span>»
                      </>
                    ) : null}
                  </p>
                  <ActiveFilters filters={filters} categories={categories} />
                </div>
              ) : null}
            </div>

            {/* نتیجه */}
            <div className="mt-6">
              {!campaigns.ok ? (
                <ErrorState />
              ) : items.length === 0 ? (
                <EmptyState
                  query={filters.q}
                  onMatching={filters.matching}
                  matchingAvailable={matchingAvailable}
                />
              ) : (
                <ShowMore className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" initial={9} step={9}>
                  {items.map((campaign, index) => (
                    <Reveal
                      key={campaign.id}
                      variant="up"
                      delay={Math.min(index, 8) * 70}
                      className="h-full min-w-0"
                    >
                      <CampaignCard campaign={campaign} />
                    </Reveal>
                  ))}
                </ShowMore>
              )}
            </div>

            {/* پانویس راهنما */}
            <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-card border border-dashed border-line-strong bg-surface-2/60 p-6 sm:flex-row sm:items-center">
              <p className="text-[0.86rem] leading-7 text-muted">
                حرکت تازه‌ای که پیدا نکردی؟ همهٔ حرکت‌ها با تأیید خیریه منتشر می‌شوند؛ می‌توانی از
                صفحهٔ اصلی هم شروع کنی.
              </p>
              <ButtonLink href="/" variant="secondary" size="md" className="shrink-0">
                صفحهٔ اصلی
                <ArrowLeft className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <ItemListJsonLd items={items.map((item) => ({ slug: item.slug, title: item.title }))} />
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="num text-[1.35rem] leading-none font-black text-brand">
        {formatInt(value)}
      </span>
      <span className="text-[0.78rem] text-muted">{label}</span>
    </p>
  );
}

function EmptyState({
  query,
  onMatching,
  matchingAvailable,
}: {
  query: string;
  onMatching: boolean;
  matchingAvailable: boolean;
}) {
  const reason = query
    ? `برای «${query}» چیزی پیدا نشد.`
    : onMatching && matchingAvailable
      ? "با صافیِ «حامی مضاعف» حرکتی نمانده."
      : "با این صافی‌ها حرکتی نیست.";

  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-surface-2 text-muted">
        {query ? (
          <SearchX className="size-7" aria-hidden />
        ) : (
          <CircleSlash className="size-7" aria-hidden />
        )}
      </span>
      <p className="mt-5 text-[1.02rem] font-bold text-ink">{reason}</p>
      <p className="mt-2 max-w-md text-[0.88rem] leading-7 text-muted">
        یکی از صافی‌ها را بردار یا از فهرست کامل شروع کن؛ حرکت‌های تازه به‌محض تأیید خیریه همین‌جا
        منتشر می‌شوند.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <ButtonLink href="/campaigns" size="md">
          دیدن همهٔ حرکت‌ها
          <Compass className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-surface px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-gold-tint text-gold-ink">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <p className="mt-4 text-[0.98rem] font-bold">ارتباط با سرور برقرار نشد</p>
      <p className="mt-2 max-w-sm text-[0.86rem] leading-7 text-muted">
        فهرست حرکت‌ها همین حالا در دسترس نیست. چند لحظه بعد دوباره سر بزن — اطلاعات حرکتی از دست
        نرفته.
      </p>
      <ButtonLink href="/campaigns" variant="secondary" size="md" className="mt-5">
        تلاش دوباره
      </ButtonLink>
    </div>
  );
}

function ItemListJsonLd({ items }: { items: Array<{ slug: string; title: string }> }) {
  if (items.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.slice(0, 20).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `${env.siteUrl}/campaigns/${item.slug}`,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
