"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[border-color,background-color,box-shadow] duration-300",
        scrolled ? "glass border-line shadow-e1" : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only start-4 top-3 focus:not-sr-only focus:absolute focus:z-50 focus:rounded-pill focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        پرش به محتوای اصلی
      </a>

      <div className="shell flex h-18 items-center justify-between gap-4">
        <Link href="/" aria-label={site.name} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-pill px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
                  active ? "text-accent" : "text-ink-soft hover:text-accent",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-pill bg-gold-soft" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/campaigns"
            aria-label="جست‌وجوی حرکت‌ها"
            className="hidden size-10 items-center justify-center rounded-pill border border-line text-ink-soft transition-colors hover:border-brand-soft hover:text-accent sm:inline-flex"
          >
            <Search className="size-[1.05rem]" aria-hidden />
          </Link>
          <ThemeToggle />
          <ButtonLink
            href="/auth/login"
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            ورود
          </ButtonLink>
          <ButtonLink href="/campaigns" size="sm" className="hidden md:inline-flex">
            مشارکت در حرکت‌ها
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            className="inline-flex size-10 items-center justify-center rounded-pill border border-line text-ink-soft lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-surface lg:hidden">
        <nav aria-label="ناوبری موبایل" className="shell flex flex-col gap-1 py-4">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-[0.95rem] font-medium text-ink-soft hover:bg-brand-tint hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            <ButtonLink
              href="/auth/login"
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              ورود
            </ButtonLink>
            <ButtonLink
              href="/campaigns"
              size="sm"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              مشارکت
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
