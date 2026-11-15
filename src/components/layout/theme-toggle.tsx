"use client";

import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "cf-theme";

/**
 * تغییر پوسته بدون any state: وضعیت واقعی روی <html> است (اسکریپت bootstrap در
 * layout آن را پیش از رنگ‌آمیزی اول اعمال می‌کند). پس نه پرشِ hydration داریم و
 * نه رندر آبشاری.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* حالت خصوصی مرورگر — بی‌صدا رد می‌شویم */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="تغییر پوستهٔ روشن و تاریک"
      title="تغییر پوستهٔ روشن و تاریک"
      aria-live="polite"
      className="inline-flex size-10 items-center justify-center rounded-pill border border-line text-ink-soft transition-colors hover:border-brand-soft hover:text-accent"
    >
      <Sun className="size-[1.05rem] dark:hidden" aria-hidden />
      <Moon className="hidden size-[1.05rem] dark:block" aria-hidden />
    </button>
  );
}
