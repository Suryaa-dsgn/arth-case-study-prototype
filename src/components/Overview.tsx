import { useState } from "react";
import { KpiIndexTable } from "./KpiIndex.tsx";
import { Term } from "./Term.tsx";
import { areaById, areas, attentionQueue, type Area, type QueueItem } from "../data/areas.ts";
import { founderReview } from "../data/cadence.ts";
import { kpiById } from "../data/kpis.ts";
import { portfolioContext } from "../data/portfolio.ts";
import { href, type Destination } from "../lib/route.ts";
import { AreaIcon, ArrowIcon, ExpandIcon, InfoIcon } from "./icons.tsx";
import { Badge, Highlight, Owner, Panel } from "./ui.tsx";

function PageHeader({ onHowTo }: { onHowTo: () => void }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="m-0 text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-ink">
          Operations <Highlight>overview</Highlight>
        </h1>
      </div>
      <button
        type="button"
        onClick={onHowTo}
        className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-3.5 py-2 text-[14px] leading-5 font-medium text-ink hover:border-green-900"
      >
        <span className="text-green-900">
          <InfoIcon />
        </span>
        How to read this
      </button>
    </header>
  );
}

function ContextStrip() {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-y border-line py-2 text-[14px] leading-5">
      <dl className="m-0 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        {portfolioContext.map((c) => (
          <div key={c.label} className="flex items-baseline gap-2">
            <dt className="text-ink-muted">{c.label}</dt>
            <dd className="tnum m-0 font-medium text-ink">{c.value}</dd>
          </div>
        ))}
      </dl>
      <p className="m-0 ml-auto font-mono text-[12px] tracking-[0.06em] text-ink-muted uppercase">Source · case brief</p>
    </div>
  );
}

function AttentionItem({ item, rank }: { item: QueueItem; rank: number }) {
  const kpi = kpiById.get(item.kpi)!;
  const area = areaById.get(item.area)!;
  return (
    <li className="grid grid-cols-[28px_1fr] gap-x-3 border-t border-line px-6 py-2.5 first:border-t-0">
      <span className="tnum pt-0.5 font-mono text-[13px] leading-5 font-medium text-green-700">0{rank}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="m-0 flex flex-wrap items-center gap-x-2 text-[14px] leading-5 font-medium text-ink-muted">
            <a
              href={href(area.id as Destination)}
              className="inline-flex items-center gap-2 text-green-900 hover:underline hover:underline-offset-4"
              aria-label={`Go to ${area.name}`}
            >
              <AreaIcon area={item.area} size={16} />
              {area.name}
              <ArrowIcon size={14} />
            </a>
            <span className="font-mono text-[12px] tracking-[0.06em]">· KPI {kpi.number}</span>
            <span aria-hidden className="hidden text-line-strong sm:inline">|</span>
            <Owner role={area.owner} />
          </p>
          <div className="flex items-center gap-4">
            <a
              href={href("overview", kpi.id)}
              className="inline-flex items-center gap-1 text-[14px] leading-5 font-medium text-green-900 underline decoration-line-strong underline-offset-4 hover:decoration-green-900"
            >
              View KPI detail
            </a>
          </div>
        </div>
        <p className="m-0 mt-1 text-[17px] leading-[26px] text-ink sm:leading-[34px]">
          <span className="tnum mr-2 align-[-2px] text-[28px] leading-[32px] font-semibold tracking-[-0.025em] sm:text-[32px] sm:leading-[34px]">
            {kpi.displayValue}
          </span>
          {item.finding}
          {item.context && <span className="tnum font-medium"> · {item.context}</span>}
        </p>
        <p className="m-0 flex gap-1.5 text-[14px] leading-5 text-ink-muted">
          <span className="mt-[3px] shrink-0">
            <InfoIcon size={14} />
          </span>
          {kpi.caveat}
        </p>
        {/* A recommendation to read, not a control: no button styling, nothing to click. */}
        <p className="m-0 mt-1.5 rounded-md border-l-2 border-green-900 bg-surface-2 px-3 py-1 text-[14px] leading-5" data-action>
          <span className="mr-2 font-mono text-[12px] tracking-[0.06em] text-ink-muted uppercase">Proposed action</span>
          <span className="font-semibold text-green-900">{item.action}</span>
          <span className="text-ink-muted"> · {kpi.shortResponse}</span>
        </p>
      </div>
    </li>
  );
}

function AttentionQueue() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-6 py-2.5">
        <h2 className="m-0 text-[20px] leading-7 font-semibold tracking-[-0.01em]">Needs founder attention</h2>
        <p className="m-0 text-[14px] leading-5 text-ink-muted">
          From the validated 19 Sep 2026 snapshot · ordered by Part D&apos;s operating priorities
        </p>
      </div>
      <ol className="m-0 list-none p-0">
        {attentionQueue.map((item, i) => (
          <AttentionItem key={item.kpi} item={item} rank={i + 1} />
        ))}
      </ol>
    </Panel>
  );
}

