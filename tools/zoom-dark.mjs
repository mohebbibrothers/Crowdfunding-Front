import { chromium } from "playwright-core";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  locale: "fa-IR",
});
const page = await ctx.newPage();
await page.addInitScript(() => {
  try {
    localStorage.setItem("cf-theme", "dark");
  } catch {}
});
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page
  .locator("section:has(h2:has-text('امروز یک سهم'))")
  .screenshot({ path: "/tmp/shots/d-cta.png" });
await page.locator("header").screenshot({ path: "/tmp/shots/d-header.png" });
await page.locator("article").first().screenshot({ path: "/tmp/shots/d-card.png" });
await browser.close();
