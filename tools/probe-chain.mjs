import { chromium } from "playwright-core";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: "fa-IR" });
const p = await ctx.newPage();
await p.goto("https://alavi-fars.ir/", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1000);
const out = await p.evaluate(() => {
  const li = document.querySelector("ul.mt-6.grid a.rounded-2xl");
  const chain = [];
  let n = li;
  while (n && n !== document.documentElement) {
    const r = n.getBoundingClientRect(),
      cs = getComputedStyle(n);
    chain.push({
      tag: n.tagName.toLowerCase(),
      cls: String(n.className).slice(0, 70),
      left: Math.round(r.left),
      right: Math.round(r.right),
      w: Math.round(r.width),
      ml: cs.marginInlineStart,
      mr: cs.marginInlineEnd,
      pl: cs.paddingInlineStart,
      pr: cs.paddingInlineEnd,
      ovx: cs.overflowX,
      dir: cs.direction,
      pos: cs.position,
    });
    n = n.parentElement;
  }
  const skip = document.querySelector('a[href^="#"]');
  const sr = skip ? skip.getBoundingClientRect() : null;
  return {
    chain,
    skip: sr
      ? {
          left: Math.round(sr.left),
          right: Math.round(sr.right),
          w: Math.round(sr.width),
          cls: String(skip.className),
        }
      : null,
  };
});
console.log("=== chain (li -> html) ===");
for (const c of out.chain) console.log(JSON.stringify(c));
console.log("=== skip link ===", JSON.stringify(out.skip));
await b.close();
