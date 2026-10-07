import {
  buildIncidents, buildMaintenances, levelCopy, monitoredServices, scenarioImpact, uptimeBars,
  type NetworkLevel,
} from "@/data/network";
import { simulateLatency } from "./core";

export type ServiceStatus = {
  id: string;
  name: string;
  description: string;
  icon: (typeof monitoredServices)[number]["icon"];
  level: NetworkLevel;
  uptime: number;
  bars: ("ok" | "warn" | "down")[];
  note?: string;
};

/**
 * Status consolidado. O `scenario` existe apenas para a demonstração
 * (alternar estados durante a apresentação). Futuro: GET /network/status (NOC).
 */
export async function getStatus(scenario: NetworkLevel = "operational") {
  await simulateLatency(700, 1100);
  const impact = scenarioImpact[scenario];
  const services: ServiceStatus[] = monitoredServices.map((s) => {
    const affected = impact?.serviceId === s.id;
    const bars = uptimeBars(s.id);
    if (affected) bars[bars.length - 1] = scenario === "outage" ? "down" : "warn";
    return {
      ...s,
      level: affected ? scenario : "operational",
      bars,
      note: affected ? `${impact!.region} · desde ${impact!.since} min atrás` : undefined,
    };
  });
  return { level: scenario, copy: levelCopy[scenario], impact, services, updatedAt: new Date() };
}

/** Futuro: GET /network/maintenances?region=... */
export async function getMaintenances() {
  await simulateLatency(400, 700);
  return buildMaintenances();
}

/** Futuro: GET /network/incidents?limit=10 */
export async function getIncidents() {
  await simulateLatency(400, 700);
  return buildIncidents();
}
