import { ArrowLeft, BadgeCheck, Clock3, Sparkles, Users } from "lucide-react";
import Link from "next/link";

import { CategoryIcon } from "@/components/ui/category-icon";
import { Progress } from "@/components/ui/progress";
import type { CampaignCard as CampaignCardData } from "@/lib/api/schemas";
import { formatJalali, formatRemaining } from "@/lib/format/date";
import { formatAmount, formatToman } from "@/lib/format/money";
import { formatInt, formatPercent } from "@/lib/format/numbers";
import { cn } from "@/lib/utils/cn";

const urgencyMeta: Record<
  CampaignCardData["urgency_level"],
  { label: string; tone: "danger" | "gold" | "neutral" | "brand" }
> = {
  critical: { label: "بحرانی", tone: "danger" },
  emergency: { label: "فوری", tone: "danger" },
  important: { label: "مهم", tone: "gold" },
  normal: { label: "عادی", tone: "neutral" },
};

const statusMeta: Record<
  CampaignCardData["status"],
  { label: string; tone: "success" | "brand" | "neutral" }
> = {
  active: { label: "در حال جمع‌آوری", tone: "brand" },
  funded: { label: "تأمین شد", tone: "success" },
  completed: { label: "به پایان رسید", tone: "success" },
  draft: { label: "پیش‌نویس", tone: "neutral" },
  cancelled: { label: "لغو شد", tone: "neutral" },
  expired: { label: "مهلت تمام شد", tone: "neutral" },
  archived: { label: "بایگانی", tone: "neutral" },
};

/**
 * پوشش گرافیکی جایگزین وقتی حرکت تصویر ندارد.
 * به‌جای حرف اولِ عنوان، از نقش هندسی برند و نشان دسته استفاده می‌کند تا
 * کارتِ بی‌تصویر هم «طراحی‌شده» دیده شود — و هیچ درخواست شبکه‌ای نداشته باشد.
 */
function CoverFallback({ iconName }: { iconName: string }) {
  return (
    <div aria-hidden className="relative size-full overflow-hidden bg-brand-deep">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 100% at 82% 0%, color-mix(in oklab, var(--gold) 34%, transparent), transparent 58%), radial-gradient(95% 85% at 0% 100%, color-mix(in oklab, var(--brand-soft) 85%, transparent), transparent 66%)",
        }}
      />
      <div className="dot-grid absolute inset-0 opacity-30" />
      <svg
        viewBox="0 0 40 40"
        aria-hidden
        className="absolute -start-10 -bottom-10 size-48 text-on-brand/10"
        fill="currentColor"
      >
        <path d="M20 4 L20 20 L6 28 Z" />
        <path d="M20 20 L36 20 L28 34 Z" />
      </svg>
      <div className="relative flex size-full items-center justify-center">
        <span className="inline-flex size-16 items-center justify-center rounded-2xl border border-on-brand/25 bg-on-brand/10 text-on-brand/90 backdrop-blur-sm">
          <CategoryIcon name={iconName} className="size-7" />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}

