"use client";

import { ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLockup } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // قفل اسکرول وقتی منوی موبایل باز است
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open
          ? "glass border-b border-line shadow-e1"
          : "border-b border-transparent bg-paper/60",
      )}
    >
      {/* نوار پیشرفت مطالعه — فقط جایی که scroll-driven animation پشتیبانی شود */}
      <span aria-hidden className="scroll-progress" />

      <a
        href="#main"
        className="sr-only start-4 top-3 focus:not-sr-only focus:absolute focus:z-50 focus:rounded-pill focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand"
      >
        پرش به محتوای اصلی
      </a>

      <div
        className={cn(
          "shell flex items-center justify-between gap-3 transition-[height] duration-500 ease-out-soft",
          scrolled ? "h-16 lg:h-18" : "h-20 lg:h-[5.5rem]",
        )}
      >
        <Link
          href="/"
          aria-label={`${site.organisation} — ${site.name}`}
          className="group shrink-0 rounded-xl transition-transform duration-500 ease-out-soft hover:scale-[1.02]"
        >
          <BrandLockup />
        </Link>

        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-0.5 lg:flex">
          {site.nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={item.href === "/campaigns"}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative rounded-pill px-3.5 py-2 text-[0.9rem] font-semibold transition-colors",
                  active ? "text-accent" : "text-ink-soft hover:text-accent",
                )}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 bottom-1 h-px origin-right bg-gold transition-transform duration-300 ease-out-soft",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/auth/login"
            prefetch={false}
            className="hidden rounded-pill px-3 py-2 text-[0.86rem] font-semibold text-ink-soft transition-colors hover:text-accent sm:inline-flex"
          >
            ورود
          </Link>
          <ButtonLink href="/campaigns" size="sm" className="hidden md:inline-flex">
            سهیم می‌شوم
            <ArrowLeft className="size-3.5" aria-hidden />
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            className="inline-flex size-10 items-center justify-center rounded-pill border border-line text-ink-soft transition-colors hover:border-brand-soft hover:text-accent lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* منوی موبایل — تمام‌قد، با فراخوان پایین */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto border-t border-line bg-paper lg:hidden"
      >
        <nav aria-label="ناوبری موبایل" className="shell flex h-full flex-col py-6">
          <ul className="space-y-1">
            {site.nav.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${index * 45}ms` }}
                  className="flex animate-rise items-center justify-between rounded-2xl px-4 py-4 text-[1.05rem] font-bold text-ink transition-colors hover:bg-brand-tint hover:text-accent"
                >
                  {item.label}
                  <ArrowLeft className="size-4 text-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 pt-6">
            <ButtonLink
              href="/campaigns"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              سهیم می‌شوم
            </ButtonLink>
            <ButtonLink
              href="/auth/login"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              ورود به حساب
            </ButtonLink>
            <p className="pt-2 text-center text-[0.72rem] text-muted">
              {site.organisation} · {site.tagline}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
