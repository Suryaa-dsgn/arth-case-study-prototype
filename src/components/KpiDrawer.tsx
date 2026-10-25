import { useEffect, useRef, type ReactNode } from "react";
import { areaById } from "../data/areas.ts";
import { kpiById, kpis } from "../data/kpis.ts";
import { slaForKpi } from "../data/standards.ts";
import { go, href, type Destination, type Route } from "../lib/route.ts";
import { KpiChart } from "./charts.tsx";
import { ArrowIcon, NextIcon, PrevIcon } from "./icons.tsx";
import { SideSheet } from "./Sheet.tsx";
import { Term } from "./Term.tsx";
import { Badge, CaveatMarker } from "./ui.tsx";

function Field({
  label,
  proposed,
  verified,
  children,
}: {
  label: string;
  proposed?: boolean;
  verified?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-line py-3.5 first:border-t-0">
      <dt className="flex items-center gap-2 text-[14px] leading-5 font-medium text-ink-muted">
        {label}
        {proposed && <Badge tone="proposed">Proposed</Badge>}
        {verified && <Badge tone="verified">Verified</Badge>}
      </dt>
      <dd className="m-0 mt-1 text-[15px] leading-[22px] text-ink">{children}</dd>
    </div>
  );
}

export function KpiDrawer({ route }: { route: Route }) {
  const kpi = route.kpi ? kpiById.get(route.kpi) : undefined;
  const open = Boolean(kpi);
  const close = () => go(route.destination);

  // The drawer opens from a hash change, not a Radix trigger, so remember what had
  // focus when it opened and return focus there when it closes.
  const returnTo = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      if (!returnTo.current) returnTo.current = document.activeElement as HTMLElement | null;
    } else if (returnTo.current) {
      const el = returnTo.current;
      returnTo.current = null;
      if (el.isConnected && el !== document.body) requestAnimationFrame(() => el.focus());
    }
  }, [open]);

  if (!kpi) return null;

  const area = areaById.get(kpi.area)!;
  const index = kpis.findIndex((k) => k.id === kpi.id);
  const prev = kpis[index - 1];
  const next = kpis[index + 1];
  const sla = slaForKpi(kpi.id);
  const fromElsewhere = route.destination !== kpi.area;

  return (
    <SideSheet
      open={open}
      onOpenChange={(o) => !o && close()}
      widthClass="sm:w-[520px]"
      title={
        <div>
          <p className="m-0 flex flex-wrap items-center gap-2 font-mono text-[12px] leading-4 tracking-[0.06em] text-green-700 uppercase">
            KPI {String(kpi.number).padStart(2, "0")} · {area.name}
          </p>
          <h2 className="m-0 mt-1.5 text-[20px] leading-7 font-semibold tracking-[-0.01em] text-ink">{kpi.title}</h2>
        </div>
      }
      description={
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] leading-5 text-ink-muted">
          <Badge tone="verified">Verified</Badge>
          <span>Historical · 19 Sep 2026</span>
          <span aria-hidden>·</span>
          <Term id={kpi.classification === "Outcome" ? "outcome" : "leading"}>{kpi.classification}</Term>
        </div>
      }
    >
      <div className="px-6 py-5">
        <p className="tnum m-0 text-[44px] leading-[48px] font-semibold tracking-[-0.025em] text-ink" data-drawer-value>
          {kpi.displayValue}
        </p>
        <p className="m-0 mt-1 text-[15px] leading-[22px] text-ink">{kpi.unitLine}</p>
        {kpi.marker && (
          <div className="mt-3">
            <CaveatMarker>{kpi.marker}</CaveatMarker>
          </div>
        )}
        <div className="mt-5">
          <KpiChart id={kpi.id} />
        </div>

        <dl className="m-0 mt-6 border-t border-line">
          <Field label="Historical baseline · 19 Sep 2026" verified>
            {kpi.baseline ?? `${kpi.displayValue} ${kpi.unitLine}`}
          </Field>
          {kpi.id === "02" && (
            <Field label="Two different populations">
              <span className="block">
                <span className="tnum font-semibold">30</span> overdue obligations without an assigned owner: the
                unassigned subset of KPI 1&apos;s 116 overdue obligations. This is the KPI value.
              </span>
              <span className="mt-1.5 block text-ink-muted">
                <span className="tnum font-semibold text-ink">132</span> compliance records with missing ownership
                across the broader dataset: a data-quality finding, not validated active obligations. Never added to 30.
              </span>
            </Field>
          )}
          <Field label="Purpose">{kpi.purpose}</Field>
          <Field label="Definition">{kpi.definition}</Field>
          <Field label="Source">{kpi.source}</Field>
          <Field label="Accountable role" proposed>
            {kpi.owner}
          </Field>
          <Field label="Review cadence" proposed>
            {kpi.review}
          </Field>
          <Field label="Data limitation and caveat">
            {kpi.limitation}
            {kpi.caveat !== kpi.limitation && <span className="mt-1.5 block text-ink-muted">{kpi.caveat}</span>}
          </Field>
          <Field label="Proposed target" proposed>
            {kpi.target}
          </Field>
          <Field label="Proposed escalation trigger" proposed>
            {kpi.trigger}
          </Field>
          <Field label="Response when deteriorating" proposed>
            {kpi.response}
          </Field>
          {sla && (
            <Field label={`Related proposed SLA ${sla.number} · ${sla.name}`} proposed>
              {sla.standard} <span className="text-ink-muted">Escalation: {sla.escalation}</span>
            </Field>
          )}
        </dl>
        <p className="m-0 mt-2 font-mono text-[12px] leading-4 tracking-[0.06em] text-ink-muted uppercase">
          Part D reference · section 3.{kpi.number}
        </p>
        {kpi.partDTitle && (
          <p className="m-0 mt-1 text-[14px] leading-5 text-ink-muted">Part D specification title: {kpi.partDTitle}</p>
        )}
      </div>

      <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-line bg-surface px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && go(route.destination, prev.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-line-strong px-2.5 py-1.5 text-[14px] leading-5 font-medium text-ink hover:border-green-900 disabled:opacity-40 disabled:hover:border-line-strong"
            aria-label={prev ? `Previous: KPI ${prev.number}, ${prev.title}` : "No previous KPI"}
          >
            <PrevIcon /> Prev
          </button>
          <button
            type="button"
            disabled={!next}
            onClick={() => next && go(route.destination, next.id)}
            className="inline-flex items-center gap-1 rounded-lg border border-line-strong px-2.5 py-1.5 text-[14px] leading-5 font-medium text-ink hover:border-green-900 disabled:opacity-40 disabled:hover:border-line-strong"
            aria-label={next ? `Next: KPI ${next.number}, ${next.title}` : "No next KPI"}
          >
            Next <NextIcon />
          </button>
        </div>
        {fromElsewhere && (
          <a
            href={href(kpi.area as Destination)}
            className="inline-flex items-center gap-1 text-[14px] leading-5 font-medium text-green-700 hover:text-green-900"
          >
            Go to {area.name} <ArrowIcon size={14} />
          </a>
        )}
      </div>
    </SideSheet>
  );
}
