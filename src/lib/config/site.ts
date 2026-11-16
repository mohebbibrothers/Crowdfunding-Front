/**
 * هویت سایت — تنها جایی که نام، شعار و ناوبری تعریف می‌شود.
 * تغییر برند (نام/لوگو) یک تغییر در همین فایل است، نه بازنویسی کامپوننت‌ها.
 */
export const site = {
  name: "هم‌سهم",
  nameFull: "هم‌سهم | سامانهٔ سهم‌محور بنیاد علوی",
  tagline: "هر سهم، یک قدم",
  promise: "کار خیر، سهم‌سهم می‌شود",
  description:
    "هم‌سهم، سامانهٔ سهم‌محور بنیاد علوی است؛ هر حرکت خیر به سهم‌های روشن و کوچک تقسیم می‌شود تا با هر توان مالی بتوانی در آن سهیم شوی و رسید رسمی بگیری.",
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
  /** سه دلیلِ کوتاه که در هیرو کنار دکمه‌ها می‌نشیند. */
  assurances: [
    { title: "خیریهٔ تأییدشده", detail: "هر حرکت از نهاد دارای مجوز" },
    { title: "رسید رسمی", detail: "با کد رهگیری و گواهی شفافیت" },
    { title: "اثبات رمزنگاری", detail: "سهم تو قابل راستی‌آزمایی است" },
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
          { href: "/about#report", label: "گزارش تخلف" },
        ],
      },
      {
        title: "همراهی",
        links: [
          { href: "/ambassador", label: "سفیران خیر" },
          { href: "/pledges", label: "کمک مستمر" },
          { href: "/about#faq", label: "پرسش‌های پرتکرار" },
          { href: "/about#contact", label: "تماس با ما" },
        ],
      },
    ],
  },
} as const;
