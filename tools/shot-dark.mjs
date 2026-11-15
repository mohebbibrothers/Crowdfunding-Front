import { chromium } from "playwright-core";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  locale: "fa-IR",
  colorScheme: "dark",
});
const page = await ctx.newPage();
await page.addInitScript(() => {
  try {
    localStorage.setItem("cf-theme", "dark");
  } catch {}
});
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/shots/home-dark.png", fullPage: true });
globalThis.console.warn(
  "dark class:",
  await page.evaluate(() => document.documentElement.classList.contains("dark")),
);
await browser.close();
