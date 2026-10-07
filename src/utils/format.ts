const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(value: number) {
  return brl.format(value);
}

/** "99,90" — sem símbolo, para tipografia dividida (R$ | 99 | ,90) */
export function splitPrice(value: number) {
  const [int, dec] = value.toFixed(2).split(".");
  return { int, dec };
}

export function formatDate(date: Date, opts: Intl.DateTimeFormatOptions = {}) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", ...opts });
}

export function formatDayMonth(date: Date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function formatLongDate(date: Date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatWeekday(date: Date) {
  const w = date.toLocaleDateString("pt-BR", { weekday: "long" });
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export function formatMonth(date: Date) {
  const m = date.toLocaleDateString("pt-BR", { month: "long" });
  return m.charAt(0).toUpperCase() + m.slice(1);
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(date: Date) {
  return `${formatDate(date)} às ${formatTime(date)}`;
}

export function daysBetween(from: Date, to: Date) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function firstName(name: string) {
  return name.split(" ")[0];
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
