import { ArrowLeft, CircleSlash } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BenefactorStrip } from "@/components/home/benefactor-strip";
import { CampaignCard, CampaignCardSkeleton } from "@/components/home/campaign-card";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { SectionHeading } from "@/components/home/section-heading";
import { TransparencyBand } from "@/components/home/transparency-band";
import { ButtonLink } from "@/components/ui/button";
import { getPlatform, listBenefactors, listCampaigns } from "@/lib/api/public";
import { site } from "@/lib/config/site";
import { env } from "@/lib/config/env";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [campaigns, benefactors, platform] = await Promise.all([
    listCampaigns({ status: "active", order: "fair", page_size: 3 }),
    listBenefactors(),
    getPlatform(),
  ]);

  // سه یا شش کارت: کمتر از سه = هرچه هست، بین ۳ و ۶ = دقیقاً سه (تا ردیف
  // ناقص و کارت تنها در گوشه نماند).
  const all = campaigns.items;
  const featured = all.slice(0, all.length >= 6 ? 6 : all.length >= 3 ? 3 : all.length);
  const top = featured[0];
  const totalRaisedToman = featured.reduce((sum, c) => sum + c.total_funded_toman, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: env.siteUrl,
    description: site.description,
    parentOrganization: { "@type": "Organization", name: site.organisation },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero
        campaignCount={campaigns.count}
        totalRaisedToman={totalRaisedToman}
        topProgress={top?.progress_percent ?? 0}
        topTitle={top?.title ?? ""}
        topSlug={top?.slug ?? ""}
        topShareToman={top?.share_price_toman ?? 0}
      />

      <HowItWorks />

      <section className="shell py-16" aria-labelledby="campaigns-heading">
        <SectionHeading
          eyebrow="حرکت‌های در جریان"
          title="حرکت‌هایی که منتظر سهم تو هستند"
          description={
            campaigns.ok
              ? "هر کارت، یک نیاز واقعی با مبلغ مشخص است. سهم‌های باقی‌مانده به‌روز محاسبه می‌شوند."
              : "در این لحظه ارتباط با سرور برقرار نشد؛ کمی بعد دوباره سر بزن."
          }
          action={
            <ButtonLink href="/campaigns" variant="secondary" size="sm">
              همهٔ حرکت‌ها
              <ArrowLeft className="size-3.5" aria-hidden />
            </ButtonLink>
          }
        />

        <h2 id="campaigns-heading" className="sr-only">
          حرکت‌های در جریان
        </h2>

        {featured.length > 0 ? (
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : campaigns.ok ? (
          <div className="mt-9 flex flex-col items-center justify-center rounded-card border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-muted">
              <CircleSlash className="size-6" aria-hidden />
            </span>
            <p className="mt-4 text-[0.95rem] font-bold">هنوز حرکتی برای نمایش نیست</p>
            <p className="mt-2 max-w-sm text-[0.85rem] leading-7 text-muted">
              به‌محض انتشار حرکت تازه توسط خیریه‌ها، همین‌جا نمایش داده می‌شود.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
          </div>
        )}
      </section>

      <BenefactorStrip benefactors={benefactors.items} />

      <TransparencyBand />

      {platform.features.merkle_transparency ? (
        <section className="shell pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-6 py-5">
            <p className="text-[0.86rem] text-ink-soft">
              شفافیت رمزنگاری فعال است — سهم هر مشارکت قابل اثبات ریاضی است.
            </p>
            <Link
              href="/transparency"
              className="text-[0.84rem] font-bold text-accent hover:underline"
            >
              دیوار شفافیت را ببین
            </Link>
          </div>
        </section>
      ) : null}

      <FinalCta />
    </>
  );
}
