import { HandCoins, ReceiptText, Share2 } from "lucide-react";

import { SectionHeading } from "@/components/home/section-heading";

const steps = [
  {
    icon: Share2,
    title: "حرکت را انتخاب کن",
    body: "هر حرکت یک نیاز روشن با مبلغ مشخص است و به سهم‌های کوچک تقسیم شده؛ سهم‌های باقی‌مانده را همان لحظه می‌بینی.",
  },
  {
    icon: HandCoins,
    title: "سهم‌هایت را بردار",
    body: "به تعداد دلخواه سهم انتخاب می‌کنی، مبلغ همان لحظه حساب می‌شود و سهم‌ها پانزده دقیقه برایت رزرو می‌مانند.",
  },
  {
    icon: ReceiptText,
    title: "پرداخت کن و رسید بگیر",
    body: "پرداخت می‌کنی، رسید رسمی با کد رهگیری می‌گیری و پیشرفت حرکت را تا رسیدن به نتیجه دنبال می‌کنی.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-28 bg-paper-2 py-20 lg:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="چطور کار می‌کند"
          title="سه قدم تا یک کار خیر"
          description="مشارکت در هم‌سهم از یک کلیک کوتاه‌تر نیست؛ نه فرم کاغذی، نه تأیید دستی، نه انتظار."
        />

        <ol className="relative mt-12 grid gap-6 md:grid-cols-3 md:gap-5">
          {/* خط اتصال پشت مراحل — فقط دسکتاپ */}
          <span
            aria-hidden
            className="absolute inset-x-[16%] top-11 hidden h-px bg-[repeating-linear-gradient(90deg,var(--line-strong)_0_6px,transparent_6px_12px)] md:block"
          />

          {steps.map((step, index) => (
            <li key={step.title} className="reveal relative">
              <div className="card card-lift relative h-full bg-surface p-6 pt-7 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="relative inline-flex size-11 items-center justify-center rounded-2xl bg-brand text-on-brand shadow-e1">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <span
                    aria-hidden
                    className="num text-[2.4rem] leading-none font-black text-surface-3"
                  >
                    {["۰۱", "۰۲", "۰۳"][index]}
                  </span>
                </div>
                <h3 className="mt-5 text-[1.05rem] font-bold text-ink">{step.title}</h3>
                <p className="mt-2.5 text-[0.88rem] leading-7 text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-[0.82rem] text-muted">
          بین این سه قدم، هیچ واسطه و هیچ مرحلهٔ پنهانی نیست.
        </p>
      </div>
    </section>
  );
}
