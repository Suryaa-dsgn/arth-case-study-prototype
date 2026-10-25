// Slide-ready screenshots: 1440×810 viewport (16:9) at deviceScaleFactor 2 → 2880×1620.
// Usage: node --experimental-strip-types scripts/presentation.ts [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4174/";
const shots = [
  { file: "exports/overview-1440.png", hash: "" },
  { file: "exports/compliance-1440.png", hash: "compliance" },
  { file: "exports/drawer-kpi05-1440.png", hash: "financial?kpi=05" },
  { file: "exports/drawer-kpi02-1440.png", hash: "compliance?kpi=02" },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  await page.goto(`${base}#/${s.hash}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const disclaimer = await page.getByText("Conceptual case-study prototype").isVisible();
  if (!disclaimer) throw new Error(`${s.file}: disclaimer not visible`);
  await page.screenshot({ path: s.file });
  await page.close();
  console.log(`wrote ${s.file}`);
}
await browser.close();
