# Product structure (Phase 1)

Source of truth: Part D (`Arth_Part_D_Operating_Dashboard_and_90_Day_Plan_Final.docx`). This note confirms the structure in the build prompt, section 5, and flags only real problems. All 11 values in the prompt were re-checked against Part D section 3: no discrepancies. Rupee grouping differs only in format (Part D Western, prototype Indian), as approved.

## Users and the decisions they make

| User | Context | Decisions the dashboard must support |
|---|---|---|
| Founder (primary) | Weekly founder operating review, about 30 min, 1440px laptop | Where to intervene this week · which lead owns it · is this a measured fact or a proposed standard · what Part D proposes doing next |
| Compliance Lead | Daily monitoring, weekly review | Overdue and unowned obligations, the near-term deadline queue, which proposed SLA applies |
| Finance Lead | Weekly exceptions, monthly close | What needs reconciliation before anyone draws a financial conclusion |
| Service Operations Lead | Daily exceptions, weekly review | First-response performance, aged tickets, vendor approval evidence |
| Client Operations Lead | Daily exceptions, weekly review | Stale client communication, cases stuck in a stage |

## Navigation

Five destinations, hash routes, no router library:

| Destination | Route | Contents |
|---|---|---|
| Overview | `#/` | Founder command center |
| Compliance | `#/compliance` | KPIs 1, 2, 3 |
| Financial Operations | `#/financial` | KPIs 5 (lead), 4, 6 |
| Service Operations | `#/service` | KPIs 7 (lead), 8, 9 |
| Client Experience | `#/client` | KPIs 10 (lead), 11 |

An open drawer adds `?kpi=NN` to the current route, for example `#/financial?kpi=05`. Back and forward restore both the destination and the drawer.

Responsive navigation (decision):
- ≥1024px: left sidebar, 248px.
- 768–1023px: top bar with the wordmark and the five destinations as a horizontal tab row, labels visible. I chose this over an icon rail because the area names are the navigation, and icons alone would force tooltips for every move.
- <768px: top bar with a menu button that opens a sheet listing the five destinations.

## Overview hierarchy (top to bottom)

1. Disclaimer bar (all pages).
2. Page header: "Operations overview" · "Historical snapshot · 19 September 2026" · "How to read this".
3. Portfolio context strip (blocked on Part A, see open items).
4. **Needs founder attention**: the hero, four ranked items.
5. Side column: Measured vs proposed explainer, Weekly founder review card.
6. Domain summaries: four compact rows carrying all 11 values.
7. All 11 KPIs index, collapsed, with filters.

Above the fold at 1440×810: items 1 to 5.

## Attention queue: KPI-to-action mapping

Order follows Part D section 1, which names the operating view in this order: "compliance exposure, money requiring reconciliation, unresolved service work and client communication risk".

| Rank | Area | KPI shown | Finding | Owner | Proposed response (short) | Drawer opens |
|---|---|---|---|---|---|---|
| 1 | Compliance | 1, with 2 as context | 116 overdue compliance obligations · 30 of them have no owner | Compliance Lead | Assign recovery owner and date; escalate blockers. | KPI 1 |
| 2 | Financial Operations | 5 | ₹55,26,140 rent reconciliation gap to investigate | Finance Lead | Trace property-level entries, timing and duplicates. | KPI 5 |
| 3 | Service Operations | 7 | 30.00% of tickets missed first-response SLA · 108 of 360 | Service Operations Lead | Review triage and staffing; correct timestamp gaps. | KPI 7 |
| 4 | Client Experience | 10 | 40 of 42 open liaisoning cases with stale or missing client updates | Client Operations Lead | Send update; record next commitment. | KPI 10 |

The queue never says a threshold, trigger or SLA was crossed. Triggers are proposals and have not been applied to historical data.

## All KPI-to-action relationships

