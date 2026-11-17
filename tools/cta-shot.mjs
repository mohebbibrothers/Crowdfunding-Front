import { chromium } from "playwright-core";
const BASE = "http://127.0.0.1:3047/";
const b = await chromium.launch();
for (const [scheme, tag] of [
  ["light", "L"],
  ["dark", "D"],
]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1000);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 430) {
    await p.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
    await p.waitForTimeout(180);
  }
  const box = await p.evaluate(() => {
    const el = document.querySelector("section.pb-4 > .shell > div");
    const r = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.top - 90, behavior: "instant" });
    return { h: Math.round(r.height) };
  });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `/home/user/cta-${tag}.png` });
  console.log(tag, box);
  await ctx.close();
}
await b.close();
