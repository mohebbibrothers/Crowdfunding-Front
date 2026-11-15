import { ArrowLeft } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="shell py-16">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-brand px-6 py-14 text-center text-on-brand sm:px-12">
        <div aria-hidden className="ornament-grid absolute inset-0 opacity-25" />
        <div
          aria-hidden
          className="absolute start-1/2 -top-24 size-[26rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(217,179,86,0.35), transparent 65%)" }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="display-2 text-on-brand">امروز یک سهم بردار، فردا یک زندگی</h2>
          <p className="mx-auto mt-5 max-w-xl text-[0.98rem] leading-8 text-on-brand/85">
            لازم نیست مبلغ بزرگی کنار بگذاری. همین که یک سهم برداری، حرکت یک قدم جلو می‌رود و کسی که
            منتظر است، یک روز زودتر به نتیجه می‌رسد.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/campaigns" variant="gold" size="lg">
              حرکت‌ها را ببین
              <ArrowLeft className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/about"
              size="lg"
              variant="secondary"
              className="border-on-brand/25 bg-on-brand/10 text-on-brand hover:border-on-brand/50 hover:text-on-brand"
            >
              پرسش‌های پرتکرار
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
