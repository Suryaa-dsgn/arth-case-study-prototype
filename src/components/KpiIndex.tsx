import { useMemo, useState } from "react";
import { areaById, areas } from "../data/areas.ts";
import { kpis, type AreaId, type Cadence, type Classification } from "../data/kpis.ts";
import { href } from "../lib/route.ts";

// Filters use only Part D attributes, so every filter result is truthful.

type Option<T> = { value: T | "all"; label: string };

function FilterGroup<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T | "all";
  options: Option<T>[];
  onChange: (v: T | "all") => void;
}) {
  return (
    <fieldset className="m-0 flex flex-wrap items-center gap-2 border-0 p-0">
      <legend className="float-left mr-1 text-[14px] leading-5 text-ink-muted">{legend}</legend>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`rounded-md border px-2.5 py-1 text-[14px] leading-5 ${
              active ? "border-green-900 bg-green-900 text-white" : "border-line-strong bg-surface text-ink hover:border-green-900"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </fieldset>
  );
}

export function KpiIndexTable() {
  const [area, setArea] = useState<AreaId | "all">("all");
  const [cls, setCls] = useState<Classification | "all">("all");
  const [cadence, setCadence] = useState<Cadence | "all">("all");

  const rows = useMemo(
    () =>
      kpis.filter(
        (k) =>
          (area === "all" || k.area === area) &&
          (cls === "all" || k.classification === cls) &&
          (cadence === "all" || k.cadences.includes(cadence)),
      ),
    [area, cls, cadence],
  );
  const filtered = area !== "all" || cls !== "all" || cadence !== "all";
  const reset = () => {
    setArea("all");
    setCls("all");
    setCadence("all");
  };

  return (
    <div className="border-t border-line">
      <div className="flex flex-col gap-3 px-6 py-4">
        <FilterGroup
          legend="Area"
          value={area}
          onChange={setArea}
          options={[{ value: "all", label: "All" }, ...areas.map((a) => ({ value: a.id, label: a.shortName }))]}
        />
        <FilterGroup
          legend="Classification"
          value={cls}
          onChange={setCls}
          options={[
            { value: "all", label: "All" },
            { value: "Outcome", label: "Outcome" },
            { value: "Leading indicator", label: "Leading" },
          ]}
        />
        <FilterGroup
          legend="Operational review"
          value={cadence}
          onChange={setCadence}
          options={[
            { value: "all", label: "All" },
            { value: "Daily", label: "Daily" },
            { value: "Weekly", label: "Weekly" },
            { value: "Monthly", label: "Monthly" },
          ]}
        />
        <p className="m-0 text-[14px] leading-5 text-ink-muted" aria-live="polite">
          {rows.length} of 11 KPIs · the weekly founder review covers all 11 and is not used as a filter
          {filtered && (
            <>
              {" · "}
              <button type="button" onClick={reset} className="font-medium text-green-700 underline underline-offset-4">
                Clear filters
              </button>
            </>
          )}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-[14px] leading-5">
          <thead>
            <tr className="bg-surface-2 text-ink-muted">
              <th scope="col" className="px-6 py-2.5 font-medium">#</th>
              <th scope="col" className="px-3 py-2.5 font-medium">KPI</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Value</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Area</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Classification</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Review cadence</th>
              <th scope="col" className="px-3 py-2.5 pr-6 font-medium">Owner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k.id} className="border-t border-line align-top hover:bg-bg">
                <td className="tnum px-6 py-3 font-mono text-[12px] leading-5 text-green-700">{k.number}</td>
                <th scope="row" className="px-3 py-3 font-medium">
                  <a href={href("overview", k.id)} className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-green-900">
                    {k.title}
                  </a>
                </th>
                <td className="tnum px-3 py-3 text-right font-semibold whitespace-nowrap text-ink">{k.displayValue}</td>
                <td className="px-3 py-3 text-ink">{areaById.get(k.area)!.name}</td>
                <td className="px-3 py-3 text-ink">{k.classification}</td>
                <td className="px-3 py-3 text-ink">{k.review}</td>
                <td className="px-3 py-3 pr-6 text-ink">{k.owner}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-ink-muted">
                  No KPIs match these filters.{" "}
                  <button type="button" onClick={reset} className="font-medium text-green-700 underline underline-offset-4">
                    Clear filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
