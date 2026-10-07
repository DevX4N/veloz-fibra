/**
 * Infraestrutura comum da camada de serviços.
 *
 * Hoje todos os serviços respondem com dados simulados. Para integrar um back-end real,
 * substitua o corpo de cada função por chamadas a `apiFetch` mantendo as mesmas
 * assinaturas — a interface não precisa mudar.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || null;

/** Latência simulada para que estados de carregamento sejam percebidos na demonstração. */
export function simulateLatency(min = 650, max = 1200) {
  const ms = min + Math.random() * (max - min);
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export class ServiceError extends Error {
  constructor(message: string, public code: "network" | "not_found" | "invalid" = "network") {
    super(message);
  }
}

/** Ponto único de chamada HTTP para quando existir API (ERP, CRM, financeiro...). */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new ServiceError("API não configurada.");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new ServiceError(`Erro ${res.status} ao consultar ${path}`);
  return res.json() as Promise<T>;
}

/** Armazenamento de sessão tolerante a falhas (aba anônima, cookies bloqueados). */
export const sessionStore = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* armazenamento indisponível: segue em memória */
    }
  },
  remove(key: string) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};

export const localStore = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  },
};

/** Protocolo pseudoaleatório no formato usado pelo atendimento. */
export function newProtocol() {
  return `#${Math.floor(48000 + Math.random() * 1900)}`;
}
