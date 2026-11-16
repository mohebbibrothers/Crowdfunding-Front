import { chromium } from "playwright-core";
const b = await chromium.launch();
async function grab(w, h, sel, file, dark = false) {
  const p = await (
    await b.newContext({
      viewport: { width: w, height: h },
      colorScheme: dark ? "dark" : "light",
      locale: "fa-IR",
    })
  ).newPage();
  await p.goto("http://127.0.0.1:3010/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(700);
  const els = await p.$$(sel);
  if (!els.length) {
    console.log("missing", sel);
    return;
  }
  await els[0].screenshot({ path: file });
  console.log("saved", file);
}
await grab(390, 844, "main > section", "/home/user/fix-390-hero.png");
await grab(390, 844, "article", "/home/user/fix-390-card.png");
await grab(1440, 900, "article", "/home/user/fix-1440-card.png");
await b.close();
