import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { glossary, type Term as TermId } from "../data/glossary.ts";

/** A term with an accessible definition tooltip. Opens on hover and on keyboard focus. */
export function Term({ id, children }: { id: TermId; children: ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          data-term
          className="cursor-help rounded-sm underline decoration-line-strong decoration-dotted underline-offset-4 hover:decoration-green-900"
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="z-[60] max-w-[280px] rounded-lg bg-ink px-3 py-2 text-[14px] leading-5 text-white"
        >
          {glossary[id]}
          <Tooltip.Arrow className="fill-ink" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
