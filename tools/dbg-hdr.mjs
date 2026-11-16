import { chromium } from "playwright-core";
const b = await chromium.launch();
const p = await (
  await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
).newPage();
await p.goto("http://127.0.0.1:3013/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(900);
await p.screenshot({
  path: "/home/user/dbg-hdr-top.png",
  clip: { x: 0, y: 0, width: 1440, height: 100 },
});
await p.evaluate(() => window.scrollTo(0, 1200));
await p.waitForTimeout(500);
await p.screenshot({
  path: "/home/user/dbg-hdr-scrolled.png",
  clip: { x: 0, y: 0, width: 1440, height: 100 },
});
await b.close();
