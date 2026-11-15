import { ArrowRight, Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { site } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-brand-tint text-accent">
        <Compass className="size-7" aria-hidden />
      </span>

      <p className="num mt-6 text-[0.8rem] font-bold tracking-[0.3em] text-gold">۴۰۴</p>
      <h1 className="display-2 mt-3">این صفحه پیدا نشد</h1>
      <p className="lead mt-4 max-w-md">
        ممکن است نشانی تغییر کرده باشد یا این بخش هنوز منتشر نشده باشد. از خانه شروع کن؛ همهٔ
        حرکت‌های در جریان همان‌جا هستند.
      </p>

      <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          بازگشت به خانه
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
        <ButtonLink href="/campaigns" variant="secondary" size="lg">
          دیدن حرکت‌ها
        </ButtonLink>
      </div>

      <nav aria-label="پیوندهای پیشنهادی" className="mt-12">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.85rem] text-muted">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="transition-colors hover:text-accent">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
