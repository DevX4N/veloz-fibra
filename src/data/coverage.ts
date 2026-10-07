/**
 * Cidades, bairros e viabilidade (mock). Em produção, a fonte seria a API de
 * viabilidade técnica do provedor — consumida via coverageService.
 * Cidades e bairros são fictícios.
 */

export type CoverageStatus = "available" | "expansion" | "unavailable";

export type Neighborhood = {
  id: string;
  name: string;
  status: CoverageStatus;
};

export type City = {
  slug: string;
  name: string;
  /** Texto curto usado no SEO local */
  blurb: string;
  /** Posição do agrupamento no mapa esquemático (0–100) */
  map: { x: number; y: number };
  neighborhoods: Neighborhood[];
};

function n(city: string, list: [string, CoverageStatus][]): Neighborhood[] {
  return list.map(([name, status]) => ({
    id: `${city}:${name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-")}`,
    name,
    status,
  }));
}

export const cities: City[] = [
  {
    slug: "santa-aurora",
    name: "Santa Aurora",
    blurb: "Sede da Veloz Fibra e primeira cidade conectada pela nossa rede.",
    map: { x: 30, y: 38 },
    neighborhoods: n("santa-aurora", [
      ["Centro", "available"],
      ["Jardim Primavera", "available"],
      ["Vila Nova", "available"],
      ["Bela Vista", "available"],
      ["Industrial", "available"],
      ["São José", "available"],
      ["Parque das Árvores", "available"],
      ["Alto da Colina", "available"],
      ["Jardim América", "available"],
      ["Boa Vista", "available"],
      ["Santa Luzia", "available"],
      ["Morada do Sol", "available"],
      ["Recanto Verde", "expansion"],
      ["Chácaras do Lago", "unavailable"],
    ]),
  },
  {
    slug: "vale-serrano",
    name: "Vale Serrano",
    blurb: "Rede óptica presente nos principais bairros residenciais e comerciais.",
    map: { x: 70, y: 30 },
    neighborhoods: n("vale-serrano", [
      ["Centro", "available"],
      ["Jardim das Flores", "available"],
      ["Vila Operária", "available"],
      ["Cidade Alta", "available"],
      ["Parque Imperial", "available"],
      ["Santa Rita", "available"],
      ["Novo Horizonte", "available"],
      ["Lagoa Seca", "available"],
      ["Residencial Ipês", "expansion"],
    ]),
  },
  {
    slug: "porto-ipe",
    name: "Porto Ipê",
    blurb: "Fibra óptica chegando à orla e aos bairros centrais.",
    map: { x: 36, y: 76 },
    neighborhoods: n("porto-ipe", [
      ["Centro", "available"],
      ["Beira-Rio", "available"],
      ["Jardim Atlântico", "available"],
      ["Vila Mar", "available"],
      ["São Pedro", "available"],
      ["Praia do Sossego", "expansion"],
      ["Zona Rural", "unavailable"],
    ]),
  },
  {
    slug: "monte-alvo",
    name: "Monte Alvo",
    blurb: "Nova frente de expansão da rede, com obras em andamento.",
    map: { x: 76, y: 72 },
    neighborhoods: n("monte-alvo", [
      ["Centro", "expansion"],
      ["Vila Rica", "expansion"],
      ["Planalto", "expansion"],
      ["Distrito Industrial", "unavailable"],
    ]),
  },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export function cityStats(city: City) {
  const available = city.neighborhoods.filter((b) => b.status === "available").length;
  const expansion = city.neighborhoods.filter((b) => b.status === "expansion").length;
  return { available, expansion, status: (available > 0 ? "available" : "expansion") as CoverageStatus };
}

export const coverageTotals = (() => {
  const all = cities.flatMap((c) => c.neighborhoods);
  return {
    neighborhoods: all.filter((b) => b.status === "available").length,
    cities: cities.filter((c) => cityStats(c).available > 0).length,
    expansionCities: cities.filter((c) => cityStats(c).available === 0).length,
    expansionNeighborhoods: all.filter((b) => b.status === "expansion").length,
  };
})();

/**
 * CEPs de demonstração — facilitam a apresentação ao vivo dos três resultados.
 * Qualquer outro CEP válido recebe um resultado determinístico (ver coverageService).
 */
export const demoAddresses: {
  cep: string;
  street: string;
  citySlug: string;
  neighborhood: string;
  hint: string;
}[] = [
  { cep: "12900-100", street: "Rua das Acácias", citySlug: "santa-aurora", neighborhood: "Jardim Primavera", hint: "Com cobertura" },
  { cep: "12950-300", street: "Rua dos Ipês Amarelos", citySlug: "vale-serrano", neighborhood: "Residencial Ipês", hint: "Em expansão" },
  { cep: "12980-900", street: "Estrada Municipal do Sertão", citySlug: "porto-ipe", neighborhood: "Zona Rural", hint: "Sem cobertura" },
];
