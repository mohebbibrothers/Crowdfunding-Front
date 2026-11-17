"use client";

import { Check, ChevronDown, RotateCcw, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  PROVINCES,
  STATUS_LABELS,
  STATUS_VALUES,
  URGENCY_LABELS,
  URGENCY_VALUES,
  hasActiveFilters,
  toQueryString,
  type CampaignFilters,
} from "@/lib/campaigns/filters";
import type { CategoryItem } from "@/lib/api/schemas";
import { cn } from "@/lib/utils/cn";

/** ردیف چیپ‌های یک گروه؛ انتخاب با کلیک، لغو با کلیک دوباره. */
function ChipRow<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T | "";
  onChange: (next: T | "") => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange("")}
        aria-pressed={value === ""}
        className={cn(
          "rounded-pill border px-3 py-1.5 text-[0.78rem] font-semibold transition-colors duration-200",
          value === ""
            ? "border-brand bg-brand text-on-brand"
            : "border-line bg-surface text-ink-soft hover:border-brand-soft hover:text-accent",
        )}
      >
        همه
      </button>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(active ? "" : option.value)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1 rounded-pill border px-3 py-1.5 text-[0.78rem] font-semibold transition-colors duration-200",
              active
                ? "border-brand bg-brand text-on-brand"
                : "border-line bg-surface text-ink-soft hover:border-brand-soft hover:text-accent",
            )}
          >
            {active ? <Check className="size-3" aria-hidden /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function GroupHeading({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between gap-2">
      <h3 className="text-[0.74rem] font-bold tracking-wide text-gold-ink">{children}</h3>
      {hint ? <span className="text-[0.68rem] text-muted">{hint}</span> : null}
    </div>
  );
}

export interface FiltersPanelProps {
  filters: CampaignFilters;
  categories: CategoryItem[];
  /** فقط وقتی بک‌اند این قابلیت را روشن کرده باشد */
  matchingAvailable: boolean;
  /** در شیت موبایل، بعد از انتخاب بسته شود */
  onNavigate?: () => void;
}

/**
 * پنل فیلترها — هم در ستون کنار فهرست (دسکتاپ) و هم در شیت موبایل استفاده می‌شود.
 * هر تغییر مستقیماً آدرس را عوض می‌کند؛ بنابراین وضعیت فیلتر قابل اشتراک،
 * قابل بازگشت با دکمهٔ «برگشت» مرورگر و قابل بوکمارک است.
 */
export function FiltersPanel({
  filters,
  categories,
  matchingAvailable,
  onNavigate,
}: FiltersPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const apply = (patch: Partial<CampaignFilters>) => {
    const qs = toQueryString({ ...filters, ...patch });
    onNavigate?.();
    startTransition(() => router.replace(`${pathname}${qs}`, { scroll: false }));
  };

  const active = hasActiveFilters(filters);

  return (
    <div
      aria-busy={pending}
      className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-60")}
    >
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-line pb-3">
        <span className="text-[0.82rem] font-bold text-ink">صافی‌ها</span>
        {active ? (
          <button
            type="button"
            onClick={() =>
              apply({
                q: "",
                category: "",
                province: "",
                urgency: "",
                status: "active",
                order: "fair",
                matching: false,
              })
            }
            className="inline-flex items-center gap-1 rounded-pill px-2 py-1 text-[0.72rem] font-semibold text-muted transition-colors hover:text-danger"
          >
            <RotateCcw className="size-3" aria-hidden />
            پاک‌کردن
          </button>
        ) : null}
      </div>

      <div className="space-y-6">
        <section>
          <GroupHeading hint={categories.length ? `${categories.length} دسته` : undefined}>
            موضوع
          </GroupHeading>
          <ChipRow
            label="دسته‌بندی موضوعی"
            value={filters.category}
            onChange={(next) => apply({ category: next })}
            options={categories.map((category) => ({
              value: category.slug,
              label: category.title,
            }))}
          />
        </section>

        <section>
          <GroupHeading>استان اجرا</GroupHeading>
          <div className="relative">
            <select
              value={filters.province}
              onChange={(event) => apply({ province: event.target.value })}
              aria-label="فیلتر استان"
              className="w-full appearance-none rounded-xl border border-line bg-surface px-3 py-2.5 pe-9 text-[0.84rem] font-semibold text-ink transition-colors hover:border-brand-soft focus-visible:border-accent"
            >
              <option value="">همهٔ استان‌ها</option>
              {PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute inset-y-0 end-3 my-auto size-4 text-muted"
              aria-hidden
            />
          </div>
        </section>

        <section>
          <GroupHeading>فوریت</GroupHeading>
          <ChipRow
            label="سطح فوریت"
            value={filters.urgency}
            onChange={(next) => apply({ urgency: next })}
            options={URGENCY_VALUES.map((value) => ({ value, label: URGENCY_LABELS[value] }))}
          />
        </section>

        <section>
          <GroupHeading>وضعیت</GroupHeading>
          <ChipRow
            label="وضعیت حرکت"
            value={filters.status}
            onChange={(next) => apply({ status: next || "active" })}
            options={STATUS_VALUES.map((value) => ({ value, label: STATUS_LABELS[value] }))}
          />
        </section>

        {matchingAvailable ? (
          <section>
            <GroupHeading>حامی مضاعف</GroupHeading>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-brand-soft">
              <input
                type="checkbox"
                checked={filters.matching}
                onChange={(event) => apply({ matching: event.target.checked })}
                className="mt-0.5 size-4 shrink-0 accent-[var(--brand)]"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-[0.82rem] font-bold text-ink">
                  <Sparkles className="size-3.5 text-gold" aria-hidden />
                  فقط با سهمِ مضاعف
                </span>
                <span className="mt-0.5 block text-[0.72rem] leading-5 text-muted">
                  حرکت‌هایی که یک حامی، هر سهم تو را چند برابر می‌کند.
                </span>
              </span>
            </label>
          </section>
        ) : null}
      </div>
    </div>
  );
}
