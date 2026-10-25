// Historical case-study data, 19 Sep 2026 snapshot. Not live Arth data.
// TODO(part-a): add validated Part A portfolio figures: properties, owners, states,
// occupancy, client concentration. Do not use the brief's raw table row counts.

export interface ContextItem {
  label: string;
  value: string;
  source: string;
}

export const portfolioContext: ContextItem[] = [
  { label: "Historical snapshot", value: "19 September 2026", source: "Case brief" },
  { label: "Period covered", value: "Oct 2025 – Sep 2026", source: "Case brief" },
  { label: "States", value: "Maharashtra, Karnataka, Telangana", source: "Case brief" },
];

export const SNAPSHOT_LONG = "19 September 2026";
