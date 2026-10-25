import type { ReactNode } from "react";
import markSvg from "./arth-mark.svg?raw";
import { InfoIcon, OwnerIcon } from "./icons.tsx";

export function ArthMark({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 [&>svg]:h-full [&>svg]:w-full"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: markSvg }}
    />
  );
}

export function Panel({
  className = "",
  children,
  ...rest
}: { className?: string; children: ReactNode } & Record<`data-${string}`, string>) {
  return (
    <section className={`rounded-xl border border-line bg-surface ${className}`} {...rest}>
      {children}
    </section>
  );
}

type BadgeTone = "verified" | "proposed" | "neutral";

const badgeTone: Record<BadgeTone, string> = {
  verified: "bg-lime-soft text-ink border-lime-soft",
  proposed: "bg-surface text-green-900 border-line-strong",
  neutral: "bg-transparent text-ink-muted border-transparent px-0",
};

export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-[3px] font-mono text-[12px] leading-4 font-medium tracking-[0.06em] uppercase ${badgeTone[tone]}`}
    >
      {children}
    </span>
  );
}

/** Inline qualifier shown beside a value, e.g. "Not confirmed arrears". */
export function CaveatMarker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1 text-[14px] leading-5 text-ink-muted">
      <InfoIcon />
      {children}
    </span>
  );
}

/** Site-style kicker: short leading rule and uppercase tracked green label. */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[12px] leading-4 font-medium tracking-[0.06em] text-green-700 uppercase ${className}`}
    >
      <span aria-hidden className="h-[2px] w-4 bg-green-900" />
      {children}
    </span>
  );
}

/** Lime band behind the lower part of one word, word stays in ink (site "Simple." treatment). */
export function Highlight({ children }: { children: string }) {
  return (
    <span className="relative inline-block px-[0.08em]">
      <span aria-hidden className="absolute inset-x-0 bottom-[0.06em] h-[0.42em] -skew-x-6 rounded-[2px] bg-lime" />
      <span className="relative">{children}</span>
    </span>
  );
}

export function Owner({ role }: { role: string }) {
  // Label and role share one text run so long roles wrap as words, not as separate flex items.
  return (
    <span className="inline-flex items-start gap-1.5 text-[14px] leading-5 text-ink">
      <span className="mt-0.5 shrink-0 text-green-900">
        <OwnerIcon />
      </span>
      <span>
        <span className="text-ink-muted">Owner · </span>
        <span className="font-medium">{role}</span>
      </span>
    </span>
  );
}
