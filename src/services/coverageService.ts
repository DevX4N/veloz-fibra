import { cities, demoAddresses, getCity, type CoverageStatus } from "@/data/coverage";
import { startingPrice } from "@/data/plans";
import { onlyDigits } from "@/utils/format";
import { ServiceError, simulateLatency } from "./core";

export type CoverageResult = {
  status: CoverageStatus;
  city: string;
  citySlug: string;
  neighborhood: string;
  street?: string;
  startingPrice: number;
};

export type AddressLookup = { cep: string; street: string; neighborhood: string; city: string; citySlug: string };

/** Lista de cidades/bairros para os selects. Futuro: GET /coverage/cities */
export async function listCities() {
  return cities.map((c) => ({
    slug: c.slug,
    name: c.name,
    neighborhoods: c.neighborhoods.map((b) => ({ id: b.id, name: b.name })),
  }));
}

/** Viabilidade por cidade + bairro. Futuro: POST /coverage/check { city, neighborhood } */
export async function checkNeighborhood(citySlug: string, neighborhoodId: string): Promise<CoverageResult> {
  await simulateLatency(900, 1400);
  const city = getCity(citySlug);
  const nb = city?.neighborhoods.find((b) => b.id === neighborhoodId);
  if (!city || !nb) throw new ServiceError("Bairro não encontrado.", "not_found");
  return { status: nb.status, city: city.name, citySlug: city.slug, neighborhood: nb.name, startingPrice };
}

/**
 * Busca de endereço por CEP (equivalente a ViaCEP/Correios).
 * Futuro: GET https://viacep.com.br/ws/{cep}/json + cruzamento com base de viabilidade.
 */
export async function lookupCep(cep: string): Promise<AddressLookup> {
  await simulateLatency(500, 800);
  const digits = onlyDigits(cep);
  if (digits.length !== 8) throw new ServiceError("CEP incompleto.", "invalid");
  if (/^0+$/.test(digits)) throw new ServiceError("Não foi possível consultar o CEP agora.", "network");
  const demo = demoAddresses.find((a) => onlyDigits(a.cep) === digits);
  if (demo) {
    const city = getCity(demo.citySlug)!;
    return { cep, street: demo.street, neighborhood: demo.neighborhood, city: city.name, citySlug: city.slug };
  }
  // Resultado determinístico para qualquer CEP: escolhe cidade e bairro a partir dos dígitos.
  const seed = digits.split("").reduce((a, d) => a * 7 + Number(d), 0);
  const city = cities[seed % cities.length];
  const nb = city.neighborhoods[Math.floor(seed / 7) % city.neighborhoods.length];
  const streets = ["Rua das Palmeiras", "Rua Sete de Setembro", "Av. Brasil", "Rua dos Girassóis", "Rua Tiradentes", "Rua da Paz"];
  return { cep, street: streets[seed % streets.length], neighborhood: nb.name, city: city.name, citySlug: city.slug };
}

/** Viabilidade por endereço completo. Futuro: POST /coverage/address { cep, number } */
export async function checkAddress(cep: string, number: string): Promise<CoverageResult> {
  const address = await lookupCep(cep);
  await simulateLatency(500, 900);
  const city = getCity(address.citySlug)!;
  const nb = city.neighborhoods.find((b) => b.name === address.neighborhood);
  return {
    status: nb?.status ?? "unavailable",
    city: city.name,
    citySlug: city.slug,
    neighborhood: address.neighborhood,
    street: `${address.street}, ${number}`,
    startingPrice,
  };
}

/** Cadastro de interesse em regiões sem cobertura. Futuro: POST /leads/expansion */
export async function registerInterest(_data: { name: string; phone: string; email: string; region: string }) {
  await simulateLatency();
  return { ok: true as const };
}
