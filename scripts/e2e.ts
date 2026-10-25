// Phase 4 verification: routes, drawers, back/forward, keyboard, tooltips, axe,
// integrity strings, status colours, responsive layout, dead controls, reduced motion.
// Usage: node --experimental-strip-types scripts/e2e.ts <baseUrl>
import AxeBuilder from "@axe-core/playwright";
import { chromium, type Page } from "playwright";
import { kpis } from "../src/data/kpis.ts";

const base = process.argv[2] ?? "http://localhost:5174/";
const routes = ["", "compliance", "financial", "service", "client"];
const results: { check: string; ok: boolean; detail?: string }[] = [];
const record = (check: string, ok: boolean, detail?: string) => results.push({ check, ok, detail });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const consoleErrors: string[] = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(e.message));

// A hash-only change is a same-document navigation, so load a blank page first for a fresh state.
const open = async (p: Page, hash: string) => {
  await p.goto("about:blank");
  await p.goto(`${base}#/${hash}`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
};

// Integrity: forbidden words may appear only inside approved qualifier phrases.
const allowed = [
  /not confirmed arrears/gi,
  /not automatically arrears/gi,
  /without inferring arrears/gi,
  /is not automatically confirmed arrears/gi,
  /not proof of unauthorized spend/gi,
  /not automatically unauthorized expenditure/gi,
  /resolution is tracked separately/gi,
  /resolution tracked separately/gi,
  /distinct from resolution/gi,
  /not automatically proven financial loss/gi,
  /does not (itself )?mean at risk/gi,
];
function integrity(text: string) {
  const issues: string[] = [];
  let t = text;
  for (const r of allowed) t = t.replace(r, "");
  for (const w of ["arrears", "unauthorized", "resolution", "loss", "at risk", "leakage"])
    if (t.toLowerCase().includes(w)) issues.push(`"${w}" outside a qualifier`);
  if (/\b162\b/.test(text)) issues.push("162 (30 + 132) appears");
  if (text.includes("—")) issues.push("em dash");
  for (const w of ["NaN", "undefined", "TODO", "lorem", "Lorem", "placeholder"]) if (text.includes(w)) issues.push(`"${w}" visible`);
  return issues;
}

// 1. Five destinations
for (const r of routes) {
  await open(page, r);
  const h1 = await page.locator("main h1").innerText();
  const current = await page.locator('nav[aria-label="Primary"] a[aria-current="page"]').first().innerText();
  record(`route #/${r} renders`, h1.length > 0, `${h1} · nav: ${current}`);
  const text = await page.locator("body").innerText();
  const issues = integrity(text);
  record(`route #/${r} integrity strings`, issues.length === 0, issues.join("; "));
  const axe = await new AxeBuilder({ page }).analyze();
  const bad = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  record(`route #/${r} axe serious/critical`, bad.length === 0, bad.map((v) => `${v.id} (${v.nodes.length})`).join(", "));
  const colours = await page.evaluate(() => {
    const hits = new Set<string>();
    document.querySelectorAll("body *").forEach((el) => {
      const cs = getComputedStyle(el);
      for (const c of [cs.color, cs.backgroundColor, cs.borderTopColor]) {
        const m = c.match(/rgba?\((\d+), (\d+), (\d+)/);
        if (!m) continue;
        const [r, g, b] = m.slice(1).map(Number);
        if (r > g + 40 && r > b + 40) hits.add(c); // red or amber family
      }
    });
    return [...hits];
  });
  record(`route #/${r} no red/amber status colour`, colours.length === 0, colours.join(", "));
}

// 2. All 11 drawers: value, definition, limitation; prev/next sequence
for (const k of kpis) {
  await open(page, `?kpi=${k.id}`);
  const dlg = page.getByRole("dialog");
  const t = await dlg.innerText();
  const fields = {
    title: k.title,
    "historical baseline": "Historical baseline",
    definition: k.definition,
    source: k.source,
    owner: k.owner,
    review: k.review,
    target: k.target,
    trigger: k.trigger,
    response: k.response,
    limitation: k.limitation,
    caveat: k.caveat,
  };
  const missing = Object.entries(fields).filter(([, v]) => !t.includes(v)).map(([f]) => f);
  const ok = missing.length === 0;
  const value = await dlg.locator("[data-drawer-value]").innerText();
  record(`drawer KPI ${k.id} shows all fields`, ok && value === k.displayValue, ok ? value : `missing: ${missing.join(", ")}`);
}
await open(page, "?kpi=01");
const seen: string[] = [];
for (let i = 0; i < 11; i++) {
  const title = kpis[i].title;
  await page.getByRole("dialog").locator("h2", { hasText: title }).waitFor({ timeout: 3000 }).catch(() => {});
  seen.push(await page.getByRole("dialog").locator("h2").first().innerText());
  if (i < 10) await page.getByRole("button", { name: /^Next:/ }).click();
}
record("drawer next steps 1 to 11 in Part D order", seen.join("|") === kpis.map((k) => k.title).join("|"));
record("drawer next disabled on KPI 11", await page.getByRole("button", { name: "No next KPI" }).isDisabled());

// 3. Overview → drawer → back/forward → domain
await open(page, "");
const firstDetail = page.getByRole("link", { name: "View KPI detail" }).first();
await firstDetail.click();
const drawerUp = () => page.getByRole("dialog").waitFor({ state: "visible", timeout: 3000 }).then(() => true, () => false);
const drawerGone = () => page.getByRole("dialog").waitFor({ state: "detached", timeout: 3000 }).then(() => true, () => false);
record("queue opens drawer", await drawerUp());
await page.goBack();
record("back closes drawer", await drawerGone());
await page.goForward();
record("forward reopens drawer", await drawerUp());
await page.keyboard.press("Escape");
record("Esc closes drawer", await drawerGone());
await open(page, "");
await page.getByRole("link", { name: "View KPI detail" }).nth(1).focus();
await page.keyboard.press("Enter");
await drawerUp();
await page.keyboard.press("Escape");
await drawerGone();
record(
  "drawer close returns focus to its trigger",
  await page.evaluate(() => document.activeElement?.textContent === "View KPI detail"),
  await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 60) ?? ""),
);
await open(page, "?kpi=05");
await page.getByRole("link", { name: /Go to Financial Operations/ }).last().click();
record("drawer 'Go to area' navigates", page.url().endsWith("#/financial"));

