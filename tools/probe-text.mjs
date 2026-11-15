import { chromium } from "playwright-core";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 400 }, deviceScaleFactor: 2 });
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.locator("h1.display-1").screenshot({ path: "/tmp/shots/probe-h1.png" });
await browser.close();
