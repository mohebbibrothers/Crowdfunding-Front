import { chromium } from "playwright-core";
const BASE = "http://127.0.0.1:3013/";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: "fa-IR" });
const p = await ctx.newPage();
const bad = [];
p.on("response", (r) => {
  if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`);
});
await p.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(1200);
console.log("HTTP errors:", [...new Set(bad)]);
const secs = await p.$$("main > section");
console.log("sections:", secs.length);
for (let i = 0; i < secs.length; i++) {
  const box = await secs[i].boundingBox();
  await secs[i].screenshot({ path: `/home/user/new-1440-s${i + 1}.png` });
  console.log(`s${i + 1} ${Math.round(box.width)}x${Math.round(box.height)}`);
}
const hdr = await p.$("header");
await hdr.screenshot({ path: "/home/user/new-header.png" });
const ftr = await p.$("footer");
await ftr.screenshot({ path: "/home/user/new-footer.png" });
await b.close();
