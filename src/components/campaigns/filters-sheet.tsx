"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { FiltersPanel } from "@/components/campaigns/filters-panel";
import { activeFilterKeys, type CampaignFilters } from "@/lib/campaigns/filters";
import type { CategoryItem } from "@/lib/api/schemas";
import { formatInt } from "@/lib/format/numbers";

/**
 * شیت صافی‌ها در موبایل.
 * از `<dialog>` بومی استفاده می‌کنیم تا قفل فوکوس، بستن با Esc و لایهٔ
 * پشتی (backdrop) را از خود مرورگر بگیریم — بدون کتابخانهٔ اضافه.
 * شیت بعد از هر انتخاب باز می‌ماند تا کاربر چند صافی را پشت‌سرهم بزند و
 * شمارندهٔ پایین، زندهٔ نتیجه را نشان دهد.
 */
export function FiltersSheet({
  filters,
  categories,
  matchingAvailable,
  count,
}: {
  filters: CampaignFilters;
  categories: CategoryItem[];
  matchingAvailable: boolean;
  count: number;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [open, setOpen] = useState(false);
  const activeCount = activeFilterKeys(filters).length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-pill border border-line bg-surface px-4 text-[0.84rem] font-semibold text-ink transition-colors hover:border-brand-soft lg:hidden"
        aria-haspopup="dialog"
      >
        <SlidersHorizontal className="size-4 text-accent" aria-hidden />
        صافی‌ها
        {activeCount > 0 ? (
          <span className="num grid size-5 place-items-center rounded-full bg-brand text-[0.66rem] font-bold text-on-brand">
            {formatInt(activeCount)}
          </span>
        ) : null}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="filters-sheet-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // کلیک روی لایهٔ پشتی (نه محتوای شیت) → بستن
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="m-0 max-h-[88dvh] w-full max-w-none self-end rounded-t-[1.75rem] border-0 bg-paper p-0 text-ink backdrop:bg-ink/45 backdrop:backdrop-blur-sm sm:mx-auto sm:mb-0 sm:max-w-md sm:rounded-[1.75rem] [&::backdrop]:transition-opacity"
        style={{ marginTop: "auto" }}
      >
        <div className="flex max-h-[88dvh] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 id="filters-sheet-title" className="text-[0.95rem] font-bold">
              صافی‌های فهرست
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن صافی‌ها"
              className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-brand-soft hover:text-accent"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <FiltersPanel
              filters={filters}
              categories={categories}
              matchingAvailable={matchingAvailable}
            />
          </div>

          <div className="border-t border-line p-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-12 w-full rounded-pill bg-brand text-[0.92rem] font-bold text-on-brand transition-colors hover:bg-brand-soft"
            >
              نمایش {formatInt(count)} حرکت
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