export function CampaignCard({ campaign }: { campaign: CampaignCardData }) {
  const {
    title,
    slug,
    subtitle,
    cover_image_url,
    benefactor,
    category,
    urgency_level,
    status,
    progress_percent,
    remaining_shares,
    total_shares,
    share_price_toman,
    supporter_count,
    active_matching_grant,
    ends_at,
  } = campaign;

  const urgency = urgencyMeta[urgency_level];
  const state = statusMeta[status];
  const isFunded = remaining_shares === 0 || status === "funded" || status === "completed";

  return (
    <article className="card card-lift reveal group flex h-full flex-col overflow-hidden">
      <Link
        href={`/campaigns/${slug}`}
        prefetch={false}
        className="relative block aspect-[16/10] w-full overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        {cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover_image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
          />
        ) : (
          <CoverFallback iconName={category?.icon_name ?? ""} />
        )}

        <div className="absolute inset-x-3 top-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-pill border border-white/20 bg-black/60 px-2.5 py-1 text-[0.71rem] font-bold backdrop-blur-md",
              urgency_level === "emergency" || urgency_level === "critical"
                ? "text-rose-200"
                : urgency_level === "important"
                  ? "text-amber-200"
                  : "text-white",
            )}
          >
            {urgency_level === "emergency" || urgency_level === "critical" ? (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-current" />
              </span>
            ) : null}
            {urgency.label}
          </span>

          {active_matching_grant && active_matching_grant.match_ratio > 1 ? (
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-white/20 bg-black/60 px-2.5 py-1 text-[0.71rem] font-bold text-amber-100 backdrop-blur-md">
              <Sparkles className="size-3" aria-hidden />
              اثر مضاعف ×{formatAmount(active_matching_grant.match_ratio)}
            </span>
          ) : null}
        </div>

        {category ? (
          <span className="absolute inset-x-3 bottom-3 inline-flex w-fit items-center rounded-pill bg-black/55 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur-md">
            {category.title}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[0.74rem] text-muted">
          <span className="flex min-w-0 items-center gap-1">
            <span className="truncate">{benefactor.name}</span>
            {benefactor.is_verified ? (
              <BadgeCheck className="size-3.5 shrink-0 text-accent" aria-label="خیریهٔ تأییدشده" />
            ) : null}
          </span>
          <span aria-hidden className="shrink-0 text-line-strong">
            •
          </span>
          <span className="shrink-0 font-semibold whitespace-nowrap text-accent">
            {state.label}
          </span>
        </div>

        <h3 className="mt-2.5 text-[1.03rem] leading-7 font-bold">
          <Link
            href={`/campaigns/${slug}`}
            prefetch={false}
            className="transition-colors hover:text-accent"
          >
            {title}
          </Link>
        </h3>

        {subtitle ? (
          <p className="mt-1.5 line-clamp-2 text-[0.83rem] leading-6 text-muted">{subtitle}</p>
        ) : null}

        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-end justify-between gap-3">
            <span className="text-[0.78rem] font-bold text-accent">
              {formatPercent(progress_percent)} تأمین شده
            </span>
            <span className="num text-[0.74rem] text-muted">
              {formatInt(remaining_shares)} از {formatInt(total_shares)} سهم باقی است
            </span>
          </div>
          <Progress value={progress_percent} label={`پیشرفت ${title}`} />

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[0.78rem]">
            <div>
              <dt className="text-muted">هر سهم</dt>
              <dd className="num mt-1 font-bold text-ink">{formatToman(share_price_toman)}</dd>
            </div>
            <div>
              <dt className="text-muted">همراهان</dt>
              <dd className="num mt-1 inline-flex items-center gap-1.5 font-bold text-ink">
                <Users className="size-3.5 text-muted" aria-hidden />
                {formatInt(supporter_count)} نفر
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-muted">
              <Clock3 className="size-3.5" aria-hidden />
              {isFunded
                ? `تأمین‌شده در ${formatJalali(campaign.ends_at_jalali)}`
                : formatRemaining(ends_at)}
            </span>
            <Link
              href={`/campaigns/${slug}`}
              prefetch={false}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-[0.8rem] font-bold transition-colors",
                isFunded
                  ? "bg-surface-2 text-ink-soft hover:text-accent"
                  : "bg-brand text-on-brand hover:bg-brand-soft",
              )}
            >
              {isFunded ? "مشاهدهٔ نتیجه" : "سهیم می‌شوم"}
              <ArrowLeft className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CampaignCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden>
      <div className="aspect-[16/10] w-full animate-pulse bg-surface-2" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded-pill bg-surface-2" />
        <div className="h-4 w-5/6 animate-pulse rounded-pill bg-surface-2" />
        <div className="h-3 w-2/3 animate-pulse rounded-pill bg-surface-2" />
        <div className="h-2 w-full animate-pulse rounded-pill bg-surface-2" />
      </div>
    </div>
  );
}

export { formatAmount };