function ExplainerCard() {
  return (
    <Panel className="p-6">
      <h2 className="m-0 text-[16px] leading-[22px] font-semibold">Measured vs proposed</h2>
      <dl className="m-0 mt-4 flex flex-col gap-4">
        <div>
          <dt className="flex items-center gap-2 text-[14px] leading-5 text-ink-muted">
            <Badge tone="verified">Verified</Badge>
            <Term id="verified">What this means</Term>
          </dt>
          <dd className="m-0 mt-1.5 text-[14px] leading-5 text-ink">
            Portfolio-wide historical measurement from the validated 19 Sep 2026 snapshot.
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-2 text-[14px] leading-5 text-ink-muted">
            <Badge tone="proposed">Proposed</Badge>
            <Term id="proposed">What this means</Term>
          </dt>
          <dd className="m-0 mt-1.5 text-[14px] leading-5 text-ink">
            Targets, triggers, responses, owners and cadences, pending Arth validation.
          </dd>
        </div>
      </dl>
      <p className="m-0 mt-4 border-t border-line pt-3 text-[14px] leading-5 text-ink-muted">
        No trends are shown: one validated snapshot exists.
      </p>
    </Panel>
  );
}

function ReviewCard({ onCadence }: { onCadence: () => void }) {
  return (
    <section className="rounded-xl bg-green-900 p-6 text-white">
      <span className="inline-flex rounded-md border border-white/40 px-2 py-[3px] font-mono text-[12px] leading-4 font-medium tracking-[0.06em] uppercase">
        Proposed
      </span>
      <h2 className="m-0 mt-3 text-[18px] leading-6 font-semibold">Weekly founder review</h2>
      <p className="m-0 mt-1 text-[14px] leading-5 text-white/85">Weekly · about 30 min</p>
      <p className="m-0 mt-3 text-[14px] leading-[21px]">{founderReview.scope}</p>
      <button
        type="button"
        onClick={onCadence}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/50 px-3 py-1.5 text-[14px] leading-5 font-medium hover:bg-white/10"
      >
        Review cadence and standards <ArrowIcon size={14} />
      </button>
    </section>
  );
}

function DomainRow({ area }: { area: Area }) {
  // Compact by design: the founder question lives on the area page; definitions live in the drawer.
  return (
    <li className="grid gap-3 border-t border-line px-6 py-4 first:border-t-0 xl:grid-cols-[minmax(0,248px)_1fr_auto] xl:items-start xl:gap-8">
      <div>
        <h3 className="m-0 flex items-center gap-2 text-[16px] leading-[22px] font-semibold">
          <span className="text-green-900">
            <AreaIcon area={area.id} size={18} />
          </span>
          {area.name}
        </h3>
        <div className="mt-1">
          <Owner role={area.owner} />
        </div>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-4 gap-y-3 p-0 sm:grid-cols-3">
        {area.order.map((id, i) => {
          const k = kpiById.get(id)!;
          return (
            <li key={id} className="min-w-0">
              <a href={href("overview", id)} className="group block rounded-md">
                <span
                  className={`tnum block leading-7 font-semibold tracking-[-0.02em] text-ink ${i === 0 ? "text-[24px]" : "text-[22px] text-ink/90"}`}
                >
                  {k.displayValue}
                </span>
                <span className="mt-0.5 block text-[14px] leading-5 text-ink-muted group-hover:text-ink">
                  <span className="font-mono text-[12px] tracking-[0.06em] text-green-700">KPI {k.number} </span>
                  {k.title}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href={href(area.id as Destination)}
        className="inline-flex items-center gap-1 self-start text-[14px] leading-5 font-medium whitespace-nowrap text-green-700 hover:text-green-900"
      >
        Open {area.shortName} <ArrowIcon size={14} />
      </a>
    </li>
  );
}

function DomainSummaries() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-6 py-3">
        <h2 className="m-0 text-[20px] leading-7 font-semibold tracking-[-0.01em]">Operating areas</h2>
        <p className="m-0 text-[14px] leading-5 text-ink-muted">All 11 KPIs · select a value for its definition and limits</p>
      </div>
      <ul className="m-0 list-none p-0">
        {areas.map((a) => (
          <DomainRow key={a.id} area={a} />
        ))}
      </ul>
    </Panel>
  );
}

function KpiIndexDisclosure() {
  const [open, setOpen] = useState(false);
  return (
    <Panel>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="kpi-index"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 rounded-xl px-6 py-4 text-left"
      >
        <span>
          <span className="block text-[16px] leading-[22px] font-semibold">All KPIs · definitions and cadence</span>
          <span className="block text-[14px] leading-5 text-ink-muted">11 KPIs · filter by area, classification and review cadence</span>
        </span>
        <span className={`text-green-900 transition-transform ${open ? "rotate-180" : ""}`}>
          <ExpandIcon size={20} />
        </span>
      </button>
      {open && (
        <div id="kpi-index">
          <KpiIndexTable />
        </div>
      )}
    </Panel>
  );
}

export function Overview({ onHowTo, onCadence }: { onHowTo: () => void; onCadence: () => void }) {
  return (
    <div className="relative">
      <div aria-hidden className="overview-glow pointer-events-none absolute inset-x-0 top-0 h-[260px]" />
      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-5 px-5 pt-6 pb-16 lg:px-10">
        <PageHeader onHowTo={onHowTo} />
        <ContextStrip />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_316px]">
          <AttentionQueue />
          <div className="flex flex-col justify-between gap-5">
            <ExplainerCard />
            <ReviewCard onCadence={onCadence} />
          </div>
        </div>
        <DomainSummaries />
        <KpiIndexDisclosure />
      </div>
    </div>
  );
}
