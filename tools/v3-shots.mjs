import { chromium } from "playwright-core";
const BASE = "http://127.0.0.1:3047/";
const b = await chromium.launch();

async function ctxFor(w, h, dark = false) {
  return b.newContext({
    viewport: { width: w, height: h },
    colorScheme: dark ? "dark" : "light",
    locale: "fa-IR",
  });
}

// عرض‌ها
for (const w of [1920, 1440, 1280, 1024, 768, 390, 360]) {
  const p = await (await ctxFor(w, 900)).newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 60)));
  await p.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(800);
  const m = await p.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    h: document.documentElement.scrollHeight,
  }));
  console.log(
    `[${w}] overflow=${m.sw > m.cw ? "YES " + m.sw + "/" + m.cw : "no"} h=${m.h} ${errs.length ? errs : ""}`,
  );
  await p.close();
}

// برش‌ها
const p = await (await ctxFor(1440, 900)).newPage();
await p.goto(BASE, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(900);
await p.screenshot({
  path: "/home/user/v3-top.png",
  clip: { x: 0, y: 0, width: 1440, height: 980 },
});
const f = await p.$("footer");
await f.screenshot({ path: "/home/user/v3-footer.png" });
const secs = await p.$$("main > section");
for (let i = 0; i < secs.length; i++)
  await secs[i].screenshot({ path: `/home/user/v3-s${i + 1}.png` });
console.log("sections:", secs.length);
await p.close();

const pd = await (await ctxFor(1440, 900, true)).newPage();
await pd.goto(BASE, { waitUntil: "domcontentloaded" });
await pd.waitForTimeout(900);
await pd.screenshot({
  path: "/home/user/v3-top-dark.png",
  clip: { x: 0, y: 0, width: 1440, height: 980 },
});
await pd.close();

const pm = await (await ctxFor(390, 844)).newPage();
await pm.goto(BASE, { waitUntil: "domcontentloaded" });
await pm.waitForTimeout(900);
await pm.screenshot({
  path: "/home/user/v3-390-top.png",
  clip: { x: 0, y: 0, width: 390, height: 1200 },
});
await pm.close();
await b.close();
console.log("done");
