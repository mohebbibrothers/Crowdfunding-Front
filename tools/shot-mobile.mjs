import { chromium } from "playwright-core";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: "fa-IR",
});
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
await page.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(500);

const shots = [
  ["m-hero", "section:has(h1)"],
  ["m-card", "article"],
  ["m-strip", "section:has(h2:has-text('خیریه‌ها'))"],
];
for (const [name, sel] of shots) {
  await page
    .locator(sel)
    .first()
    .screenshot({ path: `/tmp/shots/${name}.png` });
}

await page.getByRole("button", { name: /باز کردن منو/ }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/shots/m-menu.png" });

const overflow = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));
globalThis.console.warn("errors:", JSON.stringify(errs), "overflow:", JSON.stringify(overflow));
await browser.close();
