import { useEffect, useState } from "react";

// Hash routes keep links shareable and need no rewrites on static hosting:
// #/ · #/compliance · #/financial · #/service · #/client, plus ?kpi=NN for an open drawer.
export type Destination = "overview" | "compliance" | "financial" | "service" | "client";

export interface Route {
  destination: Destination;
  kpi: string | null;
}

const destinations: Destination[] = ["compliance", "financial", "service", "client"];

export function parseHash(hash: string): Route {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  const destination = (destinations as string[]).includes(path) ? (path as Destination) : "overview";
  const kpi = new URLSearchParams(query).get("kpi");
  return { destination, kpi: kpi && /^(0[1-9]|1[01])$/.test(kpi) ? kpi : null };
}

export function href(destination: Destination, kpi?: string | null) {
  const path = destination === "overview" ? "#/" : `#/${destination}`;
  return kpi ? `${path}?kpi=${kpi}` : path;
}

/** Each change pushes a history entry, so back and forward restore destination and drawer. */
export function go(destination: Destination, kpi?: string | null) {
  window.location.hash = href(destination, kpi).slice(1);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
