import { chromium } from "playwright-core";
const b = await chromium.launch();
const URL = "http://127.0.0.1:3047/";

// ۱) کاهش حرکت
{
  const ctx = await b.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const els = [...document.querySelectorAll("[data-reveal]")];
    const hidden = els.filter((el) => +getComputedStyle(el).opacity < 0.99).length;
    const words = [...document.querySelectorAll(".word")].filter(
      (w) => +getComputedStyle(w).opacity < 0.99,
    ).length;
    const animating = [...document.querySelectorAll("*")].filter(
      (el) =>
        getComputedStyle(el).animationName !== "none" &&
        parseFloat(getComputedStyle(el).animationDuration) > 0.02,
    ).length;
    return {
      motion: document.documentElement.dataset.motion ?? "(unset)",
      total: els.length,
      hidden,
      words,
      animating,
    };
  });
  console.log("reduced-motion:", JSON.stringify(r));
  await p.screenshot({ path: "/home/user/fallback-reduced.png" });
  await ctx.close();
}

// ۲) جاوااسکریپت خاموش
{
  const ctx = await b.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({
    hidden: [...document.querySelectorAll("[data-reveal]")].filter(
      (el) => +getComputedStyle(el).opacity < 0.99,
    ).length,
  }));
  console.log("no-js:", JSON.stringify(r));
  await p.screenshot({ path: "/home/user/fallback-nojs.png" });
  await ctx.close();
}
await b.close();
