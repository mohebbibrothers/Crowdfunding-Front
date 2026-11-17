import { CircleSlash } from "lucide-react";
import type { Metadata } from "next";

import { AllCampaignsTile } from "@/components/home/all-campaigns-tile";
import { CampaignCard, CampaignCardSkeleton } from "@/components/home/campaign-card";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { TransparencyBand } from "@/components/home/transparency-band";
import { VerseBanner } from "@/components/home/verse-banner";
import { getPlatform, listCampaigns } from "@/lib/api/public";
import { env } from "@/lib/config/env";
import { site } from "@/lib/config/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.promise}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [campaigns] = await Promise.all([
    listCampaigns({ status: "active", order: "fair", page_size: 3 }),
    getPlatform(),
  ]);

  // صفحهٔ خانه فقط سه حرکت ویژه را نشان می‌دهد؛ فهرست کامل جای خودش است.
  const featured = campaigns.items.slice(0, 3);
  const top = featured[0] ?? null;

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

      <VerseBanner />

      <Hero campaignCount={campaigns.count} top={top} />

      <HowItWorks />

      <section className="shell py-20 lg:py-24" aria-labelledby="campaigns-heading">
        <h2 id="campaigns-heading" className="sr-only">
          حرکت‌های در جریان
        </h2>

        <SectionHeading
          eyebrow="حرکت‌های در جریان"
          title="حرکت‌هایی که منتظر سهم تو هستند"
          description={
            campaigns.ok
              ? "هر کارت یک نیاز واقعی با مبلغ روشن است؛ سهم‌های باقی‌مانده لحظه‌به‌لحظه به‌روز می‌شود."
              : "در این لحظه ارتباط با سرور برقرار نشد؛ کمی بعد دوباره سر بزن."
          }
        />

        {featured.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((campaign, index) => (
              <Reveal key={campaign.id} variant="up" delay={index * 110} className="h-full min-w-0">
                <CampaignCard campaign={campaign} />
              </Reveal>
            ))}
            {featured.length < 3 ? (
              <Reveal variant="up" delay={featured.length * 110} className="h-full min-w-0">
                <AllCampaignsTile count={campaigns.count} />
              </Reveal>
            ) : null}
          </div>
        ) : campaigns.ok ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-card border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-muted">
              <CircleSlash className="size-6" aria-hidden />
            </span>
            <p className="mt-4 text-[0.95rem] font-bold">هنوز حرکتی برای نمایش نیست</p>
            <p className="mt-2 max-w-sm text-[0.85rem] leading-7 text-muted">
              به‌محض انتشار حرکت تازه توسط خیریه‌ها، همین‌جا نمایش داده می‌شود.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal variant="up" delay={0}>
              <CampaignCardSkeleton />
            </Reveal>
            <Reveal variant="up" delay={110}>
              <CampaignCardSkeleton />
            </Reveal>
            <Reveal variant="up" delay={220}>
              <CampaignCardSkeleton />
            </Reveal>
          </div>
        )}
      </section>

      <TransparencyBand />

      <FinalCta />
    </>
  );
}
