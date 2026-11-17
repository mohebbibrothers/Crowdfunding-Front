import { ArrowLeft, ShieldCheck } from "lucide-react";

import { BrandSignatureV } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { Words } from "@/components/motion/words";
import { ButtonLink } from "@/components/ui/button";

/**
 * پنل پایانی — همان زبانِ بصریِ فوتر، ولی با فاصلهٔ روشن‌تر از کاغذ.
 * رنگ‌ها از نشانه‌های «سطح معکوس» می‌آیند تا در تم روز کاغذِ سبزآهنگ و در
 * تم شب زمردِ عمیق باشد؛ دیگر یک جزیرهٔ سبزِ ثابت نیست.
 */
export function FinalCta() {
  return (
    <section className="pb-4">
      <div className="shell">
        <div className="inv-surface arch-motif inv-rule relative isolate overflow-hidden rounded-[2.25rem] border px-6 py-16 text-center sm:px-12 lg:py-20">
          {/* شست‌وشوی نور کهربایی + شبکهٔ نقطه‌ای */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(52% 50% at 50% 0%, var(--inv-glow), transparent 64%), linear-gradient(180deg, var(--inv-wash) 0%, transparent 46%)",
            }}
          />
          <div
            aria-hidden
            className="dot-grid pointer-events-none absolute inset-0 opacity-[0.14]"
          />

          <Reveal
            variant="fade"
            className="pointer-events-none absolute start-8 top-1/2 hidden -translate-y-1/2 lg:block"
          >
            <BrandSignatureV className="signature-wipe h-40 opacity-[0.14]" />
          </Reveal>

          <Reveal variant="fade" className="relative mx-auto max-w-2xl">
            <span className="inv-pill inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-[0.72rem] font-bold">
              <ShieldCheck className="size-3.5 text-gold" aria-hidden />
              پرداخت در درگاه رسمی، همراه با رسید
            </span>

            <h2 className="display-2 mt-6">
              <Words text="امروز یک سهم بردار، فردا یک زندگی" delay={80} step={70} />
            </h2>
            <p className="inv-soft mx-auto mt-5 max-w-xl text-[0.97rem] leading-8">
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
                className="inv-pill border bg-transparent shadow-none hover:text-[color:var(--inv-gold)]"
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
