import { onlyDigits } from "./format";

export function isValidCPF(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10]);
}

export function isValidCNPJ(value: string) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (len: number) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, w, i) => acc + Number(cnpj[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return calc(12) === Number(cnpj[12]) && calc(13) === Number(cnpj[13]);
}

export function isValidDocument(value: string) {
  const d = onlyDigits(value);
  return d.length === 11 ? isValidCPF(d) : d.length === 14 ? isValidCNPJ(d) : false;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidPhone(value: string) {
  const d = onlyDigits(value);
  return d.length === 10 || d.length === 11;
}

export function isValidMobile(value: string) {
  const d = onlyDigits(value);
  return d.length === 11 && d[2] === "9";
}

export function isValidCEP(value: string) {
  return onlyDigits(value).length === 8;
}

/** dd/mm/aaaa, data real e idade mínima. */
export function validateBirthDate(value: string, minAge = 18): string | null {
  const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "Informe a data no formato dd/mm/aaaa.";
  const [, dd, mm, yyyy] = m.map(Number) as unknown as number[];
  const date = new Date(yyyy, mm - 1, dd);
  if (date.getFullYear() !== yyyy || date.getMonth() !== mm - 1 || date.getDate() !== dd)
    return "Essa data não existe. Confira dia e mês.";
  const now = new Date();
  let age = now.getFullYear() - yyyy;
  if (now.getMonth() < mm - 1 || (now.getMonth() === mm - 1 && now.getDate() < dd)) age--;
  if (age < minAge) return `O titular precisa ter ${minAge} anos ou mais.`;
  if (age > 120) return "Confira o ano de nascimento.";
  return null;
}

export type Errors<T> = Partial<Record<keyof T, string>>;

/** Validador declarativo simples: cada regra devolve mensagem ou null. */
export function validate<T extends Record<string, unknown>>(
  values: T,
  rules: Partial<Record<keyof T, (v: T[keyof T], all: T) => string | null>>,
): Errors<T> {
  const errors: Errors<T> = {};
  for (const key in rules) {
    const rule = rules[key];
    const msg = rule?.(values[key], values);
    if (msg) errors[key] = msg;
  }
  return errors;
}

export const required = (label: string) => (v: unknown) =>
  typeof v === "string" && v.trim() ? null : `Informe ${label}.`;
