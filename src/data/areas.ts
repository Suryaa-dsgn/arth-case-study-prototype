// Historical case-study data, 19 Sep 2026 snapshot, from Part D. Not live Arth data.
import type { AreaId } from "./kpis.ts";

export interface Area {
  id: AreaId;
  route: string;
  name: string;
  shortName: string;
  question: string;
  owner: string;
  ownerNote?: string;
  /** Proposed review line, in Part D's own cadence terms. */
  review: string;
  /** KPI ids in display order. The first is the lead KPI. */
  order: string[];
}

export const areas: Area[] = [
  {
    id: "compliance",
    route: "compliance",
    name: "Compliance",
    shortName: "Compliance",
    question: "Which statutory obligations need ownership, action or evidence now?",
    owner: "Compliance Lead",
    review: "Daily",
    order: ["01", "02", "03"],
  },
  {
    id: "financial",
    route: "financial",
    name: "Financial Operations",
    shortName: "Financial",
    question: "Where do collections, recorded balances, fees or approvals require review?",
    owner: "Finance Lead",
    review: "Weekly exception review · monthly close",
    order: ["05", "04", "06"],
  },
  {
    id: "service",
    route: "service",
    name: "Service Operations",
    shortName: "Service",
    question: "Which responses, older tickets or vendor approval controls need intervention?",
    owner: "Service Operations Lead",
    ownerNote: "KPI 9: Finance supports approval reconciliation",
    review: "Daily exceptions · weekly review · monthly close",
    order: ["07", "08", "09"],
  },
  {
    id: "client",
    route: "client",
    name: "Client Experience",
    shortName: "Client",
    question: "Where are client updates stale or cases stuck?",
    owner: "Client Operations Lead",
    review: "Daily exceptions · weekly review",
    order: ["10", "11"],
  },
];

export const areaById = new Map(areas.map((a) => [a.id, a]));

export interface QueueItem {
  area: AreaId;
  kpi: string;
  finding: string;
  context?: string;
  /** Short proposed-action label (Principal PM review). A recommendation, not an executable command. */
  action: string;
}

/**
 * Attention queue: one lead KPI per area, ordered by Part D section 1:
 * "compliance exposure, money requiring reconciliation, unresolved service work
 * and client communication risk". Not a severity ranking; no trigger has fired.
 */
export const attentionQueue: QueueItem[] = [
  {
    area: "compliance",
    kpi: "01",
    finding: "overdue compliance obligations",
    context: "30 of them have no owner",
    action: "Assign recovery owner",
  },
  { area: "financial", kpi: "05", finding: "rent reconciliation gap to investigate", action: "Investigate reconciliation" },
  {
    area: "service",
    kpi: "07",
    finding: "of tickets missed first-response SLA",
    context: "108 of 360",
    action: "Review response delays",
  },
  {
    area: "client",
    kpi: "10",
    finding: "open liaisoning cases with stale or missing client updates",
    action: "Restore client updates",
  },
];
