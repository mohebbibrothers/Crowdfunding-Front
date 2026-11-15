import { Fingerprint, GitCompareArrows, Lock } from "lucide-react";

import { SectionHeading } from "@/components/home/section-heading";

const pillars = [
  {
    icon: Lock,
    title: "دفتر کل دوطرفه",
    body: "هر ریال دریافتی، در حسابداری دوطرفه با سند متوازن ثبت می‌شود؛ پول بدون سند جابه‌جا نمی‌شود.",
  },
  {
    icon: Fingerprint,
    title: "اثبات رمزنگاری",
    body: "هر مشارکت با هش ناشناس در درخت مرکل ثبت می‌شود و می‌توانی اثبات ریاضی سهمت را دریافت کنی.",
  },
  {
    icon: GitCompareArrows,
    title: "مغایرت‌گیری با بانک",
    body: "صورت‌حساب تسویهٔ درگاه با سندهای داخلی تطبیق داده می‌شود؛ اختلاف، علامت‌دار و پیگیری می‌شود.",
  },
] as const;

export function TransparencyBand() {
  return (
    <section className="shell py-16">
      <SectionHeading
        eyebrow="چرا می‌توانی اعتماد کنی"
        title="شفافیت، این‌جا یک شعار نیست؛ یک سازوکار است"
        description="در سامانه‌های خیریه، سؤال همیشگی همین است: «از کجا بدانم پول من همان‌جا خرج شد؟» هم‌سهم به‌جای قول دادن، سه سازوکار فنی می‌گذارد کنار دست تو."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-card border border-line bg-surface p-6">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gold-tint text-gold">
              <pillar.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-[1rem] font-bold">{pillar.title}</h3>
            <p className="mt-2 text-[0.86rem] leading-7 text-muted">{pillar.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
