import { chromium } from "playwright-core";

const BASE = process.env.AUDIT_URL || "http://127.0.0.1:3020/";
const browser = await chromium.launch();

const audit = async (width, height, dark) => {
  const ctx = await browser.newContext({
    viewport: { width, height },
    colorScheme: dark ? "dark" : "light",
    locale: "fa-IR",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 120)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text().slice(0, 120));
  });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1200);

  const report = await page.evaluate(() => {
    const out = {};
    const html = document.documentElement;

    // ── متادیتا ───────────────────────────────────────────────
    const meta = (sel, attr = "content") => document.querySelector(sel)?.getAttribute(attr) || null;
    out.meta = {
      lang: html.getAttribute("lang"),
      dir: html.getAttribute("dir"),
      title: document.title,
      titleLen: document.title.length,
      description: meta('meta[name="description"]')?.length || 0,
      canonical: meta('link[rel="canonical"]', "href"),
      ogTitle: meta('meta[property="og:title"]'),
      ogImage: meta('meta[property="og:image"]'),
      ogLocale: meta('meta[property="og:locale"]'),
      twitter: meta('meta[name="twitter:card"]'),
      themeColor: meta('meta[name="theme-color"]'),
      icons: [...document.querySelectorAll('link[rel*="icon"]')].map((l) => l.getAttribute("href")),
    };

    // ── ساختار ────────────────────────────────────────────────
    const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      lvl: +h.tagName[1],
      text: h.textContent.trim().slice(0, 40),
    }));
    let skips = [];
    for (let i = 1; i < heads.length; i++)
      if (heads[i].lvl - heads[i - 1].lvl > 1)
        skips.push(`h${heads[i - 1].lvl}→h${heads[i].lvl}: ${heads[i].text}`);
    out.structure = {
      h1: heads.filter((h) => h.lvl === 1).length,
      h2: heads.filter((h) => h.lvl === 2).map((h) => h.text),
      skips,
      landmarks: {
        header: document.querySelectorAll("header").length,
        main: document.querySelectorAll("main").length,
        footer: document.querySelectorAll("footer").length,
        nav: document.querySelectorAll("nav").length,
      },
      skipLink: !!document.querySelector('a[href^="#"][class*="sr-only"], a[href="#main"]'),
      sections: document.querySelectorAll("main section").length,
    };

    // ── تصاویر و نام دسترس‌پذیر ──────────────────────────────
    out.images = [...document.querySelectorAll("img")].map((i) => ({
      src: i.getAttribute("src")?.split("/").pop(),
      alt: i.getAttribute("alt"),
      w: Math.round(i.getBoundingClientRect().width),
    }));

    const name = (el) =>
      (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "")
        .trim()
        .slice(0, 40);

    out.interactive = { total: 0, unnamed: [], emptyHref: [], blank: [] };
    document.querySelectorAll("a,button").forEach((el) => {
      out.interactive.total++;
      if (!name(el) && !el.querySelector("svg[aria-label]"))
        out.interactive.unnamed.push(el.outerHTML.slice(0, 90));
      const href = el.getAttribute("href");
      if (el.tagName === "A" && (!href || href === "#")) out.interactive.emptyHref.push(name(el));
      if (
        el.getAttribute("target") === "_blank" &&
        !(el.getAttribute("rel") || "").includes("noopener")
      )
        out.interactive.blank.push(name(el) || el.getAttribute("href"));
    });

    // ── کنتراست (رنگ‌ها با نمونه‌گیری پیکسلی به sRGB تبدیل می‌شوند) ──
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const g2 = cv.getContext("2d", { willReadFrequently: true });
    const samp = (col) => {
      g2.clearRect(0, 0, 1, 1);
      g2.fillStyle = col;
      g2.fillRect(0, 0, 1, 1);
      const d = g2.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };
    const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
    const bgOf = (el) => {
      const stack = [];
      let n = el;
      while (n && stack.length < 40) {
        const c = samp(getComputedStyle(n).backgroundColor);
        if (c[3] > 0) {
          stack.push(c);
          if (c[3] >= 0.999) break;
        }
        n = n.parentElement;
      }
      let acc = [255, 255, 255, 1];
      for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc);
      return acc;
    };
    const lum = (c) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    const ratio = (a, b) => {
      const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };

    const seen = new Map();
    document.querySelectorAll("main *, header *, footer *").forEach((el) => {
      const hasText = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 1,
      );
      if (!hasText) return;
      if (el.closest('[aria-hidden="true"]')) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) return;
      const bg = bgOf(el);
      const fg = over(samp(cs.color), bg);
      const px = parseFloat(cs.fontSize);
      const bold = +cs.fontWeight >= 700;
      const large = px >= 24 || (px >= 18.66 && bold);
      const r = ratio(fg, bg);
      const hex = (c) =>
        "#" +
        c
          .slice(0, 3)
          .map((v) => Math.round(v).toString(16).padStart(2, "0"))
          .join("");
      const need = large ? 3 : 4.5;
      const key = cs.color + "|" + Math.round(px) + "|" + el.textContent.trim().slice(0, 18);
      if (r < need && !seen.has(key))
        seen.set(key, {
          text: el.textContent.trim().slice(0, 34),
          px: Math.round(px),
          ratio: +r.toFixed(2),
          need,
          color: hex(fg) + " on " + hex(bg),
        });
    });
    out.contrast = [...seen.values()];

    // ── اندازهٔ هدف لمسی (فقط موبایل) ────────────────────────
    out.smallTargets =
      innerWidth <= 480
        ? [...document.querySelectorAll("a,button,summary,input,select")]
            .map((el) => {
              const r = el.getBoundingClientRect();
              return {
                t: (el.getAttribute("aria-label") || el.textContent || el.tagName)
                  .trim()
                  .slice(0, 26),
                w: Math.round(r.width),
                h: Math.round(r.height),
              };
            })
            .filter((x) => x.h > 0 && !(x.w <= 2 && x.h <= 2) && (x.h < 24 || x.w < 24))
        : [];

    // ── سرریز افقی ────────────────────────────────────────────
    out.overflow = {
      scroll: html.scrollWidth,
      client: html.clientWidth,
      culprits:
        html.scrollWidth <= html.clientWidth + 1
          ? []
          : [...document.querySelectorAll("body *")]
              .filter((el) => el.getBoundingClientRect().right > html.clientWidth + 1)
              .slice(0, 5)
              .map((el) => el.tagName + "." + (el.className || "").toString().slice(0, 40)),
    };

    return out;
  });

  // ── فوکوس ──────────────────────────────────────────────────
  const focus = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const f = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const hasRing =
        (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
      return {
        tag: el.tagName,
        label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 24),
        ring: hasRing,
      };
    });
    if (f) focus.push(f);
  }
  report.focus = focus;
  report.errors = errors;
  await ctx.close();
  return report;
};

