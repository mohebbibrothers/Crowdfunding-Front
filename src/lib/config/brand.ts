/**
 * لایهٔ برند — تنها منبع رنگ‌های معنایی برای کدهای TypeScript.
 * رنگ‌های واقعی در `src/app/globals.css` به‌صورت CSS variable تعریف می‌شوند
 * تا تم روشن/تاریک بدون بارگذاری دوبارهٔ استایل عوض شود.
 */
export const brand = {
  productName: "هم‌سهم",
  legalName: "بنیاد علوی",
  domain: "alavi-fars.ir",
  supportEmail: "info@alavi-fars.ir",
  socials: [
    { key: "instagram", label: "اینستاگرام", href: "#" },
    { key: "telegram", label: "تلگرام", href: "#" },
    { key: "aparat", label: "آپارات", href: "#" },
  ],
} as const;
