import type { Area } from "../data/areas.ts";
import { kpiById, type Kpi } from "../data/kpis.ts";
import { href, type Destination } from "../lib/route.ts";
import { KpiChart } from "./charts.tsx";
import { AreaIcon, ArrowIcon, InfoIcon } from "./icons.tsx";
import { Term } from "./Term.tsx";
import { Badge, CaveatMarker, Kicker, Owner, Panel } from "./ui.tsx";

const termFor = (k: Kpi): "outcome" | "leading" => (k.classification === "Outcome" ? "outcome" : "leading");

function KpiMeta({ kpi }: { kpi: Kpi }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="font-mono text-[12px] leading-4 font-medium tracking-[0.06em] text-green-700 uppercase">
        KPI {String(kpi.number).padStart(2, "0")}
      </span>
      <span className="flex items-center gap-2 text-[14px] leading-5 text-ink-muted">
        <Term id={termFor(kpi)}>{kpi.classification}</Term>
        <span aria-hidden>·</span>
        <span>{kpi.review}</span>
      </span>
    </div>
  );
}

function DetailLink({ kpi, area }: { kpi: Kpi; area: Area }) {
  return (
    <a
      href={href(area.id as Destination, kpi.id)}
      className="inline-flex items-center gap-1 text-[14px] leading-5 font-medium text-green-900 underline decoration-line-strong underline-offset-4 hover:decoration-green-900"
    >
      Definition and limits
      <span className="sr-only">for KPI {kpi.number}, {kpi.title}</span>
    </a>
  );
}

function Caveat({ text }: { text: string }) {
  return (
    <p className="m-0 flex gap-1.5 text-[14px] leading-5 text-ink-muted">
      <span className="mt-[3px] shrink-0">
        <InfoIcon size={14} />
      </span>
      {text}
    </p>
  );
}

function TitleWithTerms({ kpi }: { kpi: Kpi }) {
  // Terms with definitions get a tooltip inside the title.
  if (kpi.id === "07")
    return (
      <>
        <Term id="firstResponse">First-response SLA</Term> breach rate
      </>
    );
  if (kpi.id === "05")
    return (
      <>
        Rent <Term id="reconciliationGap">reconciliation gap</Term>
      </>
    );
  if (kpi.id === "10")
    return (
      <>
        Open <Term id="liaisoning">liaisoning</Term> cases with stale or missing client updates
      </>
    );
  if (kpi.id === "11")
    return (
      <>
        Liaisoning cases stalled over 90 days in <Term id="stageAge">current stage</Term>
      </>
    );
  return <>{kpi.title}</>;
}

