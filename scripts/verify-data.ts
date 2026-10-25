// Asserts the approved Part D values in the data files, then (with a url) in the rendered app.
// Usage: node --experimental-strip-types scripts/verify-data.ts [baseUrl]
import { chromium } from "playwright";
import { areas } from "../src/data/areas.ts";
import { kpis } from "../src/data/kpis.ts";
import { slas } from "../src/data/standards.ts";

const expected: Record<string, string> = {
  "01": "116",
  "02": "30",
  "03": "27",
  "04": "95.18%",
  "05": "₹55,26,140",
  "06": "₹14,36,923.85",
  "07": "30.00%",
  "08": "55",
  "09": "₹7,61,400",
  "10": "40 of 42",
  "11": "16",
};
const bars: Record<string, [number, number]> = {
  "02": [30, 116],
  "03": [1, 27],
  "04": [95.18, 100],
  "07": [108, 360],
  "10": [40, 42],
};
const grouping: Record<string, string[]> = {
  compliance: ["01", "02", "03"],
  financial: ["04", "05", "06"],
  service: ["07", "08", "09"],
  client: ["10", "11"],
};

const errors: string[] = [];
if (kpis.length !== 11) errors.push(`expected 11 KPIs, found ${kpis.length}`);
for (const k of kpis) {
  if (k.displayValue !== expected[k.id]) errors.push(`KPI ${k.id}: "${k.displayValue}" != "${expected[k.id]}"`);
  const b = bars[k.id];
  if (b && (!k.bar || k.bar.numerator !== b[0] || k.bar.denominator !== b[1])) errors.push(`KPI ${k.id}: bar mismatch`);
  if (!b && k.bar) errors.push(`KPI ${k.id}: unexpected bar`);
  for (const f of ["purpose", "definition", "source", "owner", "review", "target", "trigger", "response", "limitation", "caveat"] as const)
    if (!k[f]) errors.push(`KPI ${k.id}: missing ${f}`);
}
for (const a of areas) {
  const ids = kpis.filter((k) => k.area === a.id).map((k) => k.id).sort();
  if (ids.join() !== grouping[a.id].join()) errors.push(`area ${a.id}: KPIs ${ids} != ${grouping[a.id]}`);
}
if (slas.length !== 8) errors.push(`expected 8 SLAs, found ${slas.length}`);

const base = process.argv[2];
if (base) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const a of areas) {
    await page.goto(`${base}#/${a.route}`, { waitUntil: "networkidle" });
    const rendered = await page.$$eval("main [data-kpi]", (els) =>
      els.map((el) => ({ id: (el as HTMLElement).dataset.kpi!, value: el.querySelector("[data-kpi-value]")?.textContent ?? "" })),
    );
    for (const id of grouping[a.id]) {
      const r = rendered.find((x) => x.id === id);
      if (!r) errors.push(`DOM ${a.route}: KPI ${id} missing`);
      else if (r.value !== expected[id]) errors.push(`DOM ${a.route}: KPI ${id} "${r.value}" != "${expected[id]}"`);
    }
    const pcts = await page.$$eval("main [data-bar-pct]", (els) => els.map((e) => Number((e as HTMLElement).dataset.barPct)));
    for (const p of pcts)
      if (!Object.values(bars).some(([n, d]) => Math.abs((n / d) * 100 - p) < 0.001))
        errors.push(`DOM ${a.route}: bar ${p}% not a verified ratio`);
    const grids = await page.$$eval("main [data-grid-filled]", (els) =>
      els.map((e) => `${(e as HTMLElement).dataset.gridFilled}/${(e as HTMLElement).dataset.gridTotal}/${e.children.length}`),
    );
    for (const g of grids) if (!["108/360/360", "40/42/42"].includes(g)) errors.push(`DOM ${a.route}: grid ${g} invalid`);
  }
  await page.goto(`${base}#/`, { waitUntil: "networkidle" });
  const overview = await page.locator("main").innerText();
  for (const v of Object.values(expected)) if (!overview.includes(v)) errors.push(`DOM overview: ${v} missing`);
  await browser.close();
}

if (errors.length) {
  console.error("verify-data FAILED\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(`verify-data passed: 11 values, grouping, bars and 8 SLAs match Part D${base ? ", in data and rendered app" : ""}.`);
