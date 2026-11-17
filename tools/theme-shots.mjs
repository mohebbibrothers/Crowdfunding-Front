import { chromium } from "playwright-core";
const BASE = process.env.BASE || "http://127.0.0.1:3047/";
const b = await chromium.launch();

async function walk(p, step = 430, pause = 200) {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += step) {
    await p.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
    await p.waitForTimeout(pause);
  }
}

for (const [w, h, scheme, tag] of [
  [1440, 900, "light", "L"],
  [1440, 900, "dark", "D"],
  [390, 844, "light", "ML"],
  [390, 844, "dark", "MD"],
]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1200);
  await walk(p);
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  // آخرین قاب: پنل پایانی + فوتر
  await p.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), total - h);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `/home/user/t-${tag}-end.png` });
  // قاب اول
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await p.waitForTimeout(500);
  await p.screenshot({ path: `/home/user/t-${tag}-top.png` });
  console.log(tag, "h=", total);
  await ctx.close();
}
await b.close();
