import { chromium } from "playwright-core";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "fa-IR" });
const page = await ctx.newPage();
await page.addInitScript(() => {
  try {
    localStorage.setItem("cf-theme", "dark");
  } catch {}
});
await page.goto("http://127.0.0.1:3000/?cb=" + Date.now(), { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const v = await page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const cta = document.querySelector("section .bg-brand");
  return {
    brand: cs.getPropertyValue("--brand").trim(),
    accent: cs.getPropertyValue("--accent").trim(),
    paper: cs.getPropertyValue("--paper").trim(),
    ctaBg: cta ? getComputedStyle(cta).backgroundColor : null,
    tileBg: getComputedStyle(document.querySelectorAll(".grid-cols-11 > span")[0]).backgroundColor,
  };
});
globalThis.console.warn(JSON.stringify(v));
await browser.close();
