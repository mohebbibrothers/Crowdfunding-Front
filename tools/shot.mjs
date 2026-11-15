import { chromium } from "playwright-core";
const browser = await chromium.launch();
const targets = [
  { name: "home-desktop", viewport: { width: 1440, height: 1000 }, full: true },
  { name: "home-mobile", viewport: { width: 390, height: 844 }, full: true, mobile: true },
];
for (const t of targets) {
  const ctx = await browser.newContext({
    viewport: t.viewport,
    deviceScaleFactor: 1,
    isMobile: !!t.mobile,
    hasTouch: !!t.mobile,
    locale: "fa-IR",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/shots/${t.name}.png`, fullPage: t.full });
  console.log(t.name, "errors:", JSON.stringify(errors.slice(0, 5)));
  await ctx.close();
}
await browser.close();
