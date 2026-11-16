import { chromium } from "playwright-core";
const b = await chromium.launch();
const p = await (
  await b.newContext({ viewport: { width: 390, height: 844 }, locale: "fa-IR" })
).newPage();
await p.goto("http://127.0.0.1:3013/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const chip = [...document.querySelectorAll("span")].find((s) =>
    s.textContent.trim().startsWith("سامانهٔ سهم‌محور"),
  );
  const sec = document.querySelector("main > section");
  const h1 = document.querySelector("h1");
  const cs = chip ? getComputedStyle(chip) : null;
  return {
    chipFound: !!chip,
    chipRect: chip
      ? (({ x, y, width, height }) => ({
          x: Math.round(x),
          y: Math.round(y),
          w: Math.round(width),
          h: Math.round(height),
        }))(chip.getBoundingClientRect())
      : null,
    chipColor: cs ? cs.color : null,
    chipBg: cs ? cs.backgroundColor : null,
    chipDisplay: cs ? cs.display : null,
    sectionRect: (({ x, y, width, height }) => ({ y: Math.round(y), h: Math.round(height) }))(
      sec.getBoundingClientRect(),
    ),
    h1Rect: (({ y, height }) => ({ y: Math.round(y), h: Math.round(height) }))(
      h1.getBoundingClientRect(),
    ),
    scrollY: window.scrollY,
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