// 3b. Principal PM review checks
const kpi2 = "Overdue obligations without assigned owners";
const oldKpi2 = "Active obligations without owners";
for (const r of ["", "compliance"]) {
  await open(page, r);
  const t = await page.locator("body").innerText();
  record(`KPI 2 label on #/${r}`, t.includes(kpi2) && !t.includes(oldKpi2));
}
await open(page, "");
await page.getByRole("button", { name: /All KPIs · definitions and cadence/ }).click();
record("KPI 2 label in index table", (await page.locator("#kpi-index").innerText()).includes(kpi2));
await open(page, "compliance?kpi=02");
const d2 = await page.getByRole("dialog").innerText();
record(
  "KPI 2 drawer separates 30 from 132",
  d2.includes("Two different populations") &&
    d2.includes("unassigned subset of KPI 1") &&
    d2.includes("not validated active obligations") &&
    d2.includes("Never added to 30") &&
    !/162/.test(d2),
);
record("KPI 2 old label only as Part D reference", d2.split(oldKpi2).length - 1 === 1 && d2.includes(`Part D specification title: ${oldKpi2}`));

await open(page, "");
const queueTargets = ["01", "05", "07", "10"];
for (let i = 0; i < 4; i++) {
  await open(page, "");
  await page.getByRole("link", { name: "View KPI detail" }).nth(i).click();
  await drawerUp();
  const head = await page.getByRole("dialog").locator("h2").first().innerText();
  const want = kpis.find((k) => k.id === queueTargets[i])!.title;
  record(`View KPI detail #${i + 1} opens KPI ${queueTargets[i]}`, head === want, head);
}