let problems = 0;
const line = (ok, msg) => {
  if (!ok) problems++;
  console.log(`${ok ? "✓" : "✗"} ${msg}`);
};

for (const [w, h, dark] of [
  [1440, 900, false],
  [390, 844, false],
  [1440, 900, true],
]) {
  const r = await audit(w, h, dark);
  console.log(`\n──── ${w}${dark ? " dark" : ""} ────`);

  line(
    r.errors.length === 0,
    `console errors: ${r.errors.length}${r.errors.length ? " → " + r.errors.join(" | ") : ""}`,
  );
  line(r.meta.lang === "fa" && r.meta.dir === "rtl", `lang/dir: ${r.meta.lang}/${r.meta.dir}`);
  line(r.meta.titleLen > 15 && r.meta.titleLen < 70, `title ${r.meta.titleLen} chars`);
  line(r.meta.description > 60, `description ${r.meta.description} chars`);
  line(!!r.meta.canonical, `canonical: ${r.meta.canonical}`);
  line(!!r.meta.ogImage, `og:image: ${String(r.meta.ogImage).split("/").pop()}`);
  line(!!r.meta.twitter, `twitter: ${r.meta.twitter}`);
  line(r.structure.h1 === 1, `h1 count: ${r.structure.h1}`);
  line(r.structure.skips.length === 0, `heading skips: ${r.structure.skips.join(", ") || "none"}`);
  line(
    r.structure.landmarks.main === 1 &&
      r.structure.landmarks.header === 1 &&
      r.structure.landmarks.footer === 1,
    `landmarks h/m/f: ${r.structure.landmarks.header}/${r.structure.landmarks.main}/${r.structure.landmarks.footer}`,
  );
  line(
    r.images.every((i) => i.alt !== null),
    `images with alt: ${r.images.filter((i) => i.alt !== null).length}/${r.images.length}`,
  );
  line(
    r.interactive.unnamed.length === 0,
    `unnamed controls: ${r.interactive.unnamed.length}${r.interactive.unnamed.length ? " → " + r.interactive.unnamed.join(" ; ") : ""}`,
  );
  line(
    r.interactive.emptyHref.length === 0,
    `empty hrefs: ${r.interactive.emptyHref.join(", ") || "none"}`,
  );
  line(
    r.interactive.blank.length === 0,
    `unsafe _blank: ${r.interactive.blank.join(", ") || "none"}`,
  );
  line(
    r.overflow.scroll <= r.overflow.client + 1,
    `overflow: ${r.overflow.scroll}/${r.overflow.client}${r.overflow.culprits.length ? " → " + r.overflow.culprits.join(" ; ") : ""}`,
  );
  line(
    r.focus.length > 0 && r.focus.every((f) => f.ring),
    `focus ring on ${r.focus.filter((f) => f.ring).length}/${r.focus.length} tab stops`,
  );
  line(
    r.contrast.length === 0,
    `contrast failures: ${r.contrast.length}${r.contrast.length ? "\n    → " + r.contrast.map((c) => `"${c.text}" ${c.px}px ${c.ratio}:1 < ${c.need} [${c.color}]`).join("\n    → ") : ""}`,
  );
  if (w <= 480)
    line(
      r.smallTargets.length === 0,
      `tap targets < 40px: ${r.smallTargets.length}${r.smallTargets.length ? " → " + r.smallTargets.map((t) => `${t.t} ${t.w}×${t.h}`).join(" ; ") : ""}`,
    );
}

await browser.close();
console.log(`\n${problems === 0 ? "ALL CLEAR" : problems + " issue(s)"}`);
