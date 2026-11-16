import { chromium } from "playwright-core";
import fs from "node:fs";
const b = await chromium.launch();
const p = await (
  await b.newContext({ viewport: { width: 1200, height: 620 }, deviceScaleFactor: 1 })
).newPage();
for (const name of process.argv.slice(2)) {
  const svg = fs.readFileSync(`/home/user/brand-src/${name}.svg`, "utf8");
  const html = `<body style="margin:0;background:#0d1712;display:grid;place-items:center;height:100vh">
    <div style="width:min(1100px,92vw);color:#fff">${svg.replace("<svg", `<svg style="width:100%;height:auto;fill:currentColor"`).replace(/fill="#000000"/g, 'fill="currentColor"')}</div></body>`;
  await p.setContent(html);
  await p.waitForTimeout(120);
  const el = await p.$("div > svg");
  await el.screenshot({ path: `/home/user/brand-src/preview-${name}.png` });
  console.log("rendered", name);
}
await b.close();
