"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * یک ناظر مشترک برای کل صفحه — به‌جای یک IntersectionObserver برای هر عنصر.
 * هر عنصر فقط یک بار (هنگام ورود) علامت می‌خورد و از ناظر خارج می‌شود.
 */
type Show = () => void;

let observer: IntersectionObserver | null = null;
const handlers = new WeakMap<Element, Show>();

function sharedObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        handlers.get(entry.target)?.();
        handlers.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    // حاشیهٔ بالایی بزرگ: هر عنصری که از دید خارج شده («بالاتر از قاب») هم
    // باید آشکار شود؛ وگرنه با پرشِ سریع یا لنگرِ میان‌صفحه، محتوایی نامرئی
    // می‌ماند. فقط عناصرِ پایین‌تر از قاب منتظر می‌مانند.
    { rootMargin: "100000px 0px 0px 0px", threshold: 0.01 },
  );
  return observer;
}

export type RevealVariant = "up" | "fade" | "scale" | "start" | "end";

/**
 * ورود نرم عنصر هنگام رسیدن به دید.
 * بدون جاوااسکریپت یا با «کاهش حرکت» هیچ‌چیز پنهان نمی‌شود: مخفی‌سازی فقط
 * وقتی اعمال می‌شود که اسکریپت درون‌خطیِ layout، `data-motion="on"` را
 * روی `html` گذاشته باشد.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: RevealVariant;
  /** تأخیر شروع، میلی‌ثانیه — برای ساخت موج در شبکه‌ها */
  delay?: number;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.dataset.motion !== "on") return;

    // اگر از همان اول در دید است، بدون معطلی نشان بده (بدون پرش)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.dataset.in = "";
      return;
    }

    const obs = sharedObserver();
    const show: Show = () => {
      el.dataset.in = "";
    };
    handlers.set(el, show);
    obs.observe(el);
    return () => {
      handlers.delete(el);
      obs.unobserve(el);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
