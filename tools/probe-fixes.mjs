import { chromium } from "playwright-core";
const b = await chromium.launch();

for (const w of [390, 768, 1440]) {
  const p = await (
    await b.newContext({ viewport: { width: w, height: 900 }, locale: "fa-IR" })
  ).newPage();
  await p.goto("http://127.0.0.1:3010/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const d = document.documentElement;
    const g = document.querySelector(".grid-cols-11");
    const counts = {};
    if (g)
      for (const c of g.children) {
        const k = (String(c.className).match(/bg-[a-z0-9-]+/g) || []).join(" ");
        counts[k] = (counts[k] ?? 0) + 1;
      }
    const meta = document.querySelector("article .flex.items-center.gap-2");
    const label =
      g?.closest("[role=img]")?.getAttribute("aria-label") ?? g?.getAttribute("aria-label");
    // card meta row height: is it one line?
    const rows = [...document.querySelectorAll("article")].map((a) => {
      const row = a.querySelector(".text-\\[0\\.74rem\\]");
      return row ? Math.round(row.getBoundingClientRect().height) : null;
    });
    const skip = document.querySelector('a[href="#main"]');
    const sr = skip?.getBoundingClientRect();
    return {
      scrollW: d.scrollWidth,
      clientW: d.clientWidth,
      mosaicLabel: label,
      mosaicCounts: counts,
      cardMetaRowHeights: rows,
      skipLink: sr ? { left: Math.round(sr.left), right: Math.round(sr.right) } : null,
    };
  });
  console.log(
    `\n[${w}] overflow=${r.scrollW > r.clientW ? "YES " + r.scrollW + "/" + r.clientW : "no"}`,
  );
  console.log(`  mosaic: ${r.mosaicLabel} | ${JSON.stringify(r.mosaicCounts)}`);
  console.log(
    `  card meta row heights: ${JSON.stringify(r.cardMetaRowHeights)}  (<=24 = single line)`,
  );
  console.log(`  skip link: ${JSON.stringify(r.skipLink)}`);
  await p.close();
}
await b.close();
