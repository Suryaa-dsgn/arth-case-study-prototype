// Historical case-study data, 19 Sep 2026 snapshot, from Part D. Not live Arth data.
// Part D section 5: eight proposed operational and product SLAs.

export interface Sla {
  number: number;
  name: string;
  standard: string;
  escalation: string;
  kind: "operational" | "product";
  kpi?: string;
}

export const slas: Sla[] = [
  {
    number: 1,
    name: "Compliance assignment",
    standard: "Assign each validated active obligation within one working day.",
    escalation: "Escalate unresolved allocations; Compliance Lead.",
    kind: "operational",
    kpi: "02",
  },
  {
    number: 2,
    name: "Approaching statutory deadline",
    standard: "Daily review of obligations due within seven days, including evidence and blockers.",
    escalation: "Escalate missing evidence or blocked completion; Compliance Lead.",
    kind: "operational",
    kpi: "03",
  },
  {
    number: 3,
    name: "Missed statutory deadline",
    standard: "Flag immediately on detection; initiate and document recovery.",
    escalation: "Compliance Lead escalates under authorized statutory process.",
    kind: "operational",
    kpi: "01",
  },
  {
    number: 4,
    name: "Service first response",
    standard: "Meet approved priority-specific first-response thresholds; resolution tracked separately.",
    escalation: "Escalate breaches to Service Operations Lead.",
    kind: "operational",
    kpi: "07",
  },
  {
    number: 5,
    name: "Aged service tickets",
    standard: "Review open tickets older than 90 days weekly.",
    escalation: "Escalate high-priority tickets lacking an action plan; Service Operations Lead.",
    kind: "operational",
    kpi: "08",
  },
  {
    number: 6,
    name: "Client communication",
    standard:
      "Proposed maximum 30-day routine update interval, subject to Arth approval; urgent changes and explicit commitments require earlier contact.",
    escalation: "Overdue commitments to Client Operations Lead; agree final case-type frequencies.",
    kind: "operational",
    kpi: "10",
  },
  {
    number: 7,
    name: "Reminder processing",
    standard:
      "Measure actual processing delay from scheduled reminder timestamp; agree permissible delay before launch. Daily review is monitoring, not the timing SLA.",
    escalation: "Surface delayed/failed reminders; Engineering Lead and Compliance Lead investigate.",
    kind: "product",
  },
  {
    number: 8,
    name: "Critical application failure",
    standard:
      "Acknowledge within one working hour during agreed support coverage; appoint recovery owner, send incident updates, maintain workaround and recovery plan.",
    escalation: "Engineering Lead coordinates; no guaranteed restoration time is proposed.",
    kind: "product",
  },
];

export const slaFootnote =
  "All eight are proposed and require Arth validation. Authorized legal/compliance owners approve statutory deadlines and rules; engineering implements approved rules only.";

export const slaForKpi = (id: string) => slas.find((s) => s.kpi === id);
