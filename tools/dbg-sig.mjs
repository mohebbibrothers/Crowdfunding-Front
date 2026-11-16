import { chromium } from "playwright-core";
const b = await chromium.launch();
const p = await (
  await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
).newPage();
await p.goto("http://127.0.0.1:3013/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1200);
const sig = await p.$("footer img[src*='lockup-h']");
await sig.scrollIntoViewIfNeeded();
await p.waitForTimeout(400);
await sig.screenshot({ path: "/home/user/dbg-sig-only.png" });
const mark = await p.$("footer svg[fill='currentColor']");
if (mark) await mark.screenshot({ path: "/home/user/dbg-mark-only.png" });
const top = await p.$("footer > div.shell");
await top.screenshot({ path: "/home/user/dbg-footer-shell.png" });
await b.close();