await open(page, "");
const strips = await page.$$eval("[data-action]", (els) =>
  els.map((e) => ({ text: e.textContent ?? "", interactive: e.querySelectorAll("a,button,[tabindex]").length })),
);
const labels = ["Assign recovery owner", "Investigate reconciliation", "Review response delays", "Restore client updates"];
record(
  "four proposed-action strips with approved labels",
  strips.length === 4 && labels.every((l, i) => strips[i].text.includes(l)) && strips.every((x) => x.text.startsWith("Proposed action")),
);
record("action strips are not controls", strips.every((x) => x.interactive === 0));

for (const [name, route] of [
  ["Open Compliance", "compliance"],
  ["Open Financial", "financial"],
  ["Open Service", "service"],
  ["Open Client", "client"],
]) {
  await open(page, "");
  await page.getByRole("link", { name, exact: true }).click();
  record(`operating-area link "${name}"`, page.url().endsWith(`#/${route}`));
}
for (const [name, route] of [
  ["Go to Compliance", "compliance"],
  ["Go to Financial Operations", "financial"],
  ["Go to Service Operations", "service"],
  ["Go to Client Experience", "client"],
]) {
  await open(page, "");
  await page.getByRole("link", { name, exact: true }).first().click();
  record(`queue area link "${name}"`, page.url().endsWith(`#/${route}`));
}
await open(page, "");
for (const [name, route] of [
  ["Compliance", "compliance"],
  ["Financial Operations", "financial"],
  ["Service Operations", "service"],
  ["Client Experience", "client"],
  ["Overview", ""],
]) {
  await page.locator('nav[aria-label="Primary"]').getByRole("link", { name, exact: true }).click();
  const wantH1 = name === "Overview" ? "Operations" : name;
  await page.locator("main h1", { hasText: wantH1 }).waitFor({ timeout: 3000 }).catch(() => {});
  const h1 = await page.locator("main h1").innerText();
  record(`sidebar "${name}"`, page.url().endsWith(`#/${route}`) && h1.includes(name === "Overview" ? "Operations" : name), h1);
}

// 4. Keyboard: focus ring, focus return, tooltip on focus, panels
await open(page, "");
await page.keyboard.press("Tab");
const skip = await page.evaluate(() => document.activeElement?.textContent);
record("first Tab reaches skip link", skip === "Skip to content");
let missingRing = 0;
const ringMisses: string[] = [];
let tabbed = 0;
for (let i = 0; i < 40; i++) {
  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return "end";
    const cs = getComputedStyle(el);
    return cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2 ? "ok" : `${el.tagName}:${el.textContent?.slice(0, 20)}`;
  });
  if (ring === "end") break; // tab order wrapped past the last control
  tabbed++;
  if (ring !== "ok") {
    missingRing++;
    ringMisses.push(ring);
  }
}
record("visible focus ring on every tab stop", missingRing === 0, `${tabbed - missingRing}/${tabbed} ${ringMisses.join(", ")}`);
const howTo = page.getByRole("button", { name: "How to read this" });
await howTo.focus();
await page.keyboard.press("Enter");
record("How to read this opens dialog", await page.getByRole("dialog", { name: "How to read this dashboard" }).isVisible());
await page.keyboard.press("Escape");
await page.waitForTimeout(250);
record(
  "dialog returns focus to trigger",
  await page.evaluate(() => document.activeElement?.textContent?.includes("How to read this") ?? false),
);
await page.getByRole("button", { name: /Review cadence and standards/ }).click();
const cad = await page.getByRole("dialog").innerText();
record("cadence panel lists 5 forums and 8 SLAs", cad.includes("Expansion decision") && cad.includes("Critical application failure"));
await page.keyboard.press("Escape");
await page.waitForTimeout(250);
await open(page, "compliance");
await page.getByRole("button", { name: "Outcome" }).first().focus();
await page.waitForTimeout(400);
record("tooltip opens on keyboard focus", (await page.getByRole("tooltip").count()) > 0);
await open(page, "service");
await page.getByRole("button", { name: "First-response SLA" }).hover();
await page.waitForTimeout(400);
record("tooltip opens on hover", (await page.getByRole("tooltip").count()) > 0);

