import { ArrowUp, AtSign, Mail, Send, Video } from "lucide-react";
import Link from "next/link";

import { BrandSignatureH } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { brand } from "@/lib/config/brand";
import { site } from "@/lib/config/site";

const socialIcons = { instagram: AtSign, telegram: Send, aparat: Video } as const;

export function SiteFooter() {
  return (
    <footer className="inv-surface relative mt-24 overflow-hidden border-t inv-rule">
      {/* شست‌وشوی نور + شبکهٔ نقطه‌ای — هر دو از پالتِ تم */}
      <div aria-hidden className="inv-veil pointer-events-none absolute inset-0" />
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-[0.16]" />

      {/* خط طلاییِ بالای فوتر */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/45 to-transparent"
      />

      <div className="shell relative">
        {/* ── بخش بالا: امضا + ستون‌های لینک ───────────────────────────── */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.15fr_1.35fr] lg:gap-16 lg:py-16">
          <Reveal variant="up" className="max-w-md">
            <BrandSignatureH className="h-20 opacity-95" />
            <p className="inv-soft mt-7 text-[0.95rem] leading-8">
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
                      className="inv-pill inline-flex size-10 items-center justify-center rounded-pill"
                    >
                      <Icon className="size-[1.05rem]" aria-hidden />
                    </Link>
                  );
                })}
              <Link
                href={`mailto:${brand.supportEmail}`}
                className="inv-pill inline-flex items-center gap-2 rounded-pill px-4 py-2.5 text-[0.82rem] font-semibold"
              >
                <Mail className="size-4" aria-hidden />
                <span dir="ltr" className="num">
                  {brand.supportEmail}
                </span>
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {site.footer.groups.map((group, groupIndex) => (
              <Reveal
                as="nav"
                key={group.title}
                variant="up"
                delay={groupIndex * 110}
                aria-label={group.title}
                className={
                  groupIndex === site.footer.groups.length - 1
                    ? "col-span-2 sm:col-span-1"
                    : undefined
                }
              >
                <h2 className="inv-gold text-[0.8rem] font-bold tracking-wide">{group.title}</h2>
                <ul
                  className={
                    groupIndex === site.footer.groups.length - 1
                      ? "mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:block sm:space-y-3"
                      : "mt-4 space-y-3"
                  }
                >
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="inv-link group -my-1 inline-flex items-center gap-1.5 py-1 text-[0.88rem]"
                      >
                        <span className="h-px w-0 bg-gold transition-all duration-300 ease-out-soft group-hover:w-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── نوار میانی: جملهٔ پایانی + بازگشت به بالا ─────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-t inv-rule py-7">
          <p className="inv-soft max-w-xs text-[0.82rem] leading-6">
            {site.organisation} — نهادی عام‌المنفعه، با مجوز رسمی
            <br className="hidden sm:block" />
            <span className="inv-muted"> {site.promise}</span>
          </p>

          <Link
            href="#main"
            className="inv-pill inline-flex items-center gap-2 rounded-pill px-4 py-2.5 text-[0.8rem] font-semibold"
          >
            <ArrowUp className="size-4" aria-hidden />
            بازگشت به بالا
          </Link>
        </div>

        {/* ── خط پایانی ─────────────────────────────────────────────────── */}
        <div className="inv-muted flex flex-col items-center justify-between gap-3 border-t inv-rule py-6 text-[0.76rem] sm:flex-row">
          <p>© {brand.legalName} — همهٔ حقوق محفوظ است.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link
              href="/about"
              prefetch={false}
              className="inv-link -my-1 inline-flex py-1"
            >
              شرایط استفاده
            </Link>
            <Link
              href="/about#privacy"
              prefetch={false}
              className="inv-link -my-1 inline-flex py-1"
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
