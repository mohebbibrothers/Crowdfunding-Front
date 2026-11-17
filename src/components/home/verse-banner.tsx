import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils/cn";

/**
 * «شمسه» — ستارهٔ هشت‌پرِ گره‌چینی، با دو مربع درهم و حلقه‌های هم‌مرکز.
 * آرام و بی‌پایان می‌چرخد (دورهٔ ۱۲۰ ثانیه) تا لوح زنده بماند، بی‌آنکه
 * چشم را اذیت کند. در حالت «کاهش حرکت» ساکن است.
 */
function Shamse({ className }: { className?: string }) {
  const OUTER =
    "M110 14 L133 54.6 L177.9 42.1 L165.4 87 L206 110 L165.4 133 L177.9 177.9 L133 165.4 L110 206 L87 165.4 L42.1 177.9 L54.6 133 L14 110 L54.6 87 L42.1 42.1 L87 54.6 Z";
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 220"
      className={cn("shamse text-gold-ink", className)}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
    >
      <path
        className="shamse-star"
        d={OUTER}
        fill="currentColor"
        fillOpacity="0.16"
        strokeWidth="1.4"
        strokeOpacity="0.9"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        className="draw"
        pathLength={1}
        cx="110"
        cy="110"
        r="46"
        strokeWidth="1"
        strokeOpacity="0.4"
        vectorEffect="non-scaling-stroke"
        style={{ ["--d" as string]: "320ms" }}
      />
      <circle
        className="draw"
        pathLength={1}
        cx="110"
        cy="110"
        r="26"
        strokeWidth="1"
        strokeOpacity="0.65"
        vectorEffect="non-scaling-stroke"
        style={{ ["--d" as string]: "520ms" }}
      />
      <path d="M110 104 L116 110 L110 116 L104 110 Z" fill="currentColor" stroke="none" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <circle
          key={deg}
          r="1.7"
          cx="110"
          cy="27"
          fill="currentColor"
          stroke="none"
          opacity="0.55"
          transform={`rotate(${deg} 110 110)`}
        />
      ))}
    </svg>
  );
}

/** یک واژهٔ بیت با تأخیرِ خودش. */
function W({
  children,
  d,
  className,
}: {
  children: React.ReactNode;
  d: number;
  className?: string;
}) {
  return (
    <span className={cn("word", className)} style={{ ["--d" as string]: `${d}ms` }}>
      {children}
    </span>
  );
}

/**
 * سرلوحهٔ صفحه — یک بیت از شهریار دربارهٔ خانهٔ حضرت علی (ع) و کرمِ بی‌دریغ.
 *
 * فرم: «لوح» — بیت در ستون گفتار، شمسه در ستون نقش؛ با یک خطِ موییِ طلایی
 * میانشان. هیچ کادری دور متن نیست، پس نه عرضِ متن کش می‌آید و نه ارتفاعِ
 * بی‌محتوا می‌ماند. شمسه آرام می‌چرخد و واژه‌ها یکی‌یکی بالا می‌آیند.
 */
export function VerseBanner() {
  return (
    <section aria-label="سرلوحه" className="relative pt-6 pb-1 sm:pt-8">
      <div className="shell">
        <Reveal
          variant="fade"
          className="relative mx-auto flex max-w-[41rem] flex-col items-center text-center"
        >
          {/* شمسهٔ کوچک بالای لوح، با هالهٔ کهربایی */}
          <div className="relative size-14 shrink-0 sm:size-[4.25rem]">
            <span
              aria-hidden
              className="absolute inset-0 -z-10 scale-[2.1] rounded-full opacity-70 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--gold) 30%, transparent), transparent 66%)",
              }}
            />
            <Shamse className="size-full" />
          </div>

          <p className="mt-5 flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-0.5 text-[1.02rem] leading-[2.1] font-semibold text-ink sm:text-[1.18rem]">
            <span className="inline-block">
              <W d={180}>برو</W> <W d={230}>ای</W> <W d={280}>گدای</W> <W d={330}>مسکین،</W>{" "}
              <W d={380}>درِ</W> <W d={430}>خانهٔ</W>{" "}
              <span className="word relative" style={{ ["--d" as string]: "480ms" }}>
                <span className="relative z-10 font-extrabold text-accent">علی</span>
                <svg
                  aria-hidden
                  viewBox="0 0 60 8"
                  preserveAspectRatio="none"
                  className="absolute inset-x-0 -bottom-1 h-1.5 w-full text-gold"
                >
                  <path
                    className="draw"
                    pathLength={1}
                    d="M1 6c12-3 30-4 58-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    style={{ ["--d" as string]: "880ms" }}
                  />
                </svg>
              </span>{" "}
              <W d={530}>زن</W>
            </span>

            <span aria-hidden className="hidden text-gold/70 sm:inline">
              ❖
            </span>
            <br className="sm:hidden" />

            <span className="inline-block">
              <W d={600}>که</W> <W d={650}>نگینِ</W> <W d={700}>پادشاهی</W> <W d={750}>دهد</W>{" "}
              <W d={800}>از</W> <W d={850}>کرم،</W> <W d={900}>گدا</W> <W d={950}>را</W>
            </span>
          </p>

          <p className="mt-3.5 flex items-center justify-center gap-2.5 text-[0.7rem] font-bold tracking-wide text-muted">
            <span aria-hidden className="h-px w-5 bg-gold/60" />
            شهریار
            <span aria-hidden className="h-px w-5 bg-gold/60" />
          </p>

          <p className="mt-2.5 text-[0.8rem] text-muted">
            هم‌سهم، سهمِ کوچکی از همان <span className="font-bold text-accent">خانهٔ کرم</span> است.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
