/**
 * Eventos de conversão. Funciona sem nenhuma ferramenta configurada:
 * sem IDs/consentimento, os eventos ficam apenas na dataLayer local (e no console em dev).
 *
 * Nunca envie dados pessoais (CPF, e-mail, telefone, endereço) como parâmetro.
 */

export type ConversionEvent =
  | "click_whatsapp"
  | "click_signup"
  | "coverage_search"
  | "coverage_available"
  | "coverage_expansion"
  | "coverage_unavailable"
  | "plan_selected"
  | "business_lead"
  | "contract_started"
  | "contract_step"
  | "contract_completed"
  | "invoice_search"
  | "invoice_copy_pix"
  | "support_started"
  | "ticket_created"
  | "speed_test_started"
  | "speed_test_completed"
  | "customer_login"
  | "plan_upgrade_requested"
  | "contact_submitted"
  | "expansion_interest";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const BLOCKED_KEYS = /cpf|cnpj|document|email|phone|whatsapp|name|address|cep/i;

export function trackEvent(event: ConversionEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const safe = Object.fromEntries(Object.entries(params).filter(([k]) => !BLOCKED_KEYS.test(k)));
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...safe });
  window.gtag?.("event", event, safe);
  if (event === "contract_completed" || event === "business_lead") window.fbq?.("track", "Lead", safe);
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, safe);
}
