import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://127.0.0.1:3047/";
const b = await chromium.launch();

/** صفحه را مثل کاربر واقعی پایین می‌برد تا همهٔ ورودها اجرا شوند. */
async function walk(p, step = 420, pause = 260) {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += step) {
    await p.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await p.waitForTimeout(pause);
  }
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await p.waitForTimeout(500);
}

for (const [w, h, tag] of [
  [1440, 900, "d"],
  [390, 844, "m"],
]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(1200);
  await walk(p);
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < total; y += h) {
    await p.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await p.waitForTimeout(420);
    await p.screenshot({ path: `/home/user/w-${tag}${i++}.png` });
  }
  console.log(tag, "slices:", i, "height:", total);
  await ctx.close();
}
await b.close();
