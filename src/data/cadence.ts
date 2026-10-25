// Historical case-study data, 19 Sep 2026 snapshot, from Part D. Not live Arth data.
// Part D section 4: operating and implementation review cadence (proposed).

export const forums = [
  {
    forum: "Daily operational monitoring",
    frequency: "Daily, about 10–15 min",
    scope:
      "Approaching deadlines; unassigned obligations; urgent service issues; overdue client updates; failed or delayed reminders. Operations/Compliance Lead with relevant staff owns follow-up.",
  },
  {
    forum: "Founder operating review",
    frequency: "Weekly, about 30 min",
    scope: "Review all 11 KPIs, deterioration, blockers and corrective actions. Log each decision, owner and due date.",
  },
  {
    forum: "Strategic review",
    frequency: "Monthly, about 45–60 min",
    scope: "Reconciliation, sustained trends, capacity, risk and conditional roadmap priorities.",
  },
  {
    forum: "Implementation steering",
    frequency: "Weeks 1–4 weekly; Weeks 5–13 fortnightly",
    scope:
      "PM, Engineering Lead and functional leads review scope, milestones, pilot readiness, adoption, blockers and critical incidents.",
  },
  {
    forum: "Expansion decision",
    frequency: "Day 90",
    scope: "Founder, PM and functional leads record expansion or hold with evidence and next decision date.",
  },
];

export const cadenceFootnote = "These forums and durations are proposed practices.";

export const founderReview = forums[1];
