import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { CloseIcon } from "./icons.tsx";

// Thin wrappers over Radix Dialog: focus trap, Esc to close, focus return, aria wiring.
// On open, focus the panel itself rather than its first control, so a term tooltip
// does not pop open and absorb the first Esc.
const focusPanel = (e: Event) => {
  e.preventDefault();
  (e.currentTarget as HTMLElement | null)?.focus();
};

const overlay =
  "fixed inset-0 z-40 bg-ink/30 data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]";

export function SideSheet({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  widthClass = "sm:w-[480px]",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  side?: "left" | "right";
  widthClass?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />
        <Dialog.Content
          onOpenAutoFocus={focusPanel}
          className={`fixed inset-y-0 z-50 flex w-full flex-col bg-surface shadow-[0_0_40px_rgba(22,34,12,0.14)] outline-none ${widthClass} ${
            side === "right"
              ? "right-0 data-[state=open]:animate-[sheet-in-right_200ms_ease-out]"
              : "left-0 data-[state=open]:animate-[sheet-in-left_200ms_ease-out]"
          }`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
            <div className="min-w-0">
              <Dialog.Title asChild>
                <div>{title}</div>
              </Dialog.Title>
              {description ? (
                <Dialog.Description asChild>
                  <div>{description}</div>
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">Details panel</Dialog.Description>
              )}
            </div>
            <Dialog.Close className="-mr-2 shrink-0 rounded-md p-2 text-ink-muted hover:bg-surface-2 hover:text-ink" aria-label="Close">
              <CloseIcon />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CenterDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlay} />
        <Dialog.Content
          onOpenAutoFocus={focusPanel}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[min(88vh,820px)] w-[calc(100vw-32px)] max-w-[760px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-surface shadow-[0_0_40px_rgba(22,34,12,0.14)] outline-none data-[state=open]:animate-[fade-in_200ms_ease-out]">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
            <div>
              <Dialog.Title className="m-0 text-[20px] leading-7 font-semibold">{title}</Dialog.Title>
              <Dialog.Description className="m-0 mt-0.5 text-[14px] leading-5 text-ink-muted">{description}</Dialog.Description>
            </div>
            <Dialog.Close className="-mr-2 shrink-0 rounded-md p-2 text-ink-muted hover:bg-surface-2 hover:text-ink" aria-label="Close">
              <CloseIcon />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
