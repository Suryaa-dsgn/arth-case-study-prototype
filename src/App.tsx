import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell.tsx";
import { DomainPage } from "./components/DomainPage.tsx";
import { KpiDrawer } from "./components/KpiDrawer.tsx";
import { Overview } from "./components/Overview.tsx";
import { CadencePanel, MeasurementPanel } from "./components/Panels.tsx";
import { areaById } from "./data/areas.ts";
import type { AreaId } from "./data/kpis.ts";
import { useRoute } from "./lib/route.ts";

export default function App() {
  const route = useRoute();
  const [measurement, setMeasurement] = useState(false);
  const [cadence, setCadence] = useState(false);
  const area = route.destination === "overview" ? null : areaById.get(route.destination as AreaId)!;

  // New destination: start at the top and name the page.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${area ? area.name : "Operations overview"} · arth (case-study prototype)`;
  }, [route.destination, area]);

  return (
    <Tooltip.Provider delayDuration={150}>
      <AppShell active={route.destination}>
        {area ? (
          <DomainPage area={area} />
        ) : (
          <Overview onHowTo={() => setMeasurement(true)} onCadence={() => setCadence(true)} />
        )}
      </AppShell>
      <KpiDrawer route={route} />
      <MeasurementPanel open={measurement} onOpenChange={setMeasurement} />
      <CadencePanel open={cadence} onOpenChange={setCadence} />
    </Tooltip.Provider>
  );
}
