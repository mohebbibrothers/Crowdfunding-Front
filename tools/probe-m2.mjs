import { chromium } from "playwright-core";
const b = await chromium.launch();
const p = await (
  await b.newContext({ viewport: { width: 390, height: 844 }, locale: "fa-IR" })
).newPage();
await p.goto("http://127.0.0.1:3010/", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(600);
const r = await p.evaluate(() => {
  const arts = [...document.querySelectorAll("article")];
  return {
    doc: { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth },
    cards: arts.map((a) => {
      const b = a.getBoundingClientRect();
      return { l: Math.round(b.left), r: Math.round(b.right), w: Math.round(b.width) };
    }),
    section: (() => {
      const s = document.querySelector("main > section:nth-of-type(3)");
      const b = s.getBoundingClientRect();
      return {
        l: Math.round(b.left),
        r: Math.round(b.right),
        w: Math.round(b.width),
        padL: getComputedStyle(s).paddingLeft,
      };
    })(),
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
