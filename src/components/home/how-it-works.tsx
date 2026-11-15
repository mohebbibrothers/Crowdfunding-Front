import { HandCoins, ReceiptText, Share2 } from "lucide-react";

const steps = [
  {
    icon: Share2,
    title: "یک حرکت را انتخاب کن",
    body: "هر حرکت یک نیاز مشخص با مبلغ معیّن است که به سهم‌های کوچک تقسیم شده. سهم‌های باقی‌مانده را همان‌جا می‌بینی.",
  },
  {
    icon: HandCoins,
    title: "تعداد سهم خود را بردار",
    body: "به تعداد دلخواه سهم انتخاب می‌کنی؛ مبلغ نهایی همان لحظه محاسبه می‌شود و سهم‌ها به نام تو رزرو می‌مانند.",
  },
  {
    icon: ReceiptText,
    title: "پرداخت کن و رسید بگیر",
    body: "پرداخت را انجام می‌دهی و رسید رسمی با کد رهگیری می‌گیری؛ بعد هم گزارش پیشرفت حرکت را دنبال می‌کنی.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="shell py-6" aria-labelledby="how-heading">
      <h2
        id="how-heading"
        className="mb-6 text-center text-[0.82rem] font-bold tracking-wide text-muted"
      >
        سه قدم تا مشارکت
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-card border border-line bg-surface p-6 shadow-e1 transition-shadow hover:shadow-e2"
          >
            <span
              aria-hidden
              className="num absolute end-5 top-5 text-[2.6rem] leading-none font-black text-surface-3"
            >
              {["۱", "۲", "۳"][index]}
            </span>
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-tint text-accent">
              <step.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-[1rem] font-bold">{step.title}</h3>
            <p className="mt-2 text-[0.86rem] leading-7 text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
