import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:3053";
const OUT = process.env.OUT || new URL("../../shots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

const pages = [
  ["/campaigns", 1440, 900, "light", "list-desktop"],
  ["/campaigns", 1440, 900, "dark", "list-desktop-dark"],
  ["/campaigns", 390, 844, "light", "list-mobile"],
  ["/campaigns?category=health-care&order=newest", 1440, 900, "light", "list-filtered"],
  ["/campaigns?q=zzz", 1440, 900, "light", "list-empty"],
];

for (const [path, width, height, scheme, tag] of pages) {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: scheme });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 80)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 80)));
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2200);
  const info = await page.evaluate(() => ({
    h: document.documentElement.scrollHeight,
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    cards: document.querySelectorAll("article.card").length,
    title: document.title,
  }));
  await page.screenshot({ path: `${OUT}${tag}.png` });
  console.log(
    `${tag.padEnd(20)} h=${info.h} sw=${info.sw}/${info.cw} cards=${info.cards}${errors.length ? " ERR: " + errors.join(" | ") : ""}`,
  );
  await ctx.close();
}

// شیت صافی‌ها در موبایل
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/campaigns`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: /صافی‌ها/ }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}list-mobile-sheet.png` });
  const open = await page.evaluate(() => !!document.querySelector("dialog[open]"));
  console.log(`sheet open: ${open}`);
  await ctx.close();
}

await browser.close();
