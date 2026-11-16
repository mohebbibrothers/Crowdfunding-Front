import { chromium } from "playwright-core";
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  locale: "fa-IR",
  deviceScaleFactor: 2,
});
const p = await ctx.newPage();
await p.goto("http://127.0.0.1:3013/", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1000);
const secs = await p.$$("main > section");
for (let i = 0; i < secs.length; i++) {
  const box = await secs[i].boundingBox();
  await secs[i].screenshot({ path: `/home/user/m-390-s${i + 1}.png` });
  console.log(`s${i + 1} ${Math.round(box.width)}x${Math.round(box.height)}`);
}
const f = await p.$("footer");
await f.screenshot({ path: "/home/user/m-390-footer.png" });
await p.screenshot({
  path: "/home/user/m-390-header.png",
  clip: { x: 0, y: 0, width: 390, height: 90 },
});
await b.close();
