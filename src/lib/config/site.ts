/**
 * هویت سایت — تنها جایی که نام، شعار و ناوبری تعریف می‌شود.
 * تغییر برند (نام/لوگو) یک تغییر در همین فایل است، نه بازنویسی کامپوننت‌ها.
 */
export const site = {
  name: "هم‌سهم",
  nameFull: "هم‌سهم | سکوی جمع‌سپاری خیرخواهانه",
  tagline: "هر سهم، یک قدم",
  description:
    "هم‌سهم سکوی جمع‌سپاری حرکت‌های خیرخواهانه است؛ جایی که هر حرکت به سهم‌های کوچک تقسیم می‌شود تا هر کس با هر توان مالی در یک کار خیر سهیم شود.",
  organisation: "بنیاد علوی",
  locale: "fa_IR",
  dir: "rtl" as const,
  nav: [
    { href: "/campaigns", label: "حرکت‌ها" },
    { href: "/charities", label: "خیریه‌ها" },
    { href: "/jars", label: "قلک‌ها" },
    { href: "/transparency", label: "شفافیت" },
    { href: "/about", label: "دربارهٔ ما" },
  ],
  footer: {
    groups: [
      {
        title: "مشارکت",
        links: [
          { href: "/campaigns", label: "همهٔ حرکت‌ها" },
          { href: "/campaigns?urgency=emergency", label: "حرکت‌های فوری" },
          { href: "/jars", label: "قلک‌های خیریه" },
          { href: "/receipts", label: "استعلام رسید" },
        ],
      },
      {
        title: "اعتماد",
        links: [
          { href: "/transparency", label: "دیوار شفافیت" },
          { href: "/charities", label: "خیریه‌های تأییدشده" },
          { href: "/about#governance", label: "سازوکار نظارت" },
          { href: "/about#faq", label: "پرسش‌های پرتکرار" },
        ],
      },
      {
        title: "همراهی",
        links: [
          { href: "/ambassador", label: "سفیران خیر" },
          { href: "/pledges", label: "کمک مستمر" },
          { href: "/about#contact", label: "تماس با ما" },
          { href: "/about#report", label: "گزارش تخلف" },
        ],
      },
    ],
  },
} as const;
