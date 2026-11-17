import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

/**
 * عکاسی و سنجش صفحه در هر دو تم.
 *   BASE=http://127.0.0.1:3000/ node tools/theme-shots.mjs
 * خروجی تصویرها در ~/shots (بیرون از مخزن) نوشته می‌شود تا ریشهٔ پروژه شلوغ نشود.
 */
const BASE = process.env.BASE || "http://127.0.0.1:3000/";
const OUT = process.env.OUT || new URL("../../shots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const WIDTHS = [1920, 1440, 1280, 1024, 768, 390, 360];
const browser = await chromium.launch();

/** صفحه را مثل کاربر واقعی پایین می‌برد تا همهٔ ورودهای اسکرولی اجرا شوند. */
async function walk(page, step = 430, pause = 190) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(pause);
  }
}

// ── ۱) سنجش سرریز افقی در هفت عرض ──────────────────────────────────────────
console.log("ـ سرریز افقی ـ");
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 60)));
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(600);
  const m = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
    height: document.documentElement.scrollHeight,
    sections: document.querySelectorAll("main section").length,
  }));
  const ok = m.scroll <= m.client + 1;
  console.log(
    `${ok ? "✓" : "✗"} ${String(width).padEnd(5)} ارتفاع ${String(m.height).padEnd(6)} سرریز ${m.scroll}/${m.client}${errors.length ? " خطا: " + errors.join(" | ") : ""}`,
  );
  await ctx.close();
}

// ── ۲) تصویر: بالای صفحه و پایان صفحه، در هر دو تم ─────────────────────────
for (const [width, height, scheme, tag] of [
  [1440, 900, "light", "desktop-light"],
  [1440, 900, "dark", "desktop-dark"],
  [390, 844, "light", "mobile-light"],
  [390, 844, "dark", "mobile-dark"],
]) {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: scheme });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1000);
  await walk(page);

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), total - height);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}${tag}-end.png` });

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}${tag}-top.png` });
  console.log(`✓ ${tag}: ${total}px`);
  await ctx.close();
}

await browser.close();
console.log(`\nتصویرها: ${OUT}`);
