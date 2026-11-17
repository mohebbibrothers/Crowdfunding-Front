import { cn } from "@/lib/utils/cn";

/** نقشِ سرلوحه — یک آرایهٔ متقارن ساده، بدون تصویر. */
function Ornament({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 16"
      className={cn("h-4 w-28 text-gold", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M1 8h34" strokeLinecap="round" opacity="0.5" />
      <path d="M85 8h34" strokeLinecap="round" opacity="0.5" />
      <path d="M60 2.5 66 8l-6 5.5L54 8z" />
      <path d="M45 8c4-5 9-5 12 0-3 5-8 5-12 0Z" opacity="0.65" />
      <path d="M75 8c-4-5-9-5-12 0 3 5 8 5 12 0Z" opacity="0.65" />
      <circle cx="60" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * سرلوحهٔ صفحه — یک بیت از شهریار دربارهٔ خانهٔ حضرت علی (ع) و کرمِ بی‌دریغ.
 * هدف: دادنِ جان و نیت به صفحه، نه افزودن محتوا. عمداً کوتاه است:
 * یک نقش، یک بیت، یک امضا، یک پل به نامِ سامانه.
 */
export function VerseBanner() {
  return (
    <section aria-label="سرلوحه" className="relative overflow-hidden bg-brand-deep text-on-brand">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-20" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-40"
        style={{
          background:
            "radial-gradient(52% 120% at 50% 0%, color-mix(in oklab, var(--gold) 30%, transparent), transparent 72%)",
        }}
      />

      <div className="shell relative flex flex-col items-center py-8 text-center sm:py-9">
        <Ornament />

        <blockquote className="mt-5 max-w-2xl text-[1.05rem] leading-[2.15] font-medium text-on-brand sm:text-[1.2rem]">
          برو ای گدای مسکین، درِ خانهٔ علی زن
          <br className="sm:hidden" />
          <span aria-hidden className="mx-3 hidden text-gold/60 sm:inline">
            ❖
          </span>
          که نگینِ پادشاهی دهد از کرم، گدا را
        </blockquote>

        <p className="mt-4 flex items-center gap-2 text-[0.72rem] font-bold tracking-wide text-on-brand/70">
          <span aria-hidden className="h-px w-5 bg-gold/80" />
          شهریار
        </p>

        <p className="mt-5 text-[0.82rem] text-muted">
          هم‌سهم، سهمِ کوچکی از همان <span className="font-bold text-accent">خانهٔ کرم</span> است.
        </p>
      </div>
    </section>
  );
}
