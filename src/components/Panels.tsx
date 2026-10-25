import { cadenceFootnote, forums } from "../data/cadence.ts";
import { slaFootnote, slas } from "../data/standards.ts";
import { CenterDialog } from "./Sheet.tsx";
import { Badge } from "./ui.tsx";

export function MeasurementPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <CenterDialog
      open={open}
      onOpenChange={onOpenChange}
      title="How to read this dashboard"
      description="What is measured, what is proposed, and what is deliberately not shown."
    >
      <div className="flex flex-col gap-5 text-[15px] leading-[22px]">
        <section>
          <Badge tone="verified">Verified</Badge>
          <p className="m-0 mt-2">
            Every KPI value is a portfolio-wide historical measurement from the validated Part A snapshot of 19 September
            2026, as specified in Part D.
          </p>
        </section>
        <section>
          <Badge tone="proposed">Proposed</Badge>
          <p className="m-0 mt-2">
            Targets, escalation triggers, responses, accountable roles, SLAs and review cadences are proposals for Arth
            validation. They are not historical performance or contractual commitments.
          </p>
        </section>
        <section className="border-t border-line pt-4">
          <h3 className="m-0 text-[16px] leading-[22px] font-semibold">Why there are no trends or status colours</h3>
          <ul className="m-0 mt-2 flex list-disc flex-col gap-1.5 pl-5">
            <li>Only one validated snapshot exists, so no time series, change or improvement is shown.</li>
            <li>
              No thresholds are approved, so nothing is coloured good or bad, and no proposed trigger is applied to the
              historical values.
            </li>
            <li>
              Pilot results need their own baseline for the same population, definitions and windows. They are never
              compared with this portfolio-wide snapshot (Part D section 7).
            </li>
          </ul>
        </section>
        <section className="border-t border-line pt-4">
          <h3 className="m-0 text-[16px] leading-[22px] font-semibold">Qualifiers to keep in mind</h3>
          <ul className="m-0 mt-2 flex list-disc flex-col gap-1.5 pl-5">
            <li>The rent reconciliation gap is not automatically arrears.</li>
            <li>The management-fee difference is not confirmed lost revenue.</li>
            <li>Missing vendor approval evidence is not proof of unauthorized spend.</li>
            <li>30 unowned overdue obligations and 132 broader missing-owner records are different populations.</li>
            <li>The service KPI measures first response only; resolution is tracked separately.</li>
          </ul>
        </section>
      </div>
    </CenterDialog>
  );
}

export function CadencePanel({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const groups = [
    { title: "Operational SLAs", items: slas.filter((s) => s.kind === "operational") },
    { title: "Product SLAs", items: slas.filter((s) => s.kind === "product") },
  ];
  return (
    <CenterDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Review cadence and standards"
      description="Proposed forums and the eight proposed SLAs from Part D sections 4 and 5."
    >
      <section>
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-[16px] leading-[22px] font-semibold">Review cadence</h3>
          <Badge tone="proposed">Proposed</Badge>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14px] leading-5">
            <thead>
              <tr className="bg-surface-2 text-ink-muted">
                <th scope="col" className="px-3 py-2 font-medium">Forum</th>
                <th scope="col" className="px-3 py-2 font-medium">Frequency</th>
                <th scope="col" className="px-3 py-2 font-medium">Scope and output</th>
              </tr>
            </thead>
            <tbody>
              {forums.map((f) => (
                <tr key={f.forum} className="border-b border-line align-top">
                  <th scope="row" className="px-3 py-2.5 font-medium text-ink">{f.forum}</th>
                  <td className="px-3 py-2.5 whitespace-nowrap text-ink">{f.frequency}</td>
                  <td className="px-3 py-2.5 text-ink">{f.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 mt-2 text-[14px] leading-5 text-ink-muted">{cadenceFootnote}</p>
      </section>
      {groups.map((g) => (
        <section key={g.title} className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="m-0 text-[16px] leading-[22px] font-semibold">{g.title}</h3>
            <Badge tone="proposed">Proposed</Badge>
          </div>
          <ol className="m-0 mt-2 list-none p-0">
            {g.items.map((s) => (
              <li key={s.number} className="grid grid-cols-[28px_1fr] gap-x-2 border-b border-line py-2.5 text-[14px] leading-5">
                <span className="tnum font-mono text-[12px] leading-5 text-green-700">{s.number}</span>
                <div>
                  <p className="m-0 font-medium text-ink">{s.name}</p>
                  <p className="m-0 mt-0.5 text-ink">{s.standard}</p>
                  <p className="m-0 mt-0.5 text-ink-muted">Escalation · {s.escalation}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <p className="m-0 mt-3 text-[14px] leading-5 text-ink-muted">{slaFootnote}</p>
    </CenterDialog>
  );
}
