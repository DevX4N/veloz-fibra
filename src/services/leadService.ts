import { getPlan } from "@/data/plans";
import { newProtocol, simulateLatency } from "./core";

/**
 * Captação de leads e pedidos. Em produção, encaminhar para CRM (RD Station,
 * HubSpot, Pipedrive…) ou para o módulo comercial do ERP do provedor.
 */

export type BusinessLead = {
  company: string;
  name: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  employees: string;
  needs: string[];
};

/** Futuro: POST /leads/business */
export async function submitBusinessLead(_lead: BusinessLead) {
  await simulateLatency(1000, 1400);
  return { ok: true as const, protocol: newProtocol() };
}

/** Futuro: POST /contact */
export async function submitContact(_data: { name: string; email: string; phone: string; subject: string; message: string }) {
  await simulateLatency(900, 1300);
  return { ok: true as const, protocol: newProtocol() };
}

/** Futuro: POST /careers/applications */
export async function submitApplication(_data: { name: string; email: string; position: string }) {
  await simulateLatency();
  return { ok: true as const };
}

export type ContractOrder = {
  address: { cep: string; city: string; neighborhood: string; street: string; number: string; complement: string };
  planId: string;
  customer: { name: string; cpf: string; birthDate: string; phone: string; email: string };
  installation: { date: string; period: "manha" | "tarde" };
};

/**
 * Pedido de contratação online. Nenhum pagamento é processado.
 * Futuro: POST /orders → ERP (pré-cadastro + ordem de serviço de instalação).
 */
export async function submitContract(order: ContractOrder) {
  await simulateLatency(1300, 1800);
  return { ok: true as const, protocol: newProtocol(), plan: getPlan(order.planId) };
}
