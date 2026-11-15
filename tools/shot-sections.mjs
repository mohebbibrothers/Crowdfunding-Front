import { chromium } from "playwright-core";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 950 }, deviceScaleFactor: 1.5, locale: "fa-IR" });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);

const shots = [
  ["review-1-hero", "section:has(h1)"],
  ["review-2-cards", "section:has(h2#campaigns-heading)"],
  ["review-3-charities", "section:has(h2:has-text('خیریه‌ها'))"],
  ["review-4-trust", "section:has(h2:has-text('شفافیت'))"],
];
for (const [name, sel] of shots) {
  await page.locator(sel).first().screenshot({ path: `/home/user/${name}.png` });
}
await browser.close();
