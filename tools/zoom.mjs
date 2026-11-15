import { chromium } from "playwright-core";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  locale: "fa-IR",
});
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(600);
const targets = process.argv.slice(2);
for (const sel of targets) {
  const el = page.locator(sel).first();
  await el.screenshot({ path: `/tmp/shots/z-${sel.replace(/[^a-z0-9]/gi, "_")}.png` });
}
await browser.close();
