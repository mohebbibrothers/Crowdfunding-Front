import { chromium } from "playwright-core";
import fs from "node:fs";

const OUT = "/home/user";
const browser = await chromium.launch();
const errors = [];

async function shoot({ w, h, dark, tag }) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    colorScheme: dark ? "dark" : "light",
    locale: "fa-IR",
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${tag}: ${e.message.slice(0, 80)}`));
  await page.goto("https://alavi-fars.ir/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1200);
  const secs = await page.$$("main > section");
  console.log(`[${tag}] sections=${secs.length}`);
  for (let i = 0; i < secs.length; i++) {
    const box = await secs[i].boundingBox();
    if (!box || box.height < 40) continue;
    const file = `${OUT}/live-${tag}-s${i + 1}.png`;
    await secs[i].screenshot({ path: file });
    console.log(`  ${file}  ${Math.round(box.width)}x${Math.round(box.height)}`);
  }
  await ctx.close();
}

await shoot({ w: 1440, h: 900, dark: false, tag: "1440" });
await shoot({ w: 1440, h: 900, dark: true, tag: "1440dark" });
await shoot({ w: 390, h: 844, dark: false, tag: "390" });
await browser.close();
console.log("errors:", [...new Set(errors)]);
