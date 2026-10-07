import { buildInvoices, customers, type Customer, type Invoice } from "@/data/customers";
import { buildTickets, type Notification, type Ticket } from "@/data/account";
import { getPlan } from "@/data/plans";
import { buildMaintenances } from "@/data/network";
import { formatDate, formatPrice, onlyDigits, daysBetween } from "@/utils/format";
import { newProtocol, ServiceError, sessionStore, simulateLatency } from "./core";

const SESSION_KEY = "vf:session";
const TICKETS_KEY = "vf:tickets";
const PLAN_REQUEST_KEY = "vf:plan-request";
const PROFILE_KEY = "vf:profile";

type Session = { customerId: string };

function findByDocument(doc: string) {
  const d = onlyDigits(doc);
  return customers.find((c) => onlyDigits(c.document) === d);
}

/* ---------------------------- autenticação (demo) ---------------------------- */

/**
 * Login demonstrativo: aceita os documentos de demonstração com qualquer senha
 * de 4+ caracteres. Futuro: POST /auth/login → token JWT/sessão do ERP.
 */
export async function login(document: string, password: string) {
  await simulateLatency(800, 1200);
  const customer = findByDocument(document);
  if (!customer) throw new ServiceError("Não encontramos um cadastro com esse CPF ou CNPJ.", "not_found");
  if (password.length < 4) throw new ServiceError("Senha incorreta. Confira e tente novamente.", "invalid");
  sessionStore.set(SESSION_KEY, { customerId: customer.id } satisfies Session);
  return customer;
}

export function logout() {
  sessionStore.remove(SESSION_KEY);
  sessionStore.remove(TICKETS_KEY);
  sessionStore.remove(PLAN_REQUEST_KEY);
  sessionStore.remove(PROFILE_KEY);
}

export function currentSession() {
  return sessionStore.get<Session | null>(SESSION_KEY, null);
}

/** Futuro: GET /customers/me */
export async function getCustomer(): Promise<Customer> {
  await simulateLatency(500, 900);
  const session = currentSession();
  const base = customers.find((c) => c.id === session?.customerId);
  if (!base) throw new ServiceError("Sessão expirada.", "not_found");
  const profile = sessionStore.get<Partial<Customer> | null>(PROFILE_KEY, null);
  return { ...base, ...(profile || {}) };
}

/** Futuro: PATCH /customers/me */
export async function updateCustomer(data: Pick<Customer, "email" | "phone">) {
  await simulateLatency();
  sessionStore.set(PROFILE_KEY, data);
  return { ok: true as const };
}

/* ---------------------------------- faturas ---------------------------------- */

/** Futuro: GET /customers/me/invoices */
export async function getMyInvoices(): Promise<Invoice[]> {
  await simulateLatency(500, 900);
  const c = customers.find((x) => x.id === currentSession()?.customerId);
  if (!c) throw new ServiceError("Sessão expirada.", "not_found");
  return buildInvoices(c);
}

/* -------------------------------- alterar plano ------------------------------- */

export type PlanRequest = { fromId: string; toId: string; requestedAt: string; protocol: string };

/** Futuro: POST /customers/me/plan-change */
export async function requestPlanChange(fromId: string, toId: string): Promise<PlanRequest> {
  await simulateLatency(900, 1300);
  const req = { fromId, toId, requestedAt: new Date().toISOString(), protocol: newProtocol() };
  sessionStore.set(PLAN_REQUEST_KEY, req);
  return req;
}

export function pendingPlanRequest() {
  return sessionStore.get<PlanRequest | null>(PLAN_REQUEST_KEY, null);
}

/* ---------------------------------- chamados ---------------------------------- */

type StoredTicket = Omit<Ticket, "createdAt" | "updatedAt" | "timeline"> & {
  createdAt: string;
  updatedAt: string;
  timeline: { at: string; text: string }[];
};

function revive(t: StoredTicket): Ticket {
  return {
    ...t,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
    timeline: t.timeline.map((e) => ({ ...e, at: new Date(e.at) })),
  };
}

/** Futuro: GET /customers/me/tickets */
export async function listTickets(): Promise<Ticket[]> {
  await simulateLatency(500, 900);
  const created = sessionStore.get<StoredTicket[]>(TICKETS_KEY, []).map(revive);
  return [...created, ...buildTickets()];
}

/** Futuro: POST /tickets (sistema de chamados / helpdesk) */
export async function createTicket(subject: string, description: string): Promise<Ticket> {
  await simulateLatency(1000, 1400);
  const now = new Date();
  const ticket: Ticket = {
    protocol: newProtocol(),
    subject,
    description,
    status: "open",
    createdAt: now,
    updatedAt: now,
    timeline: [{ at: now, text: "Atendimento aberto pela Área do Cliente." }],
  };
  const stored = sessionStore.get<StoredTicket[]>(TICKETS_KEY, []);
  sessionStore.set(TICKETS_KEY, [
    { ...ticket, createdAt: now.toISOString(), updatedAt: now.toISOString(), timeline: [{ at: now.toISOString(), text: ticket.timeline[0].text }] },
    ...stored,
  ]);
  return ticket;
}

/* -------------------------------- notificações -------------------------------- */

/** Notificações derivadas do estado real da conta (fatura, rede, upgrade). */
export async function getNotifications(): Promise<Notification[]> {
  const c = customers.find((x) => x.id === currentSession()?.customerId);
  if (!c) return [];
  const invoices = buildInvoices(c);
  const open = invoices.find((i) => i.status === "open");
  const list: Notification[] = [];
  if (open) {
    const days = daysBetween(new Date(), open.dueDate);
    list.push({
      id: "n-billing",
      kind: "billing",
      title: days <= 0 ? "Sua fatura vence hoje" : `Sua fatura vence em ${days} ${days === 1 ? "dia" : "dias"}`,
      text: `Valor: ${formatPrice(open.amount)} · vencimento ${formatDate(open.dueDate)}`,
      cta: "Pagar agora",
      href: "/area-do-cliente/faturas",
      unread: true,
    });
  }
  const plan = getPlan(c.planId);
  if (plan && plan.speed < 1000) {
    list.push({
      id: "n-upgrade",
      kind: "upgrade",
      title: "Upgrade disponível",
      text: "Sua região agora possui plano de 1 Giga.",
      cta: "Conhecer plano",
      href: "/area-do-cliente/plano",
      unread: true,
    });
  }
  const m = buildMaintenances()[0];
  list.push({
    id: "n-maintenance",
    kind: "maintenance",
    title: "Manutenção programada",
    text: `Haverá manutenção preventiva em ${formatDate(m.date)}, durante a madrugada (${m.window}).`,
    cta: "Ver detalhes",
    href: "/status",
    unread: false,
  });
  return list;
}