function LeadPanel({ kpi, area }: { kpi: Kpi; area: Area }) {
  const chart = KpiChart({ id: kpi.id });
  return (
    <Panel className="p-6 lg:p-8" data-kpi={kpi.id}>
      <KpiMeta kpi={kpi} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 className="m-0 text-[18px] leading-6 font-semibold text-ink">
            <TitleWithTerms kpi={kpi} />
          </h2>
          <p
            className="tnum m-0 mt-3 text-[44px] leading-[48px] font-semibold tracking-[-0.03em] text-ink sm:text-[56px] sm:leading-[60px]"
            data-kpi-value
          >
            {kpi.displayValue}
          </p>
          <span aria-hidden className="mt-2 block h-1 w-12 rounded-full bg-lime" />
          <p className="m-0 mt-3 text-[15px] leading-[22px] text-ink">{kpi.unitLine}</p>
          {kpi.marker && (
            <div className="mt-3">
              <CaveatMarker>{kpi.marker}</CaveatMarker>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 lg:border-l lg:border-line lg:pl-8">
          {chart && <div>{chart}</div>}
          <Caveat text={kpi.caveat} />
          <p className="m-0 text-[14px] leading-5 text-ink">
            <span className="font-medium text-green-900">Proposed response · </span>
            {kpi.shortResponse}
          </p>
          <div>
            <DetailLink kpi={kpi} area={area} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function SecondaryPanel({ kpi, area }: { kpi: Kpi; area: Area }) {
  // KPI 2 sits beside KPI 1, whose chart already shows the 30 within 116.
  const chart = kpi.id === "02" ? null : KpiChart({ id: kpi.id });
  return (
    <Panel className="flex flex-col p-6" data-kpi={kpi.id}>
      <KpiMeta kpi={kpi} />
      <h3 className="m-0 mt-3 text-[16px] leading-[22px] font-semibold text-ink">
        <TitleWithTerms kpi={kpi} />
      </h3>
      <p className="tnum m-0 mt-2 text-[32px] leading-9 font-semibold tracking-[-0.025em] text-ink" data-kpi-value>
        {kpi.displayValue}
      </p>
      <p className="m-0 mt-1 text-[15px] leading-[22px] text-ink">{kpi.unitLine}</p>
      {kpi.marker && (
        <div className="mt-3">
          <CaveatMarker>{kpi.marker}</CaveatMarker>
        </div>
      )}
      {chart && <div className="mt-4">{chart}</div>}
      <div className="mt-4">
        <Caveat text={kpi.caveat} />
      </div>
      <p className="m-0 mt-3 text-[14px] leading-5 text-ink">
        <span className="font-medium text-green-900">Proposed response · </span>
        {kpi.shortResponse}
      </p>
      <div className="mt-auto pt-4">
        <DetailLink kpi={kpi} area={area} />
      </div>
    </Panel>
  );
}

function StandardsTable({ items }: { items: Kpi[] }) {
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-6 py-4">
        <h2 className="m-0 text-[18px] leading-6 font-semibold">Proposed standards for this area</h2>
        <Badge tone="proposed">Proposed</Badge>
        <p className="m-0 w-full text-[14px] leading-5 text-ink-muted">
          Part D proposals pending Arth validation. Not applied to the historical values above.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[14px] leading-5">
          <thead>
            <tr className="bg-surface-2 text-ink-muted">
              <th scope="col" className="w-[30%] px-6 py-2.5 font-medium">KPI</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Proposed target</th>
              <th scope="col" className="px-4 py-2.5 pr-6 font-medium">Proposed escalation trigger</th>
            </tr>
          </thead>
          <tbody>
            {items.map((k) => (
              <tr key={k.id} className="border-t border-line align-top">
                <th scope="row" className="px-6 py-3 font-medium text-ink">
                  <span className="font-mono text-[12px] tracking-[0.06em] text-green-700">KPI {k.number} </span>
                  {k.title}
                </th>
                <td className="px-4 py-3 text-ink">{k.target}</td>
                <td className="px-4 py-3 pr-6 text-ink">{k.trigger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function DomainPage({ area }: { area: Area }) {
  const items = area.order.map((id) => kpiById.get(id)!);
  const [lead, ...rest] = items;
  // Standards follow Part D numbering.
  const byNumber = [...items].sort((a, b) => a.number - b.number);
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 pt-6 pb-16 lg:px-10">
      <header className="flex flex-col gap-3">
        <a
          href={href("overview")}
          className="inline-flex w-fit items-center gap-1 text-[14px] leading-5 font-medium text-green-700 hover:text-green-900"
        >
          <span className="rotate-180">
            <ArrowIcon size={14} />
          </span>
          Overview
        </a>
        <Kicker>Operating area</Kicker>
        <h1 className="m-0 flex items-center gap-3 text-[26px] leading-8 font-semibold tracking-[-0.02em] sm:text-[32px] sm:leading-[38px]">
          <span className="text-green-900">
            <AreaIcon area={area.id} size={28} />
          </span>
          {area.name}
        </h1>
        <p className="m-0 max-w-[720px] text-[17px] leading-[26px] text-ink-muted">{area.question}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-2.5">
          <Owner role={area.owner} />
          {area.ownerNote && <span className="text-[14px] leading-5 text-ink-muted">{area.ownerNote}</span>}
          <span className="flex items-center gap-2 text-[14px] leading-5 text-ink">
            <span className="text-ink-muted">Proposed review ·</span> {area.review}
          </span>
          <span className="ml-auto flex items-center gap-2 text-[14px] leading-5 text-ink-muted">
            <Badge tone="verified">Verified</Badge> Historical · 19 Sep 2026
          </span>
        </div>
      </header>

      <LeadPanel kpi={lead} area={area} />
      <div className={`grid gap-6 ${rest.length > 1 ? "md:grid-cols-2" : ""}`}>
        {rest.map((k) => (
          <SecondaryPanel key={k.id} kpi={k} area={area} />
        ))}
      </div>
      <StandardsTable items={byNumber} />
    </div>
  );
}
