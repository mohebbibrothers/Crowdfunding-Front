import { chromium } from "playwright-core";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://127.0.0.1:3013/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(600);
const probe = async (label) => {
  const r = await p.evaluate(() => {
    const el = document.querySelector(".scroll-progress");
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      transform: cs.transform,
      origin: cs.transformOrigin,
      anim: cs.animationName,
      timeline: cs.animationTimeline,
      w: Math.round(rect.width),
      h: Math.round(rect.height),
      y: Math.round(rect.top),
      bg: cs.backgroundImage.slice(0, 60),
    };
  });
  console.log(label, JSON.stringify(r));
};
await probe("top");
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
await p.waitForTimeout(400);
await probe("mid");
await b.close();
