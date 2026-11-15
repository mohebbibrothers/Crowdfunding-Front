import { chromium } from "playwright-core";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const bad = [];
page.on("response", (r) => {
  if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`);
});
await page.goto("http://127.0.0.1:3001/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
globalThis.console.warn([...new Set(bad)].join("\n"));
await browser.close();
