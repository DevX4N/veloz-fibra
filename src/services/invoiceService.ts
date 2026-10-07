import { buildInvoices, customers, type Invoice } from "@/data/customers";
import { onlyDigits } from "@/utils/format";
import { isValidDocument } from "@/utils/validation";
import { ServiceError, simulateLatency } from "./core";

export type InvoiceLookup = {
  holder: string;
  documentMasked: string;
  invoices: Invoice[];
};

/** Mascara nome do titular para consulta pública (LGPD): "João S." */
function maskHolder(name: string) {
  const [first, ...rest] = name.split(" ");
  return rest.length ? `${first} ${rest[rest.length - 1][0]}.` : first;
}

function maskDocument(doc: string) {
  const d = onlyDigits(doc);
  return d.length === 11 ? `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**` : `**.${d.slice(2, 5)}.${d.slice(5, 8)}/****-**`;
}

/**
 * Segunda via pública por CPF/CNPJ.
 * Futuro: GET /billing/invoices?document=... (sistema financeiro / gateway de cobrança).
 */
export async function getInvoicesByDocument(document: string): Promise<InvoiceLookup> {
  if (!isValidDocument(document)) throw new ServiceError("Documento inválido.", "invalid");
  await simulateLatency(1000, 1500);
  const c = customers.find((x) => onlyDigits(x.document) === onlyDigits(document));
  if (!c) throw new ServiceError("Nenhum contrato encontrado para este documento.", "not_found");
  return { holder: maskHolder(c.name), documentMasked: maskDocument(c.document), invoices: buildInvoices(c) };
}

/** Futuro: GET /billing/invoices/{id}/pdf */
export async function downloadBoleto(_invoiceId: string) {
  await simulateLatency(700, 1100);
  return { ok: true as const };
}

/** Futuro: POST /billing/invoices/{id}/send-whatsapp */
export async function sendInvoiceByWhatsApp(_invoiceId: string) {
  await simulateLatency(700, 1100);
  return { ok: true as const };
}
