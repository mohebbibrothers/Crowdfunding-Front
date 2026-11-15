import { chromium } from "playwright-core";

const BASE = "https://alavi-fars.ir/";
const browser = await chromium.launch();

const sizes = [
  ["1920", { width: 1920, height: 1080 }],
  ["1440", { width: 1440, height: 900 }],
  ["1280", { width: 1280, height: 800 }],
  ["768", { width: 768, height: 1024 }],
  ["390", { width: 390, height: 844 }],
];

for (const [label, viewport] of sizes) {
  const ctx = await browser.newContext({
    viewport,
    ignoreHTTPSErrors: true,
    locale: "fa-IR",
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 120));
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("_rsc=")) failed.push(`${r.status()} ${r.url()}`);
  });

  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
  const loadMs = Date.now() - t0;

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    h1: document.querySelector("h1")?.textContent?.trim().slice(0, 60),
    overflow: [...document.querySelectorAll("*")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > document.documentElement.clientWidth + 1 || r.left < -1);
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`),
  }));

  await page.screenshot({
    path: `/tmp/shots/live-${label}.png`,
    fullPage: viewport.width < 800 ? false : true,
  });

  globalThis.console.warn(
    `\n[${label}] load=${loadMs}ms h=${metrics.scrollHeight} overflowX=${metrics.scrollWidth > metrics.clientWidth ? "YES" : "no"} (${metrics.scrollWidth}/${metrics.clientWidth})`,
    `\n  h1: ${metrics.h1}`,
    `\n  wide: ${JSON.stringify(metrics.overflow)}`,
    `\n  errors: ${JSON.stringify([...new Set(errors)].slice(0, 4))}`,
    `\n  failed: ${JSON.stringify([...new Set(failed)].slice(0, 6))}`,
  );
  await ctx.close();
}
await browser.close();
