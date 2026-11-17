import { X } from "lucide-react";
import Link from "next/link";

import {
  ORDER_LABELS,
  STATUS_LABELS,
  URGENCY_LABELS,
  withFilter,
  type CampaignFilters,
} from "@/lib/campaigns/filters";

/**
 * چیپ‌های «صافی فعال» — لینک‌های سادهٔ سروری، بدون جاوااسکریپت.
 * هر چیپ فقط همان یک صافی را برمی‌دارد و بقیه را نگه می‌دارد.
 */
export function ActiveFilters({
  filters,
  categories,
}: {
  filters: CampaignFilters;
  categories: Array<{ slug: string; title: string }>;
}) {
  const chips: Array<{ key: string; label: string; value: string; href: string }> = [];

  if (filters.q) {
    chips.push({
      key: "q",
      label: "جست‌وجو",
      value: filters.q,
      href: withFilter(filters, { q: "" }),
    });
  }
  if (filters.category) {
    const category = categories.find((item) => item.slug === filters.category);
    chips.push({
      key: "category",
      label: "موضوع",
      value: category?.title ?? filters.category,
      href: withFilter(filters, { category: "" }),
    });
  }
  if (filters.province) {
    chips.push({
      key: "province",
      label: "استان",
      value: filters.province,
      href: withFilter(filters, { province: "" }),
    });
  }
  if (filters.urgency) {
    chips.push({
      key: "urgency",
      label: "فوریت",
      value: URGENCY_LABELS[filters.urgency],
      href: withFilter(filters, { urgency: "" }),
    });
  }
  if (filters.status !== "active") {
    chips.push({
      key: "status",
      label: "وضعیت",
      value: STATUS_LABELS[filters.status],
      href: withFilter(filters, { status: "active" }),
    });
  }
  if (filters.order !== "fair") {
    chips.push({
      key: "order",
      label: "ترتیب",
      value: ORDER_LABELS[filters.order],
      href: withFilter(filters, { order: "fair" }),
    });
  }
  if (filters.matching) {
    chips.push({
      key: "matching",
      label: "",
      value: "با حامی مضاعف",
      href: withFilter(filters, { matching: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="صافی‌های فعال">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Link
            href={chip.href}
            scroll={false}
            className="group inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface-2 py-1 ps-3 pe-2 text-[0.76rem] font-semibold text-ink-soft transition-colors hover:border-danger/40 hover:text-danger"
          >
            {chip.label ? <span className="text-muted">{chip.label}:</span> : null}
            <span className="max-w-[12rem] truncate">{chip.value}</span>
            <X
              className="size-3 text-muted transition-colors group-hover:text-danger"
              aria-hidden
            />
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/campaigns"
          scroll={false}
          className="rounded-pill px-2 py-1 text-[0.76rem] font-bold text-accent transition-colors hover:text-brand-soft"
        >
          پاک‌کردن همه
        </Link>
      </li>
    </ul>
  );
}
