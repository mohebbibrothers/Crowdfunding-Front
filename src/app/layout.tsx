import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PointerGlow } from "@/components/motion/pointer-glow";
import { env } from "@/lib/config/env";
import { site } from "@/lib/config/site";

import "./globals.css";

const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Tahoma", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: site.nameFull,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["کرادفاندینگ", "خیریه", "حرکت خیرخواهانه", "سهم", "کمک مردمی", "هم‌سهم"],
  authors: [{ name: site.organisation }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.nameFull,
    description: site.description,
    url: env.siteUrl,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.nameFull,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf6" },
    { media: "(prefers-color-scheme: dark)", color: "#07130e" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){try{var s=localStorage.getItem("cf-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

/**
 * کلیدِ سامانهٔ حرکت. پیش از نخستین رنگ‌آمیزی اجرا می‌شود تا:
 * ۱) اگر کاربر «کاهش حرکت» خواسته یا مرورگر IntersectionObserver ندارد،
 *    هیچ عنصری پنهان نشود؛
 * ۲) عناصرِ بالای صفحه بی‌درنگ دیده شوند (بدون انتظار برای hydration)؛
 * ۳) اگر جاوااسکریپت برنامه به هر دلیل بالا نیامد، پس از سه ثانیه همه‌چیز
 *    آزاد و قابل مشاهده شود.
 */
const motionScript = `(function(){var d=document.documentElement;try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver" in window){d.dataset.motion="on";}}catch(e){}if(d.dataset.motion!=="on")return;var vh=window.innerHeight||0;var els=document.querySelectorAll("[data-reveal]");for(var i=0;i<els.length;i++){var r=els[i].getBoundingClientRect();if(r.top<vh&&r.bottom>0){els[i].setAttribute("data-in","");}}setTimeout(function(){if(!document.querySelector("[data-in]")){d.dataset.motion="idle";}},3000);})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain flex min-h-full flex-col bg-paper text-ink antialiased">
        <PointerGlow />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </body>
    </html>
  );
}
