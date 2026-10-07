/**
 * Assinantes e faturas de demonstração. As datas são calculadas a partir do dia
 * atual para que a demo nunca pareça desatualizada (vencimento sempre dia 10).
 * Em produção: customerService/invoiceService consultam o ERP / sistema financeiro.
 */

import { getPlan } from "./plans";

export type InvoiceStatus = "open" | "paid" | "overdue";

export type Invoice = {
  id: string;
  reference: string;
  month: string;
  dueDate: Date;
  amount: number;
  status: InvoiceStatus;
  paidAt?: Date;
  pixCode: string;
  barcode: string;
  items: { label: string; value: number }[];
};

export type Customer = {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  birthDate: string;
  planId: string;
  status: "active" | "suspended";
  customerSince: string;
  contract: string;
  dueDay: number;
  address: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
  };
  equipment: { router: string; serial: string; ont: string; installedAt: string };
  /** true = todas as faturas pagas (demonstra empty state) */
  allPaid?: boolean;
};

export const customers: Customer[] = [
  {
    id: "c-10482",
    name: "João Silva",
    document: "123.456.789-09",
    email: "joao.silva@email.com",
    phone: "(00) 99876-5432",
    birthDate: "14/03/1988",
    planId: "700",
    status: "active",
    customerSince: "2023-05-12",
    contract: "CT-2023-08421",
    dueDay: 10,
    address: {
      cep: "12900-100",
      street: "Rua das Acácias",
      number: "128",
      complement: "Casa 2",
      district: "Jardim Primavera",
      city: "Santa Aurora",
    },
    equipment: {
      router: "Veloz AX3000 · Wi-Fi 6",
      serial: "VZ6A-21F4-88C0",
      ont: "ONT GPON 1 porta",
      installedAt: "2023-05-16",
    },
  },
  {
    id: "c-11930",
    name: "Ana Ribeiro",
    document: "987.654.321-00",
    email: "ana.ribeiro@email.com",
    phone: "(00) 99123-4567",
    birthDate: "02/09/1991",
    planId: "1000",
    status: "active",
    customerSince: "2024-02-03",
    contract: "CT-2024-01177",
    dueDay: 10,
    address: {
      cep: "12950-110",
      street: "Av. Serra Azul",
      number: "455",
      complement: "Apto 32",
      district: "Cidade Alta",
      city: "Vale Serrano",
    },
    equipment: {
      router: "Veloz AX3000 · Wi-Fi 6",
      serial: "VZ6A-33B1-02D7",
      ont: "ONT GPON 1 porta",
      installedAt: "2024-02-07",
    },
    allPaid: true,
  },
];

/** Documento sugerido nas telas de demonstração. */
export const demoDocuments = [
  { document: "123.456.789-09", hint: "Fatura em aberto" },
  { document: "987.654.321-00", hint: "Tudo em dia" },
];

function monthName(d: Date) {
  const m = d.toLocaleDateString("pt-BR", { month: "long" });
  return m.charAt(0).toUpperCase() + m.slice(1);
}

function pseudoCode(seed: string, len: number) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let out = "";
  while (out.length < len) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    out += Math.abs(h).toString().padStart(10, "0");
  }
  return out.slice(0, len);
}

export function buildInvoices(customer: Customer, today = new Date(), count = 6): Invoice[] {
  const plan = getPlan(customer.planId);
  const amount = plan?.price ?? 0;
  // fatura corrente = próximo dia de vencimento (inclusive hoje)
  const current = new Date(today.getFullYear(), today.getMonth(), customer.dueDay);
  if (today.getDate() > customer.dueDay) current.setMonth(current.getMonth() + 1);

  return Array.from({ length: count }, (_, i) => {
    const due = new Date(current.getFullYear(), current.getMonth() - i, customer.dueDay);
    const isCurrent = i === 0;
    const paid = !isCurrent || customer.allPaid;
    const ref = `${monthName(due)}/${due.getFullYear()}`;
    const id = `${customer.id}-${due.getFullYear()}${String(due.getMonth() + 1).padStart(2, "0")}`;
    const digits = pseudoCode(id, 47);
    return {
      id,
      reference: ref,
      month: monthName(due),
      dueDate: due,
      amount,
      status: paid ? "paid" : "open",
      paidAt: paid ? new Date(due.getFullYear(), due.getMonth(), customer.dueDay - 2 - (i % 3)) : undefined,
      pixCode: `00020126580014BR.GOV.BCB.PIX0136veloz-fibra-demo-${id}5204000053039865406${amount.toFixed(2)}5802BR5911VELOZ FIBRA6012SANTA AURORA62070503***6304${digits.slice(0, 4)}`,
      barcode: `${digits.slice(0, 5)}.${digits.slice(5, 10)} ${digits.slice(10, 15)}.${digits.slice(15, 21)} ${digits.slice(21, 26)}.${digits.slice(26, 32)} ${digits.slice(32, 33)} ${digits.slice(33, 47)}`,
      items: [{ label: `Plano Veloz ${plan?.name ?? ""}`, value: amount }],
    } satisfies Invoice;
  });
}
