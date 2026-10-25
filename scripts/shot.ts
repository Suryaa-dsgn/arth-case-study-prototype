// Dev helper: screenshot a route and report layout checks.
// Usage: node --experimental-strip-types scripts/shot.ts <url> <out.png> [width] [height] [fullPage]
import { chromium } from "playwright";

const [url = "http://localhost:5174/", out = "exports/shot.png", w = "1440", h = "900", full = ""] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const report = await page.evaluate(() => {
  const doc = document.documentElement;
  const small: string[] = [];
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
    if (own && parseFloat(cs.fontSize) < 14 && !cs.fontFamily.includes("Mono"))
      small.push(`${cs.fontSize} "${el.textContent!.trim().slice(0, 30)}"`);
  });
  const fold = [...document.querySelectorAll("section, header, dl")].map((s) => {
    const r = s.getBoundingClientRect();
    return `${s.tagName} ${(s.querySelector("h1,h2")?.textContent ?? s.textContent ?? "").trim().slice(0, 26)}: ${Math.round(r.top)}-${Math.round(r.bottom)}`;
  });
  return {
    hScroll: doc.scrollWidth > doc.clientWidth,
    pageHeight: doc.scrollHeight,
    fonts: [...document.fonts].map((f) => `${f.family}:${f.status}`),
    small,
    fold,
  };
});
console.log(JSON.stringify(report, null, 1));
await page.screenshot({ path: out, fullPage: full === "full" });
await browser.close();