| KPI | Owner | Response when deteriorating (Part D) | Related proposed SLA |
|---|---|---|---|
| 1 | Compliance Lead | Confirm statutory rule, assign recovery owner and date, escalate legal/compliance blockers | 3 Missed statutory deadline |
| 2 | Compliance Lead | Resolve owner mapping and escalate unresolved allocations | 1 Compliance assignment |
| 3 | Compliance Lead | Assign owner; prioritize seven-day window; request missing evidence | 2 Approaching statutory deadline |
| 4 | Finance Lead | Review due/received mapping, collections follow-up and exceptions | none |
| 5 | Finance Lead | Trace property-level entries, timing and duplicates; record disposition | none |
| 6 | Finance Lead | Validate contractual basis, fee period and ledger postings | none |
| 7 | Service Operations Lead | Review triage and staffing, assign recovery actions, correct timestamp gaps | 4 Service first response |
| 8 | Service Operations Lead | Escalate blocker, assign next step and client update where applicable | 5 Aged service tickets |
| 9 | Service Operations Lead (Finance supports) | Locate authorization trail, resolve control gap and document decision | none |
| 10 | Client Operations Lead | Send context-appropriate update, record next commitment, escalate blocker | 6 Client communication |
| 11 | Client Operations Lead | Escalate stage blocker and agree next milestone/client communication | none |

## Essential interactions

| # | Interaction | Where | Real effect |
|---|---|---|---|
| 1 | Switch destination | Sidebar, tab row, mobile sheet | Route change |
| 2 | Open KPI detail | Queue items, domain rows, domain panels, index rows | Drawer with every Part D field |
| 3 | Prev/next KPI | Drawer | Steps through KPIs 1 to 11 in Part D order |
| 4 | Go to area | Queue items, domain rows, drawer | Route change |
| 5 | How to read this | Overview header | Measurement dialog |
| 6 | Review cadence and standards | Weekly review card | Cadence dialog: forums plus 8 SLAs |
| 7 | Filter KPI index | Overview index | Filters by area, classification, cadence |
| 8 | Show chart as table | Each chart | Toggles an accessible numeric table |
| 9 | Term tooltips | Badges and terms | Short Part D-derived definitions, on focus and hover |
| 10 | Dismiss disclaimer | Disclaimer bar | Hidden for the session; a short "Prototype" label stays in the nav |

No action buttons for sending, assigning, approving or resolving. Responses are read-only proposals.

## Problems flagged (resolved as noted unless marked open)

1. **Open: portfolio context strip.** Part A's validated portfolio figures are not in the available sources. The strip ships with brief-stated scope only (snapshot, period, states). `TODO(part-a)` in `src/data/portfolio.ts` names the fields to add: properties, owners, states, occupancy, client concentration.
2. **Cadence filter needs a parsing rule.** KPI 1's Review reads "Daily; weekly founder review". The weekly founder review covers all 11 KPIs, so counting it would make every KPI "Weekly". Rule: filter on each KPI's operational cadences and exclude the universal founder review. Result: Daily = 1, 2, 3, 7, 10 · Weekly = 4, 5, 7, 8, 9, 10, 11 · Monthly = 4, 5, 6, 9 (from "monthly close"). Shown in the drawer as Part D's full Review text.
3. **Remainder label in the 116 → 30 chart.** The prompt suggests "86 with an owner". Part D only says 30 are the unassigned subset of 116, so the remainder's owner field is populated, but not necessarily valid. Resolved: label it "86 with an owner recorded", which is arithmetic within one stated population and claims nothing about owner quality.
4. **Domain "Proposed review" line.** Derived from the same parsing as point 2, e.g. Financial Operations: "Weekly exception review · monthly close". Wording uses Part D's own terms.
5. **KPI 9 owner note.** The Service Operations owner line carries "(KPI 9: Finance supports approval reconciliation)" on the domain page and in KPI 9's drawer; the Overview shows only "Service Operations Lead".
