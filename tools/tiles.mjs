import { chromium } from "playwright-core";
import fs from "node:fs";

const logo = fs
  .readFileSync("/home/user/brand-src/lockup-h.svg", "utf8")
  .replace("<svg", `<svg class="logo" style="fill:currentColor"`)
  .replace(/fill="#000000"/g, 'fill="currentColor"');

const tiles = {
  A: {
    name: "الف — زیتونی و طلا (تحریریه‌ای، آرام و معتبر)",
    vars: {
      paper: "#f7f4ec",
      surface: "#fffdf8",
      ink: "#23281d",
      muted: "#6d7361",
      line: "#e2dfd1",
      brand: "#3f5136",
      brandSoft: "#54684a",
      onBrand: "#fbfaf5",
      accent: "#5c6f4a",
      gold: "#a8842c",
      tint: "#eceadd",
      surf2: "#f1eee3",
    },
  },
  B: {
    name: "ب — سرمه‌ای و شنی (نهادی، حداکثر اعتماد)",
    vars: {
      paper: "#f6f6f4",
      surface: "#ffffff",
      ink: "#131b26",
      muted: "#5f6b7a",
      line: "#e3e6ea",
      brand: "#15314d",
      brandSoft: "#22496e",
      onBrand: "#f7fafc",
      accent: "#1f4f74",
      gold: "#c08b2e",
      tint: "#eaf0f6",
      surf2: "#f1f3f6",
    },
  },
  C: {
    name: "ج — زمرد کهربایی (مدرن، پرانرژی، جذاب برای مخاطب جوان)",
    vars: {
      paper: "#fbfaf6",
      surface: "#ffffff",
      ink: "#0e2318",
      muted: "#5c6f64",
      line: "#e0e7e1",
      brand: "#06553c",
      brandSoft: "#0a6f4f",
      onBrand: "#f4fdf9",
      accent: "#0a6f4f",
      gold: "#e08c1a",
      tint: "#e8f5ee",
      surf2: "#f0f6f2",
    },
  },
};

