import { ArrowLeft, BadgeCheck, Clock3, Layers, ShieldCheck, Sparkles, Users } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import type { CampaignCard as CampaignCardData } from "@/lib/api/schemas";
import { formatRemaining } from "@/lib/format/date";
import { formatToman } from "@/lib/format/money";
import { formatInt, formatPercent } from "@/lib/format/numbers";
import { site } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * «موزاییک سهم» — امضای بصری هم‌سهم.
 * هر مربع یک سهم است؛ تعداد پرشده دقیقاً برابر درصد واقعی پیشرفت است
 * (هیچ کف ساختگی‌ای وجود ندارد). خانهٔ بعدی با نشانهٔ «سهم بعدی» مشخص می‌شود
 * تا حالت صفر‌درصد هم مرده به نظر نرسد.
 */
function ShareMosaic({ filledPercent }: { filledPercent: number }) {
  const columns = 11;
  const total = columns * 7;
  const percent = Math.min(100, Math.max(0, filledPercent));
  const filled = Math.round((percent / 100) * total);
  const nextIndex = filled < total ? filled : -1;

  return (
    <div className="min-w-0 rounded-2xl border border-line bg-surface-2 p-3.5 sm:p-4">
      <div
        role="img"
        aria-label={`${formatPercent(percent)} از سهم‌های این حرکت تأمین شده است`}
        className="grid grid-cols-11 gap-1.5"
      >
        {Array.from({ length: total }, (_, index) => {
          const isFilled = index < filled;
          const isNext = index === nextIndex;
          const isEdge = index % columns === 0 || index % columns === columns - 1;
          return (
            <span
              key={index}
              style={{
                animationDelay: `${(index % columns) * 16 + Math.floor(index / columns) * 12}ms`,
              }}
              className={cn(
                "aspect-square min-w-0 animate-tile-in rounded-[5px]",
                isFilled
                  ? index % 9 === 0
                    ? "bg-gold-soft"
                    : "bg-brand"
                  : isNext
                    ? "bg-surface ring-1 ring-gold ring-inset"
                    : isEdge
                      ? "bg-surface-3"
                      : "bg-surface",
              )}
            />
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-line pt-2.5 text-[0.68rem] text-muted">
        <span className="font-bold text-ink-soft">هر مربع، یک سهم</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-[3px] bg-brand" />
            تأمین‌شده
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-[3px] bg-gold-soft" />
            سهم حامی
          </span>
          {filled === 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-2.5 rounded-[3px] bg-surface-2 ring-1 ring-gold ring-inset"
              />
              سهم بعدی
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2.5 rounded-[3px] border border-line-strong bg-surface"
            />
            باقی‌مانده
          </span>
        </span>
      </div>
    </div>
  );
}

/** خطِ قلمِ طلایی زیر واژهٔ کلیدی تیتر — SVG درون‌خطی، بدون تصویر. */
function BrushUnderline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 14"
      preserveAspectRatio="none"
      className="absolute inset-x-0 -bottom-1.5 z-0 h-3 w-full text-gold"
    >
      <path
        d="M3 9.5C46 4.2 96 2.8 217 7.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export interface HeroProps {
  campaignCount: number;
  top: CampaignCardData | null;
}

export function Hero({ campaignCount, top }: HeroProps) {
  const hasLive = top !== null;
  const percent = top?.progress_percent ?? 0;
  const remaining = top?.remaining_shares ?? 0;
  const totalShares = top?.total_shares ?? 0;

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 lg:pb-24">
      {/* هالهٔ زمردی + شبکهٔ نقطه‌ای + قوس کهربایی — همه CSS */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-52 h-[42rem] opacity-80"
        style={{
          background:
            "radial-gradient(58% 52% at 50% 0%, color-mix(in oklab, var(--brand) 20%, transparent), transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-x-0 top-0 h-[30rem] opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-24 top-24 size-[26rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gold) 30%, transparent), transparent 68%)",
        }}
      />

      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
        {/* ── ستون متن ───────────────────────────────────────────────────── */}
        <div className="animate-fade">
          <span className="inline-flex items-center gap-2 rounded-pill border border-gold/35 bg-gold-tint/70 px-3.5 py-1.5 text-[0.74rem] font-bold text-gold-ink">
            <Sparkles className="size-3.5" aria-hidden />
            سامانهٔ سهم‌محور {site.organisation}
          </span>

          <h1 className="display-1 mt-6">
            کار خیر،
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-accent">سهم‌سهم</span>
              <BrushUnderline />
            </span>{" "}
            می‌شود
          </h1>

          <p className="lead mt-7 max-w-xl">
            هر حرکت، یک نیاز واقعی با مبلغ روشن است که به سهم‌های کوچک تقسیم شده. یک سهم بردار، همان
            لحظه پرداخت کن و رسید رسمی با گواهی شفافیت بگیر — بی‌فرم، بی‌انتظار، بی‌واسطه.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/campaigns" size="lg">
              حرکت‌ها را ببین و سهیم شو
              <ArrowLeft className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#how" variant="secondary" size="lg">
              هم‌سهم چطور کار می‌کند؟
            </ButtonLink>
          </div>

          <ul className="mt-10 grid gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-3">
            {site.assurances.map((item) => (
              <li key={item.title} className="flex items-start gap-2.5">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[0.83rem] font-bold text-ink">{item.title}</span>
                  <span className="mt-0.5 block text-[0.74rem] leading-5 text-muted">
                    {item.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── میزِ سهم ───────────────────────────────────────────────────── */}
        <div className="relative animate-rise" style={{ animationDelay: "120ms" }}>
          {/* صفحهٔ پشتی، برای عمق */}
          <div
            aria-hidden
            className="absolute inset-x-6 top-6 -bottom-3 -z-10 rounded-[2rem] border border-line bg-surface-2/70"
          />

          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-5 shadow-e3 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[0.78rem] font-bold text-ink">
                <Layers className="size-4 text-accent" aria-hidden />
                میزِ سهم
              </span>
              {hasLive ? (
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand-tint px-2.5 py-1 text-[0.68rem] font-bold text-accent">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                  </span>
                  در حال جمع‌آوری
                </span>
              ) : (
                <span className="rounded-pill bg-surface-2 px-2.5 py-1 text-[0.68rem] font-bold text-muted">
                  به‌زودی
                </span>
              )}
            </div>

            <div className="mt-5">
              <ShareMosaic filledPercent={percent} />
            </div>

            {hasLive ? (
              <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
                <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-muted">
                  {top.benefactor.name}
                  {top.benefactor.is_verified ? (
                    <BadgeCheck className="size-3.5 text-accent" aria-label="خیریهٔ تأییدشده" />
                  ) : null}
                </p>
                <h2 className="mt-1.5 text-[0.95rem] leading-7 font-bold">
                  <Link
                    href={`/campaigns/${top.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {top.title}
                  </Link>
                </h2>

                <div className="mt-3 flex items-center justify-between gap-3 text-[0.72rem]">
                  <span className="font-bold text-accent">{formatPercent(percent)} تأمین شده</span>
                  <span className="num text-muted">
                    {formatInt(remaining)} از {formatInt(totalShares)} سهم باقی
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-pill bg-surface-3">
                  <span
                    className="block h-full origin-right animate-progress-in rounded-pill bg-gradient-to-l from-brand to-accent-soft"
                    style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                  />
                </div>

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
                  <span className="num text-[0.8rem] font-bold text-ink">
                    هر سهم {formatToman(top.share_price_toman)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[0.74rem] text-muted">
                    <Clock3 className="size-3.5" aria-hidden />
                    {formatRemaining(top.ends_at)}
                  </span>
                </div>

                <Link
                  href={`/campaigns/${top.slug}`}
                  className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-pill bg-brand px-4 py-2.5 text-[0.84rem] font-bold text-on-brand transition-colors hover:bg-brand-soft"
                >
                  سهم بردار
                  <ArrowLeft className="size-3.5" aria-hidden />
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-line-strong bg-paper p-5 text-center">
                <ShieldCheck className="mx-auto size-6 text-muted" aria-hidden />
                <p className="mt-2 text-[0.84rem] font-bold">حرکت شاخص در دست انتشار است</p>
                <p className="mt-1.5 text-[0.76rem] leading-6 text-muted">
                  به‌محض تأیید خیریه‌ها، همین‌جا نمایش داده می‌شود.
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 text-[0.72rem] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5" aria-hidden />
                <span className="num">{formatInt(top?.supporter_count ?? 0)}</span> همراه
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="size-3.5" aria-hidden />
                <span className="num">{formatInt(campaignCount)}</span> حرکت فعال
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
