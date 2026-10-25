// Historical case-study data, 19 Sep 2026 snapshot, from Part D. Not live Arth data.
// Long-form fields are verbatim from Part D section 3. Short forms (unitLine, caveat,
// response) are the approved condensed wording. Edit here only, then run `npm run verify`.

export type AreaId = "compliance" | "financial" | "service" | "client";
export type Classification = "Outcome" | "Leading indicator";
export type Cadence = "Daily" | "Weekly" | "Monthly";

export interface Bar {
  numerator: number;
  denominator: number;
}

export interface Kpi {
  id: string; // "01" to "11"
  number: number; // Part D section 3 number
  area: AreaId;
  title: string;
  /** Part D section 3 heading, shown in the drawer when the display title differs. */
  partDTitle?: string;
  displayValue: string;
  unitLine: string;
  bar?: Bar;
  classification: Classification;
  /** Operational cadences used by the index filter (excludes the universal weekly founder review). */
  cadences: Cadence[];
  purpose: string;
  definition: string;
  source: string;
  owner: string;
  review: string;
  baseline?: string; // Part D "VERIFIED baseline" text where it adds context beyond displayValue
  target: string;
  trigger: string;
  response: string;
  limitation: string;
  caveat: string;
  shortResponse: string;
  /** Short inline marker shown beside the value on domain pages. */
  marker?: string;
}