const html = (v, name) => `<!doctype html><html dir="rtl" lang="fa"><head><meta charset="utf-8">
<style>
@font-face{font-family:V;src:url(file:///home/user/brand-src/Vazirmatn-Variable.woff2) format("woff2-variations");font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{font-family:V,sans-serif;background:${v.paper};color:${v.ink};padding:26px 34px}
.hdr{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-bottom:16px;border-bottom:1px solid ${v.line}}
.logo{height:40px;width:auto;color:${v.brand}}
nav{display:flex;gap:22px;font-size:.84rem;color:${v.muted};font-weight:600}
.cta-s{background:${v.brand};color:${v.onBrand};border-radius:999px;padding:9px 18px;font-size:.8rem;font-weight:700}
.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:30px;margin-top:26px;align-items:center}
.badge{display:inline-flex;gap:6px;align-items:center;background:${v.tint};color:${v.gold};border:1px solid ${v.gold}33;border-radius:999px;padding:6px 12px;font-size:.72rem;font-weight:700}
h1{font-size:2.5rem;line-height:1.28;margin:14px 0 0;font-weight:800;letter-spacing:-.01em}
h1 em{font-style:normal;color:${v.accent};position:relative}
h1 em::after{content:"";position:absolute;inset-inline:-4px;bottom:2px;height:.42em;background:${v.gold}2e;z-index:-1;border-radius:4px}
p.lead{margin-top:14px;font-size:.92rem;line-height:2;color:${v.muted};max-width:34em}
.btns{display:flex;gap:10px;margin-top:20px}
.btn{background:${v.brand};color:${v.onBrand};border-radius:999px;padding:13px 26px;font-size:.86rem;font-weight:700}
.btn.o{background:transparent;color:${v.ink};border:1px solid ${v.line}}
.card{background:${v.surface};border:1px solid ${v.line};border-radius:18px;overflow:hidden;box-shadow:0 24px 50px -30px #00000026}
.cover{height:118px;background:
 radial-gradient(120% 100% at 85% 0%, ${v.gold}33, transparent 60%),
 radial-gradient(90% 80% at 0% 100%, ${v.brandSoft}, ${v.brand});position:relative}
.cover span{position:absolute;inset-inline-end:12px;top:12px;background:#0000004d;color:#fff;font-size:.66rem;padding:5px 10px;border-radius:999px;backdrop-filter:blur(6px)}
.cbody{padding:14px 16px 16px}
.t{font-size:.94rem;font-weight:800;line-height:1.7}
.m{font-size:.72rem;color:${v.muted};margin-top:6px}
.bar{height:7px;border-radius:99px;background:${v.surf2};margin-top:12px;overflow:hidden}
.bar i{display:block;height:100%;width:38%;background:${v.accent};border-radius:99px}
.row{display:flex;justify-content:space-between;font-size:.72rem;color:${v.muted};margin-top:8px}
.num{font-weight:800;color:${v.ink}}
.sw{display:flex;gap:8px;margin-top:22px;align-items:center}
.sw div{width:34px;height:34px;border-radius:10px;border:1px solid ${v.line}}
.sw b{font-size:.72rem;color:${v.muted};margin-inline-start:6px;font-weight:600}
.tag{font-size:.7rem;color:${v.muted};margin-top:10px}
</style></head><body>
<div class="hdr"><div>${logo}</div>
  <nav><span>حرکت‌ها</span><span>خیریه‌ها</span><span>قلک‌ها</span><span>شفافیت</span><span>درباره ما</span></nav>
  <span class="cta-s">ورود / ثبت‌نام</span></div>
<div class="hero">
  <div>
    <span class="badge">◈ سکوی جمع‌سپاری سهم‌محور</span>
    <h1>کار خیر، <em>سهم‌سهم</em> می‌شود</h1>
    <p class="lead">هر حرکت خیر به سهم‌های کوچک و روشن تقسیم می‌شود؛ شما به تعداد دلخواه سهم برمی‌دارید، همان لحظه می‌پردازید و رسید رسمی با گواهی شفافیت می‌گیرید.</p>
    <div class="btns"><span class="btn">حرکت‌ها را ببین و سهیم شو</span><span class="btn o">هم‌سهم چطور کار می‌کند؟</span></div>
    <div class="tag">نمونهٔ پالت — ${name}</div>
  </div>
  <div class="card">
    <div class="cover"><span>● فوری</span></div>
    <div class="cbody">
      <div class="t">تأمین هزینهٔ عمل جراحی قلب باز کودک ۷ ساله</div>
      <div class="m">مؤسسه خیریه مهرآفرین سلامت کودکان · زاهدان</div>
      <div class="bar"><i></i></div>
      <div class="row"><span>۳۸٪ تأمین شده</span><span class="num">۱۲۴ از ۲۰۰ سهم</span></div>
      <div class="row"><span>هر سهم <b class="num">۵۰٬۰۰۰ تومان</b></span><span><b class="num">۲ هفته</b> مانده</span></div>
    </div>
  </div>
</div>
<div class="sw">
  ${["paper", "surface", "ink", "brand", "accent", "gold", "tint"].map((k) => `<div style="background:${v[k]}" title="${k}"></div>`).join("")}
  <b>${v.brand} · ${v.accent} · ${v.gold}</b>
</div>
</body></html>`;

const b = await chromium.launch();
const p = await (
  await b.newContext({ viewport: { width: 1280, height: 760 }, deviceScaleFactor: 1.4 })
).newPage();
for (const [k, t] of Object.entries(tiles)) {
  await p.setContent(html(t.vars, t.name));
  await p.waitForTimeout(350);
  await p.screenshot({ path: `/home/user/tile-${k}.png` });
  console.log("tile", k, t.name);
}
await b.close();
