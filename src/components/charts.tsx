import { useId, useState, type ReactNode } from "react";
import { kpiById } from "../data/kpis.ts";

// Charts only where they aid comprehension (prompt section 8). Every chart has a visible
// numeric label, an accessible name and a "Show as table" alternative. No animation.

interface Row {
  label: string;
  value: string;
}

function ChartFrame({ label, rows, children }: { label: string; rows: Row[]; children: ReactNode }) {
  const [table, setTable] = useState(false);
  const id = useId();
  return (
    <figure className="m-0">
      <figcaption id={id} className="tnum text-[14px] leading-5 font-medium text-ink">
        {label}
      </figcaption>
      <div className="mt-2">
        {table ? (
          <table className="tnum w-full border-collapse text-left text-[14px] leading-5" aria-labelledby={id}>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-line first:border-t-0">
                  <th scope="row" className="py-1.5 pr-4 font-normal text-ink-muted">
                    {r.label}
                  </th>
                  <td className="py-1.5 text-right font-medium text-ink">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          children
        )}
      </div>
      <button
        type="button"
        onClick={() => setTable((t) => !t)}
        aria-pressed={table}
        className="mt-2 rounded-sm text-[14px] leading-5 font-medium text-green-700 underline decoration-line-strong underline-offset-4 hover:text-green-900"
      >
        {table ? "Show as chart" : "Show as table"}
      </button>
    </figure>
  );
}

function Bar({ numerator, denominator, label }: { numerator: number; denominator: number; label: string }) {
  const pct = (numerator / denominator) * 100;
  return (
    <div role="img" aria-label={label} className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
      <div className="h-full rounded-full bg-green-900" style={{ width: `${pct}%` }} data-bar-pct={pct} />
    </div>
  );
}

function UnitGrid({
  filled,
  total,
  columns,
  label,
  shape,
}: {
  filled: number;
  total: number;
  columns: number;
  label: string;
  shape: "dot" | "square";
}) {
  return (
    <div
      role="img"
      aria-label={label}
      data-grid-filled={filled}
      data-grid-total={total}
      className="grid w-fit gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`block ${shape === "dot" ? "h-[9px] w-[9px] rounded-full" : "h-[14px] w-[14px] rounded-[3px]"} ${
            i < filled ? "bg-green-900" : "bg-line-strong"
          }`}
        />
      ))}
    </div>
  );
}

/** KPI 1 + 2: 30 unassigned within the 116 overdue. The 132 stays outside the chart. */
export function OwnershipChart() {
  const label = "30 of 116 overdue have no owner";
  return (
    <div>
      <ChartFrame
        label={label}
        rows={[
          { label: "Overdue obligations (KPI 1)", value: "116" },
          { label: "No owner (KPI 2)", value: "30" },
          { label: "With an owner recorded", value: "86" },
        ]}
      >
        <div role="img" aria-label={`${label}; 86 with an owner recorded`} className="flex h-2 w-full overflow-hidden rounded-full">
          <div className="h-full bg-green-900" style={{ width: `${(30 / 116) * 100}%` }} data-bar-pct={(30 / 116) * 100} />
          <div className="h-full flex-1 bg-surface-2" />
        </div>
        <div className="tnum mt-1.5 flex justify-between text-[14px] leading-5 text-ink-muted">
          <span>30 no owner</span>
          <span>86 with an owner recorded</span>
        </div>
      </ChartFrame>
      <p className="m-0 mt-4 border-t border-dashed border-line-strong pt-3 text-[14px] leading-5 text-ink-muted">
        <span className="font-medium text-ink">Separate data-quality finding · 132</span> compliance records across the
        broader dataset have missing ownership. They are not validated active obligations. Do not add to 30.
      </p>
    </div>
  );
}

/** Returns the chart for a KPI, or null where a chart would not aid comprehension. */
export function KpiChart({ id }: { id: string }) {
  const k = kpiById.get(id)!;
  switch (id) {
    case "01":
    case "02":
      return <OwnershipChart />;
    case "03":
      return (
        <ChartFrame
          label="1 of 27 unassigned"
          rows={[
            { label: "Upcoming open obligations, next 30 days", value: "27" },
            { label: "Unassigned", value: "1" },
          ]}
        >
          <Bar numerator={1} denominator={27} label="1 of 27 unassigned" />
        </ChartFrame>
      );
    case "04":
      return (
        <ChartFrame
          label="95.18% of rent due collected"
          rows={[{ label: "Rent collected, % of rent due", value: "95.18%" }]}
        >
          <Bar numerator={95.18} denominator={100} label="95.18% of rent due collected" />
          <div className="tnum mt-1.5 flex justify-between text-[14px] leading-5 text-ink-muted">
            <span>0%</span>
            <span>100%</span>
          </div>
        </ChartFrame>
      );
    case "07":
      return (
        <ChartFrame
          label={k.unitLine}
          rows={[
            { label: "Tickets in historical snapshot", value: "360" },
            { label: "Missed first-response SLA", value: "108" },
            { label: "Breach rate", value: "30.00%" },
          ]}
        >
          <UnitGrid filled={108} total={360} columns={24} shape="dot" label={k.unitLine} />
          <p className="m-0 mt-2 text-[14px] leading-5 text-ink-muted">Each dot is one ticket · filled = missed first response</p>
        </ChartFrame>
      );
    case "10":
      return (
        <ChartFrame
          label="40 of 42 open cases"
          rows={[
            { label: "Open liaisoning cases", value: "42" },
            { label: "Stale or missing client update", value: "40" },
          ]}
        >
          <UnitGrid filled={40} total={42} columns={14} shape="square" label="40 of 42 open cases with stale or missing client updates" />
          <p className="m-0 mt-2 text-[14px] leading-5 text-ink-muted">
            Stale = no update, or last update older than the proposed 30-day interval
          </p>
        </ChartFrame>
      );
    default:
      return null;
  }
}