export const kpis: Kpi[] = [
  {
    id: "01",
    number: 1,
    area: "compliance",
    title: "Overdue compliance obligations",
    displayValue: "116",
    unitLine: "incomplete and past statutory due date",
    classification: "Outcome",
    cadences: ["Daily"],
    purpose: "Identify missed statutory work and prioritize recovery before further exposure.",
    definition:
      "Count validated incomplete obligations with statutory due date before snapshot date; historical extraction: 116.",
    source: "Compliance tracker / validated obligation register",
    owner: "Compliance Lead",
    review: "Daily; weekly founder review",
    baseline: "116 incomplete and overdue",
    target: "Progressively reduce backlog; zero new preventable misses after stabilized pilot",
    trigger: "Any newly overdue validated obligation; any overdue high-risk item",
    response: "Confirm statutory rule, assign recovery owner and date, escalate legal/compliance blockers",
    limitation: "Due-date validity, completeness and status mapping must be confirmed.",
    caveat: "Due-date validity and status mapping still to be confirmed.",
    shortResponse: "Assign recovery owner and date; escalate blockers.",
  },
  {
    id: "02",
    number: 2,
    area: "compliance",
    // Principal PM review: label the historical value by its actual population (30 of the 116 overdue).
    title: "Overdue obligations without assigned owners",
    partDTitle: "Active obligations without owners (future metric)",
    displayValue: "30",
    unitLine: "unassigned within the 116 overdue",
    bar: { numerator: 30, denominator: 116 },
    classification: "Leading indicator",
    cadences: ["Daily"],
    purpose: "Expose accountability gaps so the Compliance Lead can reassign work promptly.",
    definition:
      "Future metric = count validated active obligations requiring assignment with no accountable owner. Historical 30 is the unassigned subset of 116 overdue; broader 132 is missing ownership across all compliance records. Neither is a validated baseline for the future population.",
    source: "Compliance tracker / owner mapping",
    owner: "Compliance Lead",
    review: "Daily",
    baseline: "30 unassigned overdue; separately 132 missing-owner records in broader dataset",
    target: "100% of validated active obligations assigned within one working day",
    trigger: "Any assignment pending beyond one working day",
    response: "Resolve owner mapping and escalate unresolved allocations",
    limitation: "Future consistent-population baseline to be established after validation; do not sum 30 and 132.",
    caveat: "Separately, 132 records lack an owner across all compliance records. Different populations: do not add.",
    shortResponse: "Resolve owner mapping; escalate unresolved allocations.",
  },
  {
    id: "03",
    number: 3,
    area: "compliance",
    title: "Upcoming open obligations, next 30 days",
    displayValue: "27",
    unitLine: "open and due within 30 days of snapshot · 1 unassigned",
    bar: { numerator: 1, denominator: 27 },
    classification: "Leading indicator",
    cadences: ["Daily"],
    purpose: "Provide a near-term deadline queue and separate evidence/ownership intervention.",
    definition:
      "Count open obligations with due dates in the 30 days following snapshot date, separately flag missing owner and missing required evidence.",
    source: "Compliance tracker / deadline and evidence fields",
    owner: "Compliance Lead",
    review: "Daily",
    baseline: "27 upcoming and open; 1 unassigned",
    target: "100% reviewed for owner, next action and evidence need before due date",
    trigger: "Unassigned upcoming obligation or missing evidence for an approaching deadline",
    response: "Assign owner; prioritize seven-day window; request missing evidence",
    limitation: "Open and upcoming does not itself mean at risk; date and evidence fields require validation.",
    caveat: "Open and upcoming does not mean at risk.",
    shortResponse: "Assign owner; prioritize the 7-day window; request missing evidence.",
  },
  {
    id: "04",
    number: 4,
    area: "financial",
    title: "Rent collection ratio",
    displayValue: "95.18%",
    unitLine: "of rent due collected",
    bar: { numerator: 95.18, denominator: 100 },
    classification: "Outcome",
    cadences: ["Weekly", "Monthly"],
    purpose: "Judge rent collection effectiveness and whether follow-up capacity is needed.",
    definition: "Collected rent ÷ rent due × 100 for a consistent reporting period and validated ledger scope.",
    source: "Rent demand and collection records",
    owner: "Finance Lead",
    review: "Weekly; monthly close",
    target:
      "At least 98%, proposed only after baseline validation and capacity review; subject to Arth approval",
    trigger: "Below 95% or declining two comparable periods",
    response: "Review due/received mapping, collections follow-up and exceptions",
    limitation: "Ledger timing, partial receipts and allocation can affect ratio.",
    caveat: "Ledger timing, partial receipts and allocation can shift the ratio.",
    shortResponse: "Review due vs received mapping and follow-ups.",
  },
  {
    id: "05",
    number: 5,
    area: "financial",
    title: "Rent reconciliation gap",
    displayValue: "₹55,26,140",
    unitLine: "rent due minus deduplicated rent receipts",
    classification: "Outcome",
    cadences: ["Weekly", "Monthly"],
    purpose: "Identify unreconciled rent records for financial investigation, without inferring arrears.",
    definition:
      "Rent reconciliation gap = rent due − deduplicated rent receipts. Absolute magnitude may be considered separately when prioritising exceptions; investigate causes before attribution.",
    source: "Rent roll, collections and finance reconciliation",
    owner: "Finance Lead",
    review: "Weekly exception review; monthly close",
    target: "Document and resolve all material unmatched differences; agree tolerance at launch",
    trigger: "Any unexplained material movement or aged unresolved item",
    response: "Trace property-level entries, timing and duplicates; record disposition",
    limitation: "Gap is not automatically confirmed arrears; settlement and mapping may differ.",
    caveat: "Not confirmed arrears. Investigate causes before attribution.",
    shortResponse: "Trace property-level entries, timing and duplicates.",
    marker: "Not confirmed arrears",
  },
  {
    id: "06",
    number: 6,
    area: "financial",
    title: "Management-fee reconciliation difference",
    displayValue: "₹14,36,923.85",
    unitLine: "14.14% of expected fees",
    classification: "Outcome",
    cadences: ["Monthly"],
    purpose: "Prioritize fee-contract and ledger reconciliation before financial conclusions.",
    definition:
      "Difference between expected and recorded management fees, with percentage of expected fees under the validated Part A method.",
    source: "Management agreements / expected fee schedule / accounting",
    owner: "Finance Lead",
    review: "Monthly",
    baseline: "₹14,36,923.85; 14.14% of expected fees",
    target: "Reconcile material differences and document approved exceptions",
    trigger: "Any unexplained new difference or unresolved material balance",
    response: "Validate contractual basis, fee period and ledger postings",
    limitation: "Not automatically proven financial loss; contract/version and timing checks required.",
    caveat: "Not confirmed lost revenue. Contract version and timing checks required.",
    shortResponse: "Validate contract basis, fee period and ledger postings.",
    marker: "Not confirmed lost revenue",
  },
  {
    id: "07",
    number: 7,
    area: "service",
    title: "First-response SLA breach rate",
    displayValue: "30.00%",
    unitLine: "108 of 360 tickets missed first-response SLA",
    bar: { numerator: 108, denominator: 360 },
    classification: "Outcome",
    cadences: ["Daily", "Weekly"],
    purpose: "Assess first-contact responsiveness and triage staffing against approved priorities.",
    definition:
      "Count tickets where first_response_hours > sla_first_response_hours ÷ all 360 service tickets × 100 in historical snapshot. Future eligibility refinement must be separately labeled and baselined.",
    source: "Service ticket tracker, first-response timestamps and priority SLA",
    owner: "Service Operations Lead",
    review: "Daily exceptions; weekly review",
    baseline: "108 / 360 = 30.00%",
    target:
      "Reduce to under 10%, proposed only after baseline validation, priority thresholds and capacity review; subject to Arth approval",
    trigger: "Any critical-priority breach; sustained weekly rate above agreed target",
    response: "Review triage and staffing, assign recovery actions, correct timestamp gaps",
    limitation: "Historical denominator remains 360; first response is distinct from resolution.",
    caveat: "First response only. Resolution is tracked separately.",
    shortResponse: "Review triage and staffing; correct timestamp gaps.",
    marker: "First response only",
  },
  {
    id: "08",
    number: 8,
    area: "service",
    title: "Aged open service tickets",
    displayValue: "55",
    unitLine: "open tickets older than 90 days",
    classification: "Outcome",
    cadences: ["Weekly"],
    purpose: "Surface stuck service work for escalation, resourcing and client follow-up.",
    definition: "Count open tickets with age since opening >90 days at reporting snapshot.",
    source: "Service ticket tracker",
    owner: "Service Operations Lead",
    review: "Weekly",
    target: "Every >90-day ticket has documented action and owner; reduce count over comparable windows",
    trigger: "High-priority aged ticket without action plan",
    response: "Escalate blocker, assign next step and client update where applicable",
    limitation: "Open status and creation dates need reliable capture.",
    caveat: "Depends on reliable open status and creation dates.",
    shortResponse: "Escalate blocker; assign next step and client update.",
  },
  {
    id: "09",
    number: 9,
    area: "service",
    title: "Vendor spend lacking positive approval evidence",
    displayValue: "₹7,61,400",
    unitLine: "no affirmative approval record in analyzed data",
    classification: "Leading indicator",
    cadences: ["Weekly", "Monthly"],
    purpose: "Find expenditure needing an approval-evidence audit and control repair.",
    definition:
      "Sum vendor expenditure where an affirmative approval record cannot be demonstrated in the analyzed data.",
    source: "Vendor bills, approvals, procurement records",
    owner: "Service Operations Lead (Finance supports approval reconciliation)",
    review: "Weekly exceptions; monthly close",
    target: "100% of in-scope new spend linked to approval evidence",
    trigger: "Any new material spend without positive approval evidence",
    response: "Locate authorization trail, resolve control gap and document decision",
    limitation:
      "Missing evidence is not automatically unauthorized expenditure; policy scope and linkage may differ.",
    caveat: "Missing evidence is not proof of unauthorized spend.",
    shortResponse: "Locate authorization trail; repair the control.",
    marker: "Not proof of unauthorized spend",
  },
  {
    id: "10",
    number: 10,
    area: "client",
    title: "Open liaisoning cases with stale or missing client updates",
    displayValue: "40 of 42",
    unitLine: "open cases with no update, or last update older than 30 days",
    bar: { numerator: 40, denominator: 42 },
    classification: "Leading indicator",
    cadences: ["Daily", "Weekly"],
    purpose: "Spot cases needing a timely client update and communication ownership.",
    definition:
      "Count open cases with no recorded client update or last update older than proposed routine 30-day interval.",
    source: "Liaisoning case tracker and communication log",
    owner: "Client Operations Lead",
    review: "Daily exceptions; weekly review",
    baseline: "40 of 42 open cases",
    target:
      "All open cases have an agreed update schedule; routine interval no more than 30 days where appropriate",
    trigger: "Any overdue committed update or urgent case lacking timely contact",
    response: "Send context-appropriate update, record next commitment, escalate blocker",
    limitation: "Communication outside tracker may be unrecorded; 30 days is not universal.",
    caveat: "Updates outside the tracker may be unrecorded. 30 days is a proposed interval, not universal.",
    shortResponse: "Send update; record next commitment.",
    marker: "30 days is a proposed interval pending Arth approval, not universal",
  },
  {
    id: "11",
    number: 11,
    area: "client",
    title: "Liaisoning cases stalled over 90 days in current stage",
    displayValue: "16",
    unitLine: "open cases, measured from stage entry date",
    classification: "Outcome",
    cadences: ["Weekly"],
    purpose: "Expose stage-specific blockers so leadership can unblock the liaisoning process.",
    definition:
      "For each open case stage_age_days = snapshot_date − stage_entered_date; count where stage_age_days > 90.",
    source: "Liaisoning tracker, stage transition history",
    owner: "Client Operations Lead",
    review: "Weekly",
    target: "All >90-day cases have documented blocker, owner and next milestone; reduce count",
    trigger: "Any high-risk case >90 days without recovery action",
    response: "Escalate stage blocker and agree next milestone/client communication",
    limitation: "Requires accurate stage_entered_date and open status; do not substitute case age.",
    caveat: "Uses current-stage age, not original case age.",
    shortResponse: "Escalate stage blocker; agree next milestone.",
  },
];

export const kpiById = new Map(kpis.map((k) => [k.id, k]));
