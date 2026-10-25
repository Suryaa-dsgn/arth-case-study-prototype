# Design rationale

## The question it answers

How can Arth's founder and operations leads understand business health, identify deteriorating operations and decide what requires intervention? The prototype is built for the weekly founder operating review in Part D: about 30 minutes, all 11 KPIs, each decision logged with an owner and a due date.

## Founder decisions it supports

| Decision | Where it is answered |
|---|---|
| Where to intervene this week | "Needs founder attention", the hero of the Overview: four ranked findings, one per area |
| Who owns it | The accountable role on every queue item, area row, area page and drawer |
| Is this a fact or a proposal | VERIFIED and PROPOSED badges wherever values, targets, triggers, responses, owners and cadences appear, plus the "How to read this" panel |
| What Part D proposes doing next | "Proposed response" on every queue item and KPI panel; the full "Response when deteriorating", trigger and related SLA in the drawer |
| What a number does and does not mean | The caveat under every value, inline markers such as "Not confirmed arrears", and the full definition and data limitation one click away |

## Why the queue is ordered this way

It follows the order Part D section 1 gives for the operating view: compliance exposure, money requiring reconciliation, unresolved service work, client communication risk. That order also reflects Part D's priority for the Compliance Obligation Control MVP. The queue is not a severity score, and it never claims a threshold was crossed: triggers are proposals and have not been applied to the historical values.

## Why no status colours and no trends

No thresholds are approved, so colouring a value red or green would invent a judgment Part D does not make. Only one validated snapshot exists, so any trend, delta or sparkline would be fabricated. Hierarchy comes from position, size and weight instead: one hero per page, values as the loudest element, caveats always one line below.

## Why these charts

| KPI | Chart | Why |
|---|---|---|
| 1 + 2 | One bar: 30 within 116, with 132 in a separate note | Shows the relationship Part D insists on, and keeps the different population visibly apart |
| 3 | 1 of 27 unassigned | Separates the ownership gap from the deadline queue without implying risk |
| 4 | Progress to 100% | A ratio reads best as part of a whole; no target line, because 98% is only proposed |
| 7 | 360 dots, 108 filled | Makes the denominator tangible and keeps the label "first response" |
| 10 | 42 squares, 40 filled | The near-total share is the point; the caption keeps 30 days as a proposed interval |

Money values (KPIs 5, 6, 9) and plain counts (8, 11) get no chart: there is no verified denominator to show, and KPI 11's denominator is not stated in Part D.

## Progressive disclosure

The Overview carries the decision layer. Area pages carry each KPI in context with its proposed standards. The drawer carries the full Part D specification. Tooltips define terms only and never hold the only copy of a caveat.

## Brand

Colours, fonts and details come from arthproject.com's own CSS and the company profile: deep green `#19471A`, lime `#CCEC78` used sparingly, warm ivory, Geist, the lowercase wordmark with the supplied mark, and the lime highlighter band on one word. Photography and illustration are left out because an operations tool needs evidence, not atmosphere.

## Deliberately left out

Action buttons (send, assign, approve, resolve), record-level views, time series, benchmarks, per-property or per-city breakdowns, derived numbers, a search box, user accounts and notifications. Each would either need data the case does not provide or imply a product that has not been built.

## Open item

The portfolio context strip shows only the snapshot date, period and states from the brief. Part A's validated portfolio figures (properties, owners, occupancy, client concentration) belong there once supplied, in `src/data/portfolio.ts`.
