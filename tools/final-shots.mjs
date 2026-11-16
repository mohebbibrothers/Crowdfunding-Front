import { chromium } from "playwright-core";
const BASE = "http://127.0.0.1:3016/";
const b = await chromium.launch();

async function shots({ w, h, dark, tag, parts }) {
  const ctx = await b.newContext({
    viewport: { width: w, height: h },
    colorScheme: dark ? "dark" : "light",
    locale: "fa-IR",
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(1000);
  for (const [name, sel, idx] of parts) {
    const els = await p.$$(sel);
    const el = els[idx ?? 0];
    if (!el) {
      console.log("miss", name);
      continue;
    }
    await el.screenshot({ path: `/home/user/final-${tag}-${name}.png` });
  }
  await ctx.close();
}

await shots({
  w: 1440,
  h: 900,
  dark: false,
  tag: "1440",
  parts: [
    ["hero", "main > section", 0],
    ["how", "#how", 0],
    ["cards", "main > section", 2],
    ["trust", "main > section", 3],
    ["cta", "main > section", 4],
    ["footer", "footer", 0],
  ],
});
await shots({
  w: 1440,
  h: 900,
  dark: true,
  tag: "dark",
  parts: [
    ["hero", "main > section", 0],
    ["cards", "main > section", 2],
    ["footer", "footer", 0],
  ],
});
await shots({
  w: 390,
  h: 844,
  dark: false,
  tag: "390",
  parts: [
    ["hero", "main > section", 0],
    ["cards", "main > section", 2],
    ["footer", "footer", 0],
    ["cta", "main > section", 4],
  ],
});
await b.close();
console.log("done");
