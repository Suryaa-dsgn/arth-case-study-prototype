# Visual system (Phase 2)

Brand evidence comes from `../arth-part-d-dashboard/notes/brand-findings.md` (arthproject.com `:root` CSS, meta theme-color, and the 12 decoded pages of the company profile). Values are observed in those sources, not official Arth brand tokens. Tokens live in `src/index.css` as CSS variables and are exposed to Tailwind through `@theme`. Components contain no raw hex values.

## Brand reading

| Aspect | What the sources show | What the dashboard takes |
|---|---|---|
| Colour | Deep natural green `#19471A`, lime `#CCEC78`, warm ivory `#F4F7EC`, white cards, olive-tinted ink | The same palette; lime kept scarce |
| Typography | Geist (UI), Hanken Grotesk (body), Geist Mono (details); lowercase headings in the PDF | Geist Sans everywhere, Geist Mono for KPI numbers, tags and metadata; sentence case for clarity in an ops tool |
| Whitespace | Generous margins, few elements per section, white cards on ivory | 24px panel padding, 20 to 24px section gaps, content capped at 1200px |
| Shape | 10 to 14px radius, 1px soft borders, near-zero shadow, dark green chips | 12px panels, 8px controls, 6px chips, borders only |
| Imagery | Aerial farmland photography, 3D lime illustrations, a blob mascot | None. An operations dashboard needs data, not decoration |
| Signature details | Lowercase "arth" + circular mark, lime highlighter band behind one word, kicker labels with a short rule, survey identifiers | Wordmark + supplied mark in the sidebar, one highlighted word in the Overview title, mono `KPI n` identifiers |
| Tone | Calm, assured, plain-spoken | Plain labels, no performance adjectives |

## Tokens

| Token | Value | Source | Use |
|---|---|---|---|
| `--bg` | `#F4F7EC` | site `--bg` | App background |
| `--surface` | `#FFFFFF` | site `--paper` | Panels, sidebar, drawer |
| `--surface-2` | `#ECF1DE` | site `--bg-2` | Active nav, disclaimer bar, chart tracks, caveat markers |
| `--line` | `#E4E9D4` | site `--line` | Hairlines, panel borders |
| `--line-strong` | `#D6DDC2` | site `--line-2` | Outlined controls and chips |
| `--ink` | `#16220C` | site `--ink` | Values, titles, body |
| `--ink-muted` | `#46583A` | site `--ink-soft` | Secondary text |
| `--green-900` | `#19471A` | theme-color, site `--deep` | Brand, icons, focus ring, dark card, chart fills |
| `--green-950` | `#0F2E10` | site `--deep-2` | Hover on dark controls |
| `--green-700` | `#2F7D34` | site `--green` | Links, kicker and identifier text |
| `--lime` | `#CCEC78` | site `--lime`, PDF sample | Accent (budget below) |
| `--lime-soft` | `#EEF8C9` | site `--lime-soft` | VERIFIED badge |

### Contrast (measured)
| Pair | Ratio | Use |
|---|---|---|
| ink on white | 16.56:1 | Body, values |
| ink-muted on white | 7.73:1 | Secondary text |
| ink-muted on ivory | 7.13:1 | Context strip |
| ink-muted on surface-2 | about 6.7:1 | Disclaimer bar, caveat markers |
| green-700 on white | 5.12:1 | Links, mono identifiers |
| green-900 on white | 10.73:1 | Icons, link hover |
| white on green-900 | 10.73:1 | Review card, prototype chip |
| ink on lime-soft | about 15:1 | VERIFIED badge |

## Colour semantics

- No red, amber or green performance status anywhere. No thresholds are approved, so nothing may read as good or bad by colour. Values are always ink.
- Meaning is carried by text badges: VERIFIED (lime-soft), PROPOSED (outlined), caveat markers (surface-2 plus an info icon).
- Lime budget: the highlight band on "overview" in the page title, the VERIFIED badge family, the active nav indicator and the lead-KPI accent rule. Lime is never used as text on a light background.
- Dark green fill: the Weekly founder review card, the "Case study prototype" chip, chart fills (Phase 3) and the skip link.
- One faint lime radial glow at the top right of the Overview header, as on the site hero. Used once.

