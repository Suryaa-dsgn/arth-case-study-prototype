// Short term definitions for tooltips. Derived from Part D and the case brief wording.
// Tooltips never hold the only copy of a caveat.

export const glossary = {
  outcome: "An outcome KPI measures a result that has already occurred, such as obligations already past their due date.",
  leading: "A leading indicator flags conditions that can lead to later misses, such as work without an accountable owner.",
  firstResponse:
    "Time to first response on a ticket against its priority SLA. Resolution is tracked separately (Part D SLA 4).",
  reconciliationGap: "Rent due minus deduplicated rent receipts. Not automatically arrears; causes need investigation.",
  liaisoning: "Government or society approval cases, such as mutation, occupancy certificates or registrations.",
  stageAge: "Days since a case entered its current stage (stage_entered_date), not since the case was opened.",
  verified: "Portfolio-wide historical measurement from the validated 19 Sep 2026 snapshot.",
  proposed: "A target, trigger, response, owner or cadence proposed in Part D, pending Arth validation.",
} as const;

export type Term = keyof typeof glossary;
