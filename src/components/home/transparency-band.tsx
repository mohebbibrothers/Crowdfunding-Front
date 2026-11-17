import { ArrowLeft, Fingerprint, GitCompareArrows, Lock } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/home/section-heading";

const pillars = [
  {
    icon: Lock,
    title: "دفتر کل دوطرفه",
    body: "هر ریال دریافتی با سند متوازن ثبت می‌شود؛ پول بی‌سند جابه‌جا نمی‌شود.",
  },
  {
    icon: Fingerprint,
    title: "اثبات رمزنگاری",
    body: "هر مشارکت با هش ناشناس در درخت مرکل می‌نشیند و اثبات ریاضی سهمت را می‌گیری.",
  },
  {
    icon: GitCompareArrows,
    title: "مغایرت‌گیری با بانک",
    body: "تسویهٔ درگاه با سندهای داخلی تطبیق داده می‌شود؛ هر اختلاف علامت‌دار و پیگیری می‌شود.",
  },
] as const;

export function TransparencyBand() {
  return (
    <section className="py-20 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="چرا می‌توانی اعتماد کنی"
          title="شفافیت این‌جا سازوکار است، نه شعار"
          description="پرسش همیشگی خیرها همین است: «از کجا بدانم سهم من همان‌جا خرج شد؟» هم‌سهم به‌جای قول دادن، سه سازوکار فنی می‌گذارد کنارت."
          actionPlacement="below"
          action={
            <Link
              href="/transparency"
              prefetch={false}
              className="inline-flex items-center gap-1.5 py-1 text-[0.86rem] font-bold text-accent transition-colors hover:text-brand-soft"
            >
              دیوار شفافیت
              <ArrowLeft className="size-3.5" aria-hidden />
            </Link>
          }
        />

        <div className="panel reveal mt-10 grid overflow-hidden md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={
                index < pillars.length - 1
                  ? "border-b border-line p-7 md:border-e md:border-b-0 md:last:border-e-0 lg:p-8"
                  : "p-7 lg:p-8"
              }
            >
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gold-tint text-gold-ink">
                <pillar.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-[1rem] font-bold text-ink">{pillar.title}</h3>
              <p className="mt-2 text-[0.87rem] leading-7 text-muted">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
