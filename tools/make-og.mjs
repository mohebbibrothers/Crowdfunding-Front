/**
 * ساخت تصویر Open Graph از دل خودِ سیستم طراحی (نه تصویر دستی).
 * خروجی: public/og.png (۱۲۰۰×۶۳۰)
 * اجرا: node tools/make-og.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";

const font = readFileSync("src/fonts/Vazirmatn-Variable.woff2").toString("base64");
const markSvg = readFileSync("public/brand/mark.svg", "utf8");
const tf = markSvg.match(/<g transform="([^"]+)"/)[1];
const markPath = markSvg.match(/<path d="([^"]+)"/s)[1].replace(/\s+/g, " ");

const light = {
  paper: "#fbfaf6",
  ink: "#0e2318",
  inkSoft: "#33473c",
  muted: "#5c6f64",
  line: "#e1e8e2",
  brand: "#06553c",
  brandSoft: "#0a6f4f",
  gold: "#e08c1a",
  goldSoft: "#f0c076",
  goldInk: "#8a5a09",
  surface: "#ffffff",
  surface2: "#f1f6f2",
  surface3: "#e4ece6",
};
const c = light;

const COLS = 9;
const ROWS = 7;
const total = COLS * ROWS;
const filled = Math.round(total * 0.46);
const tiles = Array.from({ length: total }, (_, i) => {
  const isFilled = i < filled;
  const isEdge = i % COLS === 0 || i % COLS === COLS - 1;
  const color = isFilled ? (i % 9 === 0 ? c.goldSoft : c.brand) : isEdge ? c.surface3 : c.surface2;
  return `<span style="width:30px;height:30px;border-radius:7px;background:${color};border:1px solid ${isFilled ? "transparent" : "#cfdad2"}"></span>`;
}).join("");

const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">
<style>
  @font-face{font-family:Vazirmatn;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 900;}
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1200px;height:630px;font-family:Vazirmatn,sans-serif;background:${c.paper};color:${c.ink};
       display:flex;align-items:center;justify-content:space-between;gap:40px;padding:0 64px;position:relative;overflow:hidden}
  .glow{position:absolute;inset:0;background:
    radial-gradient(58% 70% at 82% 0%, rgba(6,85,60,.16), transparent 62%),
    radial-gradient(40% 50% at 4% 100%, rgba(224,140,26,.14), transparent 66%)}
  .dots{position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px, rgba(10,111,79,.22) 1px, transparent 0);
    background-size:22px 22px;mask-image:radial-gradient(ellipse 60% 60% at 60% 40%, #000 30%, transparent 78%)}
  .col{position:relative}
  .mark{display:flex;align-items:center;gap:14px;margin-bottom:30px}
  .mark .name{font-size:26px;font-weight:800;line-height:1.1}
  .mark .sub{font-size:15px;font-weight:600;color:${c.muted};margin-top:6px;display:flex;align-items:center;gap:8px}
  .dash{width:18px;height:2px;background:${c.gold};border-radius:2px}
  h1{font-size:70px;line-height:1.16;font-weight:800;letter-spacing:-1px;max-width:640px}
  h1 .hl{color:${c.brandSoft};position:relative;display:inline-block}
  h1 .hl svg{position:absolute;inset-inline:0;bottom:-8px;width:100%;height:14px}
  p{font-size:23px;line-height:1.75;color:${c.inkSoft};max-width:560px;margin-top:24px}
  .url{margin-top:34px;display:inline-flex;align-items:center;gap:10px;font-size:22px;font-weight:800;color:${c.brand};
       border:1px solid ${c.line};border-radius:999px;padding:10px 22px;background:${c.surface}}
  .mosaic{display:grid;grid-template-columns:repeat(${COLS},30px);gap:7px;padding:24px;
          border:1px solid ${c.line};border-radius:26px;background:${c.surface};
          box-shadow:0 40px 80px -40px rgba(6,40,28,.35)}
  .cap{margin-top:16px;text-align:center;font-size:15px;font-weight:700;color:${c.muted}}
</style></head><body>
<div class="glow"></div><div class="dots"></div>

<div class="col" style="max-width:640px">
  <div class="mark">
    <svg width="46" height="71" viewBox="0 0 964 1494" fill="${c.brand}"><g transform="${tf}"><path d="${markPath}"/></g></svg>
    <div>
      <div class="name">بنیاد علوی</div>
      <div class="sub"><span class="dash"></span> سامانهٔ هم‌سهم</div>
    </div>
  </div>

  <h1>کار خیر،<br><span class="hl">سهم‌سهم
    <svg viewBox="0 0 220 14" preserveAspectRatio="none"><path d="M3 9.5C46 4.2 96 2.8 217 7.4" fill="none" stroke="${c.gold}" stroke-width="6" stroke-linecap="round" opacity=".6"/></svg>
  </span> می‌شود</h1>

  <p>هر حرکت به سهم‌های کوچک تقسیم شده؛ یک سهم بردار، همان لحظه پرداخت کن و رسید رسمی با گواهی شفافیت بگیر.</p>

  <div class="url"><span style="width:8px;height:8px;border-radius:99px;background:${c.gold}"></span>alavi-fars.ir</div>
</div>

<div class="col">
  <div class="mosaic">${tiles}</div>
  <div class="cap">هر مربع، یک سهم</div>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await (
  await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
).newPage();
await page.setContent(html);
await page.waitForTimeout(400);
await page.screenshot({ path: "public/og.png" });
await browser.close();
writeFileSync("/tmp/og-html.html", html);
console.log("public/og.png ساخته شد");
