import { ArrowUp, AtSign, Mail, Send, Video } from "lucide-react";
import Link from "next/link";

import { BrandSignatureH } from "@/components/brand/logo";
import { brand } from "@/lib/config/brand";
import { site } from "@/lib/config/site";

const socialIcons = { instagram: AtSign, telegram: Send, aparat: Video } as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-28 overflow-hidden bg-brand-deep text-on-brand">
      {/* هالهٔ کهربایی + شبکهٔ نقطه‌ای، هر دو بی‌تصویر */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(70% 55% at 100% 0%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 62%)",
        }}
      />
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-[0.18]" />

      {/* خط طلایی بالای فوتر */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/60 to-transparent"
      />

      <div className="shell relative">
        {/* ── بخش بالا: امضا + ستون‌های لینک ───────────────────────────── */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.15fr_1.35fr] lg:gap-16 lg:py-16">
          <div className="max-w-md">
            <BrandSignatureH className="h-20 opacity-95" />
            <p className="mt-7 text-[0.95rem] leading-8 text-on-brand/75">
              {site.name} سامانهٔ سهم‌محور {site.organisation} است: هر حرکت خیر به سهم‌های روشن تقسیم
              می‌شود تا مشارکت، ساده، قابل پیگیری و قابل اثبات باشد.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              {brand.socials
                .filter((social) => social.href)
                .map((social) => {
                  const Icon = socialIcons[social.key as keyof typeof socialIcons];
                  return (
                    <Link
                      key={social.key}
                      href={social.href}
                      aria-label={social.label}
                      className="inline-flex size-10 items-center justify-center rounded-pill border border-on-brand/20 text-on-brand/80 transition-colors hover:border-gold/60 hover:text-gold"
                    >
                      <Icon className="size-[1.05rem]" aria-hidden />
                    </Link>
                  );
                })}
              <Link
                href={`mailto:${brand.supportEmail}`}
                className="inline-flex items-center gap-2 rounded-pill border border-on-brand/20 px-4 py-2.5 text-[0.82rem] font-semibold text-on-brand/85 transition-colors hover:border-gold/60 hover:text-gold"
              >
                <Mail className="size-4" aria-hidden />
                <span dir="ltr" className="num">
                  {brand.supportEmail}
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {site.footer.groups.map((group, groupIndex) => (
              <nav
                key={group.title}
                aria-label={group.title}
                className={
                  groupIndex === site.footer.groups.length - 1
                    ? "col-span-2 sm:col-span-1"
                    : undefined
                }
              >
                <h2 className="text-[0.8rem] font-bold tracking-wide text-gold">{group.title}</h2>
                <ul
                  className={
                    groupIndex === site.footer.groups.length - 1
                      ? "mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:block sm:space-y-3"
                      : "mt-4 space-y-3"
                  }
                >
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="group -my-1 inline-flex items-center gap-1.5 py-1 text-[0.88rem] text-on-brand/80 transition-colors hover:text-on-brand"
                      >
                        <span className="h-px w-0 bg-gold transition-all duration-300 ease-out-soft group-hover:w-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* ── نوار میانی: مهر برند + جملهٔ پایانی ───────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-on-brand/12 py-7">
          <p className="max-w-xs text-[0.82rem] leading-6 text-on-brand/75">
            {site.organisation} — نهادی عام‌المنفعه، با مجوز رسمی
            <br className="hidden sm:block" />
            <span className="text-on-brand/65"> {site.promise}</span>
          </p>

          <Link
            href="#main"
            className="inline-flex items-center gap-2 rounded-pill border border-on-brand/20 px-4 py-2.5 text-[0.8rem] font-semibold text-on-brand/75 transition-colors hover:border-gold/60 hover:text-gold"
          >
            <ArrowUp className="size-4" aria-hidden />
            بازگشت به بالا
          </Link>
        </div>

        {/* ── خط پایانی ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-on-brand/12 py-6 text-[0.76rem] text-on-brand/70 sm:flex-row">
          <p>© {brand.legalName} — همهٔ حقوق محفوظ است.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link
              href="/about"
              prefetch={false}
              className="-my-1 inline-flex py-1 transition-colors hover:text-on-brand"
            >
              شرایط استفاده
            </Link>
            <Link
              href="/about#privacy"
              prefetch={false}
              className="-my-1 inline-flex py-1 transition-colors hover:text-on-brand"
            >
              حریم خصوصی
            </Link>
            <span dir="ltr" className="num">
              {brand.domain}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