## Type scale

| Role | Size / line | Weight | Where |
|---|---|---|---|
| Page title | 32 / 38, −0.02em | 600 | Overview, domain pages |
| Queue value | 32 / 36, −0.025em, tabular | 600 | Attention queue |
| Domain lead value | 56 / 60, tabular | 600 | Domain lead panel (Phase 3) |
| Medium value | 32 / 36, tabular | 600 | Domain secondary panels (Phase 3) |
| Summary value | 26 lead, 22 other / 32, tabular | 600 | Operating areas rows |
| Section title | 20 / 28 | 600 | Panel headers |
| Card title | 16 / 22 | 600 | Explainer, area names |
| Finding | 17 / 26 | 400 | Attention queue sentence |
| Body | 15 / 22 | 400 | Nav, drawer body |
| Small / meta | 14 / 20 | 400 to 500 | Caveats, owners, responses |
| Mono tags | 12 / 16, +0.06em, uppercase | 500 | Badges, `KPI n`, source labels: the only text below 14px |

Under 768px, the page title drops to 26/32, the queue value to 28/32 and the domain lead value to 44/48.

## Spacing and layout

- 4px base unit. Panel padding 24px (20px on mobile). Item padding 12 to 20px vertical. Section gap 20px on the Overview so the queue fits above the fold at 1440×810; 32px on domain pages.
- Desktop: 248px sidebar plus content capped at 1200px with 40px side padding. The Overview grid is the queue (fluid) beside a 316px side column.
- Above the fold at 1440×810 (verified): disclaimer, title, context strip, the complete attention queue and both side cards.

## Component hierarchy

1. **AppShell:** sidebar (wordmark, five destinations, snapshot, prototype chip), disclaimer bar, skip link.
2. **Overview:** PageHeader → ContextStrip → [AttentionQueue (AttentionItem ×4) | ExplainerCard + ReviewCard] → DomainSummaries (DomainRow ×4) → KpiIndexDisclosure.
3. **Phase 3:** DomainPage (lead KpiPanel, medium KpiPanels, StandardsTable), KpiDrawer, MeasurementPanel, CadencePanel, KpiIndexTable with FilterChips, PartToWholeBar, ProportionGrid, Tooltip.

Hierarchy rules: one hero per page (the queue on the Overview, the lead KPI on a domain page). Values are the loudest element in every item. Caveats are always visible one line below a value and are never hidden in a tooltip. Owner and proposed response sit in the same item as the value.

## Chart treatments (Phase 3)

- Part-to-whole bar: 8px tall, surface-2 track, green-900 fill, numeric label always visible ("30 of 116 overdue have no owner"). No axis, no target line, no animation.
- Proportion grid: 360 dots (24 × 15) for KPI 7, and 42 squares for KPI 10. Filled units are green-900, empty units line-strong. `role="img"` with the numeric label as its name, plus a "Show as table" toggle.
- KPI 4: a progress bar to 100 labelled "95.18% of rent due collected". The proposed 98% target appears only as text tagged PROPOSED.
- No charts for KPIs 5, 6, 8, 9 and 11.

## Responsive patterns

| Width | Navigation | Overview |
|---|---|---|
| ≥1280 | Sidebar | Queue and side column side by side; area rows in 3 columns (info, KPIs, link) |
| 1024–1279 | Sidebar | Side column drops below the queue; area rows stack the info above the KPIs |
| 768–1023 | Top bar with a horizontal tab row (Phase 3) | Single column |
| <768 | Top bar plus menu sheet (Phase 3) | Single column, KPI cells stack, item top rows wrap |

## Motion

The drawer and dialogs slide and fade at 200ms ease-out (Phase 3). Nothing else animates except the index disclosure caret. Everything is removed under `prefers-reduced-motion`.

## Icons

Phosphor, regular weight only, through `src/components/icons.tsx`. Two icons were added beyond the prompt's list: SquaresFour for the Overview nav item and CaretDown for the index disclosure. No other icon set, and no emoji.
