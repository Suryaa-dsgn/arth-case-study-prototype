// One icon set (Phosphor), one weight (regular). Swap the library here only.
import {
  ArrowRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChatsCircle,
  CurrencyInr,
  Info,
  List,
  ShieldCheck,
  SquaresFour,
  UserCircle,
  Wrench,
  X,
} from "@phosphor-icons/react";
import type { AreaId } from "../data/kpis.ts";

const areaIcons = {
  compliance: ShieldCheck,
  financial: CurrencyInr,
  service: Wrench,
  client: ChatsCircle,
} as const;

type Size = { size?: number };

export function AreaIcon({ area, size = 20 }: { area: AreaId } & Size) {
  const Icon = areaIcons[area];
  return <Icon size={size} weight="regular" aria-hidden />;
}

export const OverviewIcon = ({ size = 20 }: Size) => <SquaresFour size={size} weight="regular" aria-hidden />;
export const OwnerIcon = ({ size = 16 }: Size) => <UserCircle size={size} weight="regular" aria-hidden />;
export const InfoIcon = ({ size = 16 }: Size) => <Info size={size} weight="regular" aria-hidden />;
export const ArrowIcon = ({ size = 16 }: Size) => <ArrowRight size={size} weight="regular" aria-hidden />;
export const CloseIcon = ({ size = 20 }: Size) => <X size={size} weight="regular" aria-hidden />;
export const MenuIcon = ({ size = 20 }: Size) => <List size={size} weight="regular" aria-hidden />;
export const PrevIcon = ({ size = 16 }: Size) => <CaretLeft size={size} weight="regular" aria-hidden />;
export const NextIcon = ({ size = 16 }: Size) => <CaretRight size={size} weight="regular" aria-hidden />;
export const ExpandIcon = ({ size = 16 }: Size) => <CaretDown size={size} weight="regular" aria-hidden />;
