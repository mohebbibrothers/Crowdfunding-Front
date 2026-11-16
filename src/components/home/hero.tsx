import { ArrowLeft, BadgeCheck, Layers, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { formatInt, formatPercent } from "@/lib/format/numbers";
import { cn } from "@/lib/utils/cn";

/**
 * «موزاییک سهم» — تصویر امضای هم‌سهم.
 * هر مربع یک سهم است؛ تعدادی روشن (تأمین‌شده) و بقیه خالی.
 * کاملاً CSS/SVG، بدون تصویر و بدون جاوااسکریپت: سبک، مقیاس‌پذیر و دسترس‌پذیر.
 */
function ShareMosaic({ filledPercent }: { filledPercent: number }) {
  const total = 11 * 7;
  const percent = Math.min(100, Math.max(0, filledPercent));
  const filled = Math.round((percent / 100) * total);
  // «سهم بعدی»: نشانه‌ای برای اولین خانهٔ خالی، تا موزاییکِ صفر‌درصد هم مرده به نظر نرسد
  // بدون آنکه عددی ساختگی نشان داده شود.
  const nextIndex = filled < total ? filled : -1;

  return (
    <div className="w-full min-w-0 rounded-card border border-line bg-surface/70 p-4 shadow-e3 backdrop-blur-sm">
      <div
        role="img"
        aria-label={`${formatPercent(percent)} از سهم‌های این حرکت تأمین شده است`}
        className="grid grid-cols-11 gap-1.5"
      >
        {Array.from({ length: total }, (_, index) => {
          const isFilled = index < filled;
          const isNext = index === nextIndex;
          const isEdge = index % 11 === 0 || index % 11 === 10;
          return (
            <span
              key={index}
              className={cn(
                "aspect-square min-w-0 rounded-[4px] transition-colors duration-500",
                isFilled
                  ? index % 9 === 0
                    ? "bg-gold-soft"
                    : "bg-accent"
                  : isNext
                    ? "bg-surface-2 ring-1 ring-gold-soft ring-inset"
                    : isEdge
                      ? "bg-surface-3"
                      : "bg-surface-2",
              )}
              style={{
                animationDelay: `${(index % 11) * 18 + Math.floor(index / 11) * 14}ms`,
              }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-line/70 pt-2.5 text-[0.7rem] text-muted">
        <span className="font-semibold text-ink-soft">هر مربع، یک سهم</span>
        <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-accent" aria-hidden />
            تأمین‌شده
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-gold-soft" aria-hidden />
            سهم حامی
          </span>
          {filled === 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-[3px] bg-surface-2 ring-1 ring-gold-soft ring-inset"
                aria-hidden
              />
              سهم بعدی
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px] bg-surface-3" aria-hidden />
            باقی‌مانده
          </span>
        </span>
      </div>
    </div>
  );
}

export interface HeroProps {
  campaignCount: number;
  totalRaisedToman: number;
  topProgress: number;
  topTitle: string;
  topSlug: string;
  topShareToman: number;
}

export function Hero({
  campaignCount,
  totalRaisedToman,
  topProgress,
  topTitle,
  topSlug,
  topShareToman,
}: HeroProps) {
  const hasLive = campaignCount > 0;

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16">
      {/* هالهٔ نوری برند، بدون تصویر */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[34rem] opacity-[0.55]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-pill border border-gold/30 bg-gold-tint px-3 py-1.5 text-[0.76rem] font-semibold text-gold">
            <Sparkles className="size-3.5" aria-hidden />
            سکوی جمع‌سپاری سهم‌محور حرکت‌های خیر
          </span>

          <h1 className="display-1 mt-6">
            کار خیر،
            <span className="relative mx-2 inline-block">
              <span className="relative z-10 text-accent">سهم‌سهم</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-sm bg-gold-soft/40"
              />
            </span>
            می‌شود
          </h1>

          <p className="lead mt-6 max-w-xl">
            هر حرکت خیر به سهم‌های کوچک و مشخص تقسیم می‌شود. شما به تعداد دلخواه سهم برمی‌دارید،
            مبلغ را همان لحظه می‌پردازید و رسید رسمی با گواهی شفافیت می‌گیرید — بی‌آنکه لازم باشد
            فرمی پر کنید یا منتظر تأیید بمانید.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/campaigns" size="lg" className="w-full sm:w-auto">
              حرکت‌ها را ببین و سهیم شو
              <ArrowLeft className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/about" variant="secondary" size="lg" className="w-full sm:w-auto">
              هم‌سهم چگونه کار می‌کند؟
            </ButtonLink>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.8rem] text-ink-soft">
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" aria-hidden />
              خیریه‌های دارای مجوز و شبا تأییدشده
            </li>
            <li className="inline-flex items-center gap-2">
              <BadgeCheck className="size-4 text-accent" aria-hidden />
              رسید رسمی و کد رهگیری برای هر مشارکت
            </li>
            <li className="inline-flex items-center gap-2">
              <Layers className="size-4 text-accent" aria-hidden />
              شفافیت مالی با اثبات رمزنگاری
            </li>
          </ul>
        </div>

        <div className="relative min-w-0">
          <div className="relative mx-auto w-full max-w-md min-w-0">
            <ShareMosaic filledPercent={hasLive ? topProgress : 0} />

            {hasLive ? (
              <Link
                href={`/campaigns/${topSlug}`}
                className="mt-4 flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-4 shadow-e2 transition-colors hover:border-brand-soft"
              >
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-semibold text-gold">در صدر حرکت‌ها</p>
                  <p className="mt-1 line-clamp-2 text-[0.86rem] leading-6 font-bold text-ink">
                    {topTitle}
                  </p>
                  <p className="num mt-1 text-[0.74rem] text-muted">
                    هر سهم {formatInt(topShareToman)} تومان
                  </p>
                </div>
                <span className="shrink-0 rounded-pill bg-brand-tint px-3 py-1.5 text-[0.78rem] font-bold text-accent">
                  {formatPercent(topProgress)}
                </span>
              </Link>
            ) : null}

            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-card border border-line bg-surface p-4 text-center shadow-e1">
                <dt className="text-[0.72rem] text-muted">حرکت‌های فعال</dt>
                <dd className="num mt-1 text-xl font-extrabold text-ink">
                  {formatInt(campaignCount)}
                </dd>
              </div>
              <div className="rounded-card border border-line bg-surface p-4 text-center shadow-e1">
                <dt className="text-[0.72rem] text-muted">جمع مشارکت‌ها</dt>
                <dd className="num mt-1 text-xl font-extrabold text-ink">
                  {totalRaisedToman >= 1_000_000
                    ? `${formatInt(totalRaisedToman / 1_000_000)} م.ت`
                    : `${formatInt(totalRaisedToman)} ت`}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
