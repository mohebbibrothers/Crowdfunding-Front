"use client";

import { ChevronDown } from "lucide-react";
import { Children, useState, type ReactNode } from "react";

import { formatInt } from "@/lib/format/numbers";

/**
 * نمایش پله‌ای فهرست.
 *
 * چرا این‌طور: بک‌اند صفحه‌بندی ندارد و سقف ۱۰۰ مورد برمی‌گرداند. پس به‌جای
 * «صفحهٔ ۲» الکی، همهٔ کارت‌ها در HTML سرور رندر می‌شوند (خوب برای سئو و
 * بدون جاوااسکریپت کامل دیده می‌شوند) و فقط نمایششان پله‌ای است.
 */
export function ShowMore({
  children,
  initial = 9,
  step = 9,
  className,
}: {
  children: ReactNode;
  initial?: number;
  step?: number;
  className?: string;
}) {
  const items = Children.toArray(children);
  const [visible, setVisible] = useState(initial);
  const remaining = items.length - visible;

  return (
    <>
      <div className={className}>
        {items.map((item, index) => (
          <div key={index} hidden={index >= visible} className="min-w-0">
            {item}
          </div>
        ))}
      </div>

      {remaining > 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setVisible((current) => current + step)}
            className="group inline-flex h-12 items-center gap-2 rounded-pill border border-line-strong bg-surface px-6 text-[0.9rem] font-bold text-ink shadow-e1 transition-colors hover:border-brand-soft hover:text-accent"
          >
            نمایش {formatInt(Math.min(step, remaining))} حرکت دیگر
            <ChevronDown
              className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-y-0.5"
              aria-hidden
            />
          </button>
          <p className="num text-[0.74rem] text-muted">
            {formatInt(visible)} از {formatInt(items.length)} حرکت دیده می‌شود
          </p>
        </div>
      ) : null}
    </>
  );
}
