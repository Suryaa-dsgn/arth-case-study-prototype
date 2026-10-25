# arth · Operations dashboard prototype

An interactive, read-only dashboard prototype for the Arth PM case study (Part D). It uses the approved historical snapshot of 19 September 2026. It is a case-study concept, not Arth's live platform, and not the Compliance Obligation Control MVP.

## Run locally

Requires Node 22.6 or later (scripts use `--experimental-strip-types`).

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5174.

Production build and preview:

```bash
npm run build
```

```bash
npm run preview
```

Preview runs at http://localhost:4174.

## What is in it

- Overview: the founder attention queue, measured vs proposed explainer, weekly review card, all 11 KPIs by area, and a filterable KPI index.
- Four area pages: Compliance, Financial Operations, Service Operations, Client Experience.
- A KPI drawer with every Part D field, the related proposed SLA, and prev/next.
- "How to read this" and "Review cadence and standards" panels.

Links are shareable: `#/compliance`, `#/financial?kpi=05`.

## Verify

Start a server first (`npm run dev` or `npm run preview`), then:

```bash
npx playwright install chromium
```

```bash
npm run verify -- http://localhost:4174/
```

```bash
npm run e2e -- http://localhost:4174/
```

`verify` checks all 11 values, the area grouping, chart ratios and the 8 SLAs against Part D, in the data files and in the rendered app. `e2e` runs 111 checks: routes, sidebar and area links, every View KPI detail link, all drawer fields, KPI 2 wording, action strips, drawers, back/forward, keyboard focus, tooltips, axe accessibility, integrity wording, status colours, responsive layout at five widths, dead controls and reduced motion. The latest results are in `notes/verification.md`.

## Screenshots

```bash
npm run screenshots -- http://localhost:4174/
```

Writes 2880×1620 (16:9) PNGs to `exports/`: `overview-1440.png`, `compliance-1440.png`, `drawer-kpi05-1440.png`, `drawer-kpi02-1440.png`.

## Editing a value

All content lives in `src/data/`:

| File | Contents |
|---|---|
| `kpis.ts` | The 11 KPIs, every Part D field |
| `areas.ts` | Areas, owners, KPI order, attention queue |
| `standards.ts` | The 8 proposed SLAs |
| `cadence.ts` | The 5 proposed review forums |
| `portfolio.ts` | Context strip (Part A figures still to add) |
| `glossary.ts` | Tooltip definitions |

Edit the data file only, then run `npm run verify`. If Part D itself changes a value, update the `expected` map in `scripts/verify-data.ts` too.

## Deploy

See `DEPLOY.md`. Nothing has been deployed.

## Notes

- `notes/product-structure.md`: users, decisions, navigation, KPI-to-action mapping.
- `notes/visual-system.md`: tokens, type scale, colour semantics, chart rules, responsive patterns.
- `notes/design-rationale.md`: why it is designed this way.
- `notes/verification.md`: latest verification results.