// 5. KPI index filters
await open(page, "");
await page.getByRole("button", { name: /All KPIs · definitions and cadence/ }).click();
const countRows = () => page.locator("#kpi-index tbody tr").count();
record("index shows 11 rows", (await countRows()) === 11);
await page.locator("#kpi-index").getByRole("button", { name: "Monthly", exact: true }).click();
record("filter Monthly = KPIs 4, 5, 6, 9", (await countRows()) === 4);
await page.locator("#kpi-index").getByRole("button", { name: "Client", exact: true }).click();
record("empty filter result shows message", (await page.locator("#kpi-index").innerText()).includes("No KPIs match these filters."));

// 6. Dead controls: every button and link on each route does something
for (const r of routes) {
  await open(page, r);
  const hrefs = await page.$$eval("a", (as) => as.map((a) => a.getAttribute("href") ?? ""));
  const badLinks = hrefs.filter((h) => !/^#(\/|main)/.test(h));
  record(`route #/${r} links all route somewhere`, badLinks.length === 0, badLinks.join(", "));
  const names = await page.$$eval("main button:not([data-term]), body > div button:not([data-term])", (bs) => bs.map((b) => b.getAttribute("aria-label") || b.textContent || ""));
  const dead: string[] = [];
  for (let i = 0; i < names.length; i++) {
    await open(page, r);
    await page.evaluate(() => sessionStorage.removeItem("arth-disclaimer"));
    await open(page, r);
    const btn = page.locator("main button:not([data-term]), body > div button:not([data-term])").nth(i);
    if (!(await btn.isVisible()) || (await btn.isDisabled())) continue;
    const before = await page.evaluate(() => document.body.innerHTML.length + "|" + location.hash);
    await btn.click();
    await page.waitForTimeout(150);
    const after = await page.evaluate(() => document.body.innerHTML.length + "|" + location.hash);
    if (before === after) dead.push(names[i].trim().slice(0, 30));
  }
  record(`route #/${r} no dead buttons (${names.length})`, dead.length === 0, dead.join(", "));
}

// 7. Responsive
for (const [w, h] of [
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [390, 844],
]) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: h });
  for (const r of routes) {
    await open(p, r);
    const over = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const out: string[] = [];
      if (document.documentElement.scrollWidth > vw) out.push("page h-scroll");
      document.querySelectorAll("main *").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const scroller = el.closest(".overflow-x-auto");
        if (!scroller && rect.width > 0 && rect.right > vw + 1) out.push(`${el.tagName} overflows`);
      });
      return out.slice(0, 3);
    });
    record(`${w}x${h} #/${r} layout`, over.length === 0, over.join("; "));
  }
  if (w === 390) {
    await open(p, "");
    await p.getByRole("button", { name: "Open navigation" }).click();
    await p.getByRole("dialog").getByRole("link", { name: "Client Experience" }).click();
    record("390 menu sheet navigates", p.url().endsWith("#/client") && (await p.getByRole("dialog").count()) === 0);
  }
  await p.close();
}

// 8. Reduced motion
const rm = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
await rm.goto(`${base}#/?kpi=07`, { waitUntil: "networkidle" });
const anim = await rm.getByRole("dialog").evaluate((el) => getComputedStyle(el).animationName);
record("reduced motion: drawer has no animation", anim === "none", anim);

record("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
await browser.close();

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.check}${r.detail ? `  [${r.detail}]` : ""}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
