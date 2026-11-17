"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { toQueryString, type CampaignFilters } from "@/lib/campaigns/filters";

/**
 * جست‌وجوی زنده با تأخیر ۳۵۰ms.
 * چرا تأخیر: هر کاراکتر نباید یک درخواست RSC بفرستد؛ ولی آدرس هم باید
 * بلافاصله به‌روز شود تا نتیجه قابل اشتراک باشد.
 */
export function SearchField({ filters }: { filters: CampaignFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(filters.q);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const committed = useRef(filters.q);

  // اگر آدرس از بیرون عوض شد (پاک‌کردن صافی‌ها، دکمهٔ برگشت)، ورودی هم همگام شود
  useEffect(() => {
    if (filters.q !== committed.current) {
      committed.current = filters.q;
      setValue(filters.q);
    }
  }, [filters.q]);

  const push = (next: string) => {
    committed.current = next;
    const qs = toQueryString({ ...filters, q: next });
    startTransition(() => router.replace(`${pathname}${qs}`, { scroll: false }));
  };

  const onChange = (next: string) => {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => push(next), 350);
  };

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    setValue("");
    push("");
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        push(value);
      }}
      className="relative min-w-0 flex-1"
    >
      <label htmlFor="campaign-search" className="sr-only">
        جست‌وجو در حرکت‌ها
      </label>
      <Search
        className="pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4 text-muted"
        aria-hidden
      />
      <input
        id="campaign-search"
        type="search"
        inputMode="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="نام حرکت یا خیریه را بنویس…"
        autoComplete="off"
        className="h-11 w-full rounded-pill border border-line bg-surface ps-10 pe-10 text-[0.88rem] text-ink transition-colors placeholder:text-muted hover:border-brand-soft focus-visible:border-accent [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={clear}
          aria-label="پاک‌کردن جست‌وجو"
          className="absolute inset-y-0 end-2.5 my-auto grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
      <span aria-live="polite" className="sr-only">
        {pending ? "در حال جست‌وجو" : ""}
      </span>
    </form>
  );
}
