/**
 * Catálogo de planos. Fonte única consumida por cards, comparativos, contratação,
 * páginas locais e área do cliente. Em produção, viria do ERP/CRM via planService.
 */

export type PlanSegment = "residencial" | "empresarial";

export type Plan = {
  id: string;
  segment: PlanSegment;
  name: string;
  /** Rótulo curto da velocidade, ex.: "700 Mega" */
  speedLabel: string;
  /** Mbps de download */
  speed: number;
  /** Mbps de upload */
  upload: number;
  /** null = preço sob consulta (planos empresariais) */
  price: number | null;
  featured?: boolean;
  badge?: string;
  wifi: string;
  installation: string;
  idealFor: string[];
  benefits: string[];
  cta: string;
  /** Dispositivos simultâneos recomendados (comparativo) */
  devices: string;
  available: boolean;
};

export const plans: Plan[] = [
  {
    id: "500",
    segment: "residencial",
    name: "500 Mega",
    speedLabel: "500 Mega",
    speed: 500,
    upload: 250,
    price: 79.9,
    wifi: "Wi-Fi 5",
    installation: "Rápida",
    idealFor: ["Redes sociais", "Streaming", "Home office", "Até 5 dispositivos"],
    benefits: ["500 Mbps", "Wi-Fi incluso", "Instalação rápida", "Suporte especializado"],
    cta: "Quero 500 Mega",
    devices: "Até 5",
    available: true,
  },
  {
    id: "700",
    segment: "residencial",
    name: "700 Mega",
    speedLabel: "700 Mega",
    speed: 700,
    upload: 350,
    price: 99.9,
    featured: true,
    badge: "Mais escolhido",
    wifi: "Wi-Fi 6",
    installation: "Grátis",
    idealFor: ["Família conectada", "Streaming 4K", "Home office", "Jogos online"],
    benefits: ["700 Mbps", "Wi-Fi 6", "Instalação grátis", "Suporte prioritário"],
    cta: "Quero 700 Mega",
    devices: "Até 10",
    available: true,
  },
  {
    id: "1000",
    segment: "residencial",
    name: "1 Giga",
    speedLabel: "1 Giga",
    speed: 1000,
    upload: 500,
    price: 129.9,
    wifi: "Wi-Fi 6",
    installation: "Grátis",
    idealFor: ["Gamers", "Muitos dispositivos", "Smart Home", "Downloads pesados", "Streaming 4K"],
    benefits: ["1 Gbps", "Wi-Fi 6", "Instalação grátis", "Suporte prioritário"],
    cta: "Quero 1 Giga",
    devices: "15 ou mais",
    available: true,
  },
  {
    id: "emp-500",
    segment: "empresarial",
    name: "Empresa 500",
    speedLabel: "500 Mega",
    speed: 500,
    upload: 250,
    price: null,
    wifi: "Wi-Fi empresarial",
    installation: "Agendada",
    idealFor: ["Pequenos escritórios", "Consultórios", "Lojas", "Equipes pequenas"],
    benefits: ["Fibra óptica", "Wi-Fi empresarial", "Alta estabilidade", "Suporte especializado"],
    cta: "Solicitar proposta",
    devices: "Até 15",
    available: true,
  },
  {
    id: "emp-700",
    segment: "empresarial",
    name: "Empresa 700",
    speedLabel: "700 Mega",
    speed: 700,
    upload: 350,
    price: null,
    featured: true,
    badge: "Recomendado",
    wifi: "Wi-Fi empresarial",
    installation: "Agendada",
    idealFor: ["Escritórios em crescimento", "Clínicas", "Comércio com PDV", "Equipes híbridas"],
    benefits: ["Excelente upload", "Alta velocidade", "Equipamentos profissionais", "Atendimento especializado"],
    cta: "Solicitar proposta",
    devices: "Até 30",
    available: true,
  },
  {
    id: "emp-pro",
    segment: "empresarial",
    name: "Empresa Pro",
    speedLabel: "1 Giga",
    speed: 1000,
    upload: 500,
    price: null,
    wifi: "Wi-Fi empresarial",
    installation: "Agendada",
    idealFor: ["Operações críticas", "Sistemas em nuvem", "Câmeras e servidores", "Várias equipes"],
    benefits: [
      "Grande capacidade",
      "Excelente upload",
      "Equipamentos premium",
      "Suporte prioritário",
      "Infraestrutura profissional",
    ],
    cta: "Falar com especialista",
    devices: "30 ou mais",
    available: true,
  },
];

export const residentialPlans = plans.filter((p) => p.segment === "residencial");
export const businessPlans = plans.filter((p) => p.segment === "empresarial");
export const startingPrice = Math.min(...residentialPlans.map((p) => p.price ?? Infinity));

export function getPlan(id: string | null | undefined) {
  return plans.find((p) => p.id === id);
}

/** Itens do comparativo de planos residenciais. */
export const comparisonRows: { label: string; value: (p: Plan) => string }[] = [
  { label: "Download", value: (p) => `${p.speed} Mbps` },
  { label: "Upload", value: (p) => `${p.upload} Mbps` },
  { label: "Roteador", value: (p) => p.wifi },
  { label: "Instalação", value: (p) => p.installation },
  { label: "Dispositivos simultâneos", value: (p) => p.devices },
  { label: "Suporte", value: (p) => (p.featured || p.speed >= 1000 ? "Prioritário" : "Especializado") },
];
