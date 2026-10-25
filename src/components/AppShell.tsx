import * as Dialog from "@radix-ui/react-dialog";
import { useState, type ReactNode } from "react";
import { areas } from "../data/areas.ts";
import { href, type Destination } from "../lib/route.ts";
import { AreaIcon, CloseIcon, InfoIcon, MenuIcon, OverviewIcon } from "./icons.tsx";
import { ArthMark } from "./ui.tsx";

const nav: { id: Destination; label: string; short: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", short: "Overview", icon: <OverviewIcon /> },
  ...areas.map((a) => ({ id: a.id as Destination, label: a.name, short: a.shortName, icon: <AreaIcon area={a.id} /> })),
];

function Wordmark() {
  return (
    <a href={href("overview")} className="flex items-center gap-2 text-green-900">
      <ArthMark size={26} />
      <span className="text-[26px] leading-none font-semibold tracking-[-0.03em]">arth</span>
      <span className="sr-only">Operations overview</span>
    </a>
  );
}

function PrototypeChip() {
  return (
    <span className="inline-flex rounded-md bg-green-900 px-2 py-[3px] font-mono text-[12px] leading-4 font-medium tracking-[0.06em] whitespace-nowrap text-white uppercase">
      Case study prototype
    </span>
  );
}

function NavList({ active, onNavigate }: { active: Destination; onNavigate?: () => void }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-1 p-0">
      {nav.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={href(item.id)}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] leading-5 ${
                isActive ? "bg-surface-2 font-medium text-ink" : "text-ink-muted hover:bg-bg hover:text-ink"
              }`}
            >
              {isActive && <span aria-hidden className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-lime" />}
              <span className={isActive ? "text-green-900" : ""}>{item.icon}</span>
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Sidebar({ active }: { active: Destination }) {
  return (
    <div className="hidden w-[248px] shrink-0 border-r border-line bg-surface lg:block">
      <aside className="sticky top-0 flex h-screen flex-col px-4 pt-6 pb-5">
        <div className="px-2">
          <Wordmark />
          <p className="m-0 mt-2 font-mono text-[12px] leading-4 tracking-[0.06em] text-ink-muted uppercase">
            Operations dashboard
          </p>
        </div>
        <nav aria-label="Primary" className="mt-8">
          <NavList active={active} />
        </nav>
        <div className="mt-auto border-t border-line px-2 pt-4">
          <p className="m-0 font-mono text-[12px] leading-4 tracking-[0.06em] text-ink-muted uppercase">Historical snapshot</p>
          <p className="tnum m-0 mt-1 text-[15px] leading-5 font-medium text-ink">19 Sep 2026</p>
          <div className="mt-3">
            <PrototypeChip />
          </div>
        </div>
      </aside>
    </div>
  );
}

/** Below 1024px: top bar. 768 to 1023 shows a labelled tab row; under 768 a menu sheet. */
function TopBar({ active }: { active: Destination }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-surface lg:hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <Wordmark />
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex">
            <PrototypeChip />
          </span>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="rounded-md border border-line-strong p-2 text-ink md:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/30" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[84vw] max-w-[320px] flex-col bg-surface px-4 pt-5 pb-5 outline-none">
                <div className="flex items-center justify-between px-2">
                  <Dialog.Title className="m-0 text-[16px] leading-[22px] font-semibold">Navigate</Dialog.Title>
                  <Dialog.Close className="rounded-md p-2 text-ink-muted hover:bg-surface-2" aria-label="Close navigation">
                    <CloseIcon />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Dashboard destinations</Dialog.Description>
                <nav aria-label="Primary" className="mt-4">
                  <NavList active={active} onNavigate={() => setOpen(false)} />
                </nav>
                <div className="mt-auto px-2">
                  <p className="m-0 text-[14px] leading-5 text-ink-muted">Historical snapshot · 19 Sep 2026</p>
                  <div className="mt-2">
                    <PrototypeChip />
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <nav aria-label="Primary" className="hidden border-t border-line px-3 md:block">
        <ul className="m-0 flex list-none gap-1 p-0">
          {nav.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-[14px] leading-5 ${
                    isActive ? "border-lime font-medium text-ink" : "border-transparent text-ink-muted hover:text-ink"
                  }`}
                >
                  <span className={isActive ? "text-green-900" : ""}>{item.icon}</span>
                  {item.short}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function DisclaimerBar() {
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem("arth-disclaimer") === "hidden";
    } catch {
      return false;
    }
  });
  if (hidden) return null;
  return (
    <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-5 py-2 text-[14px] leading-5 text-ink-muted lg:px-10">
      <span className="shrink-0 text-green-900">
        <InfoIcon />
      </span>
      <p className="m-0 flex-1">
        Conceptual case-study prototype using supplied historical sample data. Not Arth&apos;s live platform.
      </p>
      <button
        type="button"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem("arth-disclaimer", "hidden");
          } catch {
            // storage unavailable: hidden until reload
          }
        }}
        className="shrink-0 rounded-md p-1 text-ink-muted hover:bg-surface hover:text-ink"
        aria-label="Hide disclaimer for this session"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}

export function AppShell({ active, children }: { active: Destination; children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only z-50 rounded-md bg-green-900 px-3 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Sidebar active={active} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar active={active} />
        <DisclaimerBar />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
