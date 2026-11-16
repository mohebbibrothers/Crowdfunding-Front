import { chromium } from "playwright-core";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("https://alavi-fars.ir/", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(800);
const links = await p.evaluate(() =>
  [...document.querySelectorAll("a[href]")].map((a) => ({
    href: a.getAttribute("href"),
    text: (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 32),
  })),
);
const uniq = [...new Map(links.map((l) => [l.href, l])).values()].filter((l) =>
  l.href.startsWith("/"),
);
const res = {};
for (const l of uniq) {
  try {
    const r = await fetch("https://alavi-fars.ir" + l.href, { method: "GET", redirect: "manual" });
    res[l.href] = r.status;
  } catch (e) {
    res[l.href] = "ERR";
  }
}
for (const l of uniq) console.log(String(res[l.href]).padEnd(4), l.href.padEnd(42), "|", l.text);
await b.close();
