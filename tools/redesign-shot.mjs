import { chromium } from "playwright-core";
const BASE = "http://127.0.0.1:3016/";
const b = await chromium.launch();

const widths = [1920, 1440, 1280, 1024, 768, 390, 360];
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, locale: "fa-IR" });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 70)));
  p.on("console", (m) => {
    if (m.type() === "error") errs.push(m.text().slice(0, 70));
  });
  await p.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(900);
  const m = await p.evaluate(() => {
    const d = document.documentElement;
    const wide = [...document.querySelectorAll("*")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > d.clientWidth + 1 || r.left < -1);
      })
      .slice(0, 6)
      .map(
        (el) =>
          `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 46)} L${Math.round(el.getBoundingClientRect().left)} R${Math.round(el.getBoundingClientRect().right)}`,
      );
    return { sw: d.scrollWidth, cw: d.clientWidth, h: d.scrollHeight, wide };
  });
  console.log(
    `[${w}] overflow=${m.sw > m.cw ? "YES " + m.sw + "/" + m.cw : "no"} h=${m.h} ${m.wide.length ? JSON.stringify(m.wide) : ""} ${errs.length ? JSON.stringify([...new Set(errs)].slice(0, 3)) : ""}`,
  );
  await ctx.close();
}
await b.close();
