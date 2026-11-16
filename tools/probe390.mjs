import { chromium } from "playwright-core";
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  locale: "fa-IR",
  isMobile: false,
});
const p = await ctx.newPage();
await p.goto("https://alavi-fars.ir/", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1200);
const out = await p.evaluate(() => {
  const W = document.documentElement.clientWidth;
  const rows = [];
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    const over = Math.round(r.right - W);
    if (over > 0.5 || r.left < -0.5) {
      rows.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 90),
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
        overRight: over,
        overLeft: Math.round(-r.left),
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 45),
        depth: (() => {
          let d = 0,
            n = el;
          while ((n = n.parentElement)) d++;
          return d;
        })(),
        parent: el.parentElement
          ? el.parentElement.tagName.toLowerCase() +
            "." +
            String(el.parentElement.className).slice(0, 45)
          : "",
        parentOverflowX: el.parentElement ? getComputedStyle(el.parentElement).overflowX : "",
      });
    }
  }
  return {
    W,
    scrollWidth: document.documentElement.scrollWidth,
    rows: rows.sort((a, b) => b.overRight - a.overRight).slice(0, 14),
  };
});
console.log("clientWidth", out.W, "scrollWidth", out.scrollWidth);
for (const r of out.rows) console.log(JSON.stringify(r));
await b.close();
