/**
 * ساخت تصویر Open Graph از دل خودِ سیستم طراحی (نه تصویر دستی).
 * خروجی: public/og.png (۱۲۰۰×۶۳۰)
 * اجرا: node tools/make-og.mjs
 */
import { readFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const font = readFileSync("src/fonts/Vazirmatn-Variable.woff2").toString("base64");

const tiles = Array.from({ length: 11 * 5 }, (_, i) => {
  const filled = i < Math.round(11 * 5 * 0.64);
  const gold = filled && i % 9 === 0;
  const color = gold ? "#d9b356" : filled ? "#1d4b39" : "#ece6d8";
  return `<span style="width:26px;height:26px;border-radius:5px;background:${color}"></span>`;
}).join("");

const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">
<style>
  @font-face{font-family:Vazirmatn;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 900;}
  *{box-sizing:border-box;margin:0;padding:0}
  html{background:#faf7f0;overflow:hidden}
  body{width:1200px;height:630px;font-family:Vazirmatn,sans-serif;background:#faf7f0;color:#14231c;
       display:flex;align-items:center;justify-content:space-between;padding:0 72px;position:relative;overflow:hidden}
  .glow{position:absolute;inset:0;background:radial-gradient(60% 55% at 78% 8%, rgba(29,75,57,.16), transparent 62%)}
  .mosaic{display:grid;grid-template-columns:repeat(11,26px);gap:8px;padding:18px;border:1px solid #e7e0d1;
          border-radius:22px;background:#fff;box-shadow:0 24px 48px -24px rgba(20,35,28,.28)}
  h1{white-space:nowrap;font-size:70px;line-height:1.14;font-weight:800;letter-spacing:0}
  .brand{color:#1d4b39}
  .rule{width:78px;height:5px;border-radius:999px;background:linear-gradient(90deg,#a97c14,#d9b356);margin:26px 0 22px}
  p{font-size:27px;line-height:1.7;color:#3d4f47;max-width:560px}
  .url{margin-top:34px;font-size:24px;font-weight:700;color:#1d4b39}
  .mark{display:flex;align-items:center;gap:12px;margin-bottom:26px}
  .word{font-size:30px;font-weight:800;color:#1d4b39}
</style></head><body>
<div class="glow"></div>
<div style="position:relative;max-width:640px">
  <div class="mark">
    <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18.25" stroke="#1d4b39" stroke-width="1.5" opacity=".35"/>
      <path d="M20 7.5 L20 20 L11 25.2 Z" fill="#1d4b39"/>
      <path d="M20 20 L32.2 20 L26.1 30.6 Z" fill="#1d4b39" opacity=".62"/>
      <path d="M20 20 L7.8 20 L13.9 30.6 Z" fill="#1d4b39" opacity=".34"/>
      <circle cx="20" cy="20" r="2.1" fill="#a97c14"/>
    </svg>
    <span class="word">هم‌سهم</span>
  </div>
  <h1>کار خیر،</h1>
  <h1 style="display:flex;align-items:center;gap:22px"><span class="brand">سهم‌سهم</span><span>می‌شود</span></h1>
  <div class="rule"></div>
  <p>هر حرکت خیر به سهم‌های کوچک تقسیم می‌شود؛ سهم بردار، پرداخت کن و رسید شفاف بگیر.</p>
  <div class="url">alavi-fars.ir</div>
</div>
<div class="mosaic" style="position:relative">${tiles}</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "load" });
await page.waitForTimeout(400);
mkdirSync("public", { recursive: true });
await page.screenshot({ path: "public/og.png" });
await browser.close();
globalThis.console.warn("public/og.png written");
