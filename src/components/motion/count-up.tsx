"use client";

import { useEffect, useRef } from "react";

import { formatInt } from "@/lib/format/numbers";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * شمارندهٔ نرم — عدد از صفر تا مقدار نهایی بالا می‌رود، فقط وقتی در دید است.
 * در HTML اولیه مقدار نهایی چاپ می‌شود (برای موتور جست‌وجو و بدون‌جاوااسکریپت)
 * و پیش از نخستین رنگ‌آمیزی به صفر برمی‌گردد تا هیچ پرشی دیده نشود.
 */
export function CountUp({
  value,
  duration = 1200,
  delay = 0,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.dataset.motion !== "on") return;
    if (value <= 0) return;

    let frame = 0;
    let started = false;

    const run = () => {
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = formatInt(Math.round(value * easeOut(t))) + suffix;
        if (t < 1) frame = requestAnimationFrame(tick);
        else el.textContent = formatInt(value) + suffix;
      };
      frame = requestAnimationFrame(tick);
    };

    el.textContent = formatInt(0) + suffix;
    const timer = setTimeout(run, delay);

    return () => {
      clearTimeout(timer);
      if (started) cancelAnimationFrame(frame);
    };
  }, [value, duration, delay, suffix]);

  return (
    <span ref={ref} className={className}>
      {formatInt(value)}
      {suffix}
    </span>
  );
}
