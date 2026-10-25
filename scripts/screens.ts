// Captures review screenshots. Usage: node --experimental-strip-types scripts/screens.ts <baseUrl> <prefix> [scale]
import { chromium } from "playwright";

const [base = "http://localhost:4174/", prefix = "exports/checkpoint-b", scale = "1"] = process.argv.slice(2);
const shots: { name: string; hash: string; w: number; h: number; full?: boolean }[] = [
  { name: "overview-1440x810", hash: "", w: 1440, h: 810 },
  { name: "compliance-1440", hash: "compliance", w: 1440, h: 900, full: true },
  { name: "drawer-kpi05-1440", hash: "financial?kpi=05", w: 1440, h: 900 },
  { name: "overview-768", hash: "", w: 768, h: 1024, full: true },
  { name: "overview-390", hash: "", w: 390, h: 844, full: true },
];
const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: Number(scale) });
  await page.goto(`${base}#/${s.hash}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400); // let the drawer entrance finish
  await page.screenshot({ path: `${prefix}-${s.name}.png`, fullPage: Boolean(s.full) });
  await page.close();
}
await browser.close();
console.log("screens written");
