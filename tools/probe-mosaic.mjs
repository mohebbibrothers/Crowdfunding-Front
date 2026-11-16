import { chromium } from "playwright-core";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("https://alavi-fars.ir/", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1000);
const out = await p.evaluate(() => {
  const g = document.querySelector(".grid-cols-11");
  if (!g) return { err: "no grid-cols-11" };
  const counts = {};
  for (const c of g.children) {
    const k = (String(c.className).match(/bg-[a-z0-9-]+/g) || []).join(" ");
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return {
    children: g.children.length,
    cls: String(g.className),
    counts,
    first10: [...g.children]
      .slice(0, 10)
      .map((c) => (String(c.className).match(/bg-[a-z0-9-]+/g) || []).join(" ")),
  };
});
console.log(JSON.stringify(out, null, 2));
await b.close();
