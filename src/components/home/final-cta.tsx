import { ArrowLeft, ShieldCheck } from "lucide-react";

import { BrandSignatureV } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { ButtonLink } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="pb-4">
      <div className="shell">
        <div className="arch-motif relative isolate overflow-hidden rounded-[2.25rem] bg-brand-deep px-6 py-16 text-center text-on-brand sm:px-12 lg:py-20">
          {/* هالهٔ کهربایی + شبکهٔ نقطه‌ای */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(58% 62% at 50% 8%, color-mix(in oklab, var(--gold) 26%, transparent), transparent 68%)",
            }}
          />
          <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-20" />
          <Reveal
            variant="fade"
            className="pointer-events-none absolute start-8 top-1/2 hidden -translate-y-1/2 lg:block"
          >
            <BrandSignatureV className="signature-wipe h-40 opacity-[0.12]" />
          </Reveal>

          <Reveal variant="fade" className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-pill border border-on-brand/25 px-3.5 py-1.5 text-[0.72rem] font-bold text-on-brand/80">
              <ShieldCheck className="size-3.5 text-gold" aria-hidden />
              پرداخت در درگاه رسمی، همراه با رسید
            </span>

            <h2 className="display-2 mt-6 text-on-brand">
              <Words text="امروز یک سهم بردار، فردا یک زندگی" delay={80} step={70} />
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.97rem] leading-8 text-on-brand/80">
              لازم نیست مبلغ بزرگی کنار بگذاری. همین که یک سهم برداری، حرکت یک قدم جلو می‌رود و کسی
              که منتظر است، یک روز زودتر به نتیجه می‌رسد.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/campaigns" prefetch={false} variant="gold" size="lg">
                سهیم می‌شوم
                <ArrowLeft className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/about#faq"
                prefetch={false}
                size="lg"
                variant="secondary"
                className="border-on-brand/25 bg-on-brand/10 text-on-brand hover:border-on-brand/50 hover:text-on-brand"
              >
                پرسش‌های پرتکرار
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
