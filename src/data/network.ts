/**
 * Status operacional (mock). Em produção, networkService consultaria o NOC /
 * sistema de monitoramento (Zabbix, PRTG, LibreNMS…) e o cadastro de manutenções.
 */

import type { IconName } from "@/components/ui/Icon";

export type NetworkLevel = "operational" | "degraded" | "outage";

export type MonitoredService = {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  /** disponibilidade dos últimos 30 dias (%) */
  uptime: number;
};

export const monitoredServices: MonitoredService[] = [
  { id: "fibra", name: "Internet Fibra", description: "Rede óptica e conectividade dos assinantes", icon: "wifi", uptime: 99.97 },
  { id: "central", name: "Central do Assinante", description: "Área do cliente, faturas e segunda via", icon: "layout", uptime: 99.99 },
  { id: "telefonia", name: "Telefonia", description: "Linhas fixas e ramais empresariais", icon: "phone", uptime: 99.95 },
  { id: "atendimento", name: "Atendimento", description: "WhatsApp, telefone e abertura de chamados", icon: "headphones", uptime: 100 },
  { id: "online", name: "Serviços online", description: "Site, contratação e consulta de cobertura", icon: "globe", uptime: 99.98 },
];

export const levelCopy: Record<NetworkLevel, { pill: string; title: string; text: string; label: string }> = {
  operational: {
    pill: "Rede operando normalmente",
    title: "Todos os sistemas operando normalmente",
    text: "Nenhuma instabilidade geral identificada no momento.",
    label: "Operacional",
  },
  degraded: {
    pill: "Instabilidade identificada",
    title: "Instabilidade identificada em parte da rede",
    text: "Nossa equipe técnica já está atuando. Alguns clientes podem perceber lentidão.",
    label: "Instabilidade",
  },
  outage: {
    pill: "Interrupção identificada",
    title: "Interrupção identificada em uma região",
    text: "Equipes de campo foram acionadas. Acompanhe as atualizações nesta página.",
    label: "Indisponível",
  },
};

/** Serviço afetado em cada cenário de demonstração (o restante permanece operacional). */
export const scenarioImpact: Record<NetworkLevel, { serviceId: string; region: string; since: number } | null> = {
  operational: null,
  degraded: { serviceId: "fibra", region: "Vale Serrano — Cidade Alta e Santa Rita", since: 18 },
  outage: { serviceId: "fibra", region: "Porto Ipê — Beira-Rio", since: 42 },
};

export type MaintenanceStatus = "scheduled" | "in-progress" | "done";

export type Maintenance = {
  id: string;
  title: string;
  region: string;
  date: Date;
  window: string;
  description: string;
  status: MaintenanceStatus;
};

export type Incident = {
  id: string;
  date: Date;
  title: string;
  status: "resolved" | "monitoring";
  description: string;
  duration: string;
};

export function buildMaintenances(today = new Date()): Maintenance[] {
  const at = (days: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
  return [
    {
      id: "mnt-1",
      title: "Manutenção preventiva da rede",
      region: "Bairro Centro — Santa Aurora",
      date: at(9),
      window: "02:00 às 04:00",
      description: "Durante esse período podem ocorrer pequenas interrupções no serviço.",
      status: "scheduled",
    },
    {
      id: "mnt-2",
      title: "Ampliação de capacidade do backbone",
      region: "Vale Serrano — todos os bairros",
      date: at(16),
      window: "01:00 às 03:00",
      description: "Troca de módulos ópticos para aumentar a capacidade entre cidades. Oscilações breves são esperadas.",
      status: "scheduled",
    },
    {
      id: "mnt-3",
      title: "Reorganização de caixas de atendimento",
      region: "Porto Ipê — Jardim Atlântico",
      date: at(-3),
      window: "02:00 às 05:00",
      description: "Organização de caixas ópticas para receber novos assinantes. Concluída sem impacto relevante.",
      status: "done",
    },
  ];
}

export function buildIncidents(today = new Date()): Incident[] {
  const at = (days: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
  return [
    {
      id: "inc-1",
      date: at(4),
      title: "Instabilidade parcial — Bairro Industrial",
      status: "resolved",
      description:
        "Uma falha em equipamento de rede causou instabilidade temporária na região. O serviço foi completamente normalizado.",
      duration: "1h12min",
    },
    {
      id: "inc-2",
      date: at(17),
      title: "Rompimento de cabo óptico — Vila Mar",
      status: "resolved",
      description:
        "Um cabo foi danificado durante obra de terceiros. A equipe de campo fez a emenda e restabeleceu a conexão.",
      duration: "3h40min",
    },
    {
      id: "inc-3",
      date: at(29),
      title: "Lentidão no acesso à Central do Assinante",
      status: "resolved",
      description: "Pico de acessos no dia de vencimento. Ampliamos a capacidade do servidor e o acesso voltou ao normal.",
      duration: "35min",
    },
  ];
}

/** Barras de disponibilidade (últimos 30 dias) — determinísticas por serviço. */
export function uptimeBars(serviceId: string, days = 30): ("ok" | "warn" | "down")[] {
  // 100% de disponibilidade = nenhum dia com ocorrência (o gráfico precisa bater com o número)
  if ((monitoredServices.find((m) => m.id === serviceId)?.uptime ?? 0) >= 100) return Array.from({ length: days }, () => "ok");
  let h = 0;
  for (const c of serviceId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return Array.from({ length: days }, (_, i) => {
    h = (h * 1103515245 + 12345) >>> 0;
    const r = (h >>> 8) % 100;
    if (serviceId === "fibra" && i === days - 5) return "warn";
    return r > 97 ? "warn" : "ok";
  });
}
