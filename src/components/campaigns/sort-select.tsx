"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  ORDER_LABELS,
  ORDER_VALUES,
  toQueryString,
  type CampaignFilters,
} from "@/lib/campaigns/filters";
import type { CampaignOrder } from "@/lib/api/public";

export function SortSelect({ filters }: { filters: CampaignFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const onChange = (order: CampaignOrder) => {
    const qs = toQueryString({ ...filters, order });
    startTransition(() => router.replace(`${pathname}${qs}`, { scroll: false }));
  };

  return (
    <div className="relative min-w-0 flex-1 sm:flex-none">
      <ArrowUpDown
        className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted"
        aria-hidden
      />
      <label htmlFor="campaign-sort" className="sr-only">
        ترتیب نمایش
      </label>
      <select
        id="campaign-sort"
        value={filters.order}
        onChange={(event) => onChange(event.target.value as CampaignOrder)}
        aria-busy={pending}
        className="h-11 w-full appearance-none rounded-pill border border-line bg-surface ps-9 pe-8 text-[0.84rem] font-semibold text-ink transition-colors hover:border-brand-soft focus-visible:border-accent sm:w-auto"
      >
        {ORDER_VALUES.map((value) => (
          <option key={value} value={value}>
            {ORDER_LABELS[value]}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute inset-y-0 end-3 my-auto size-3.5 text-muted"
        aria-hidden
      />
    </div>
  );
}
