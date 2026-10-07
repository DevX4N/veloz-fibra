import Link from "next/link";
import { company } from "@/config/site";

/**
 * Símbolo: três fibras que convergem em um único ponto de luz —
 * várias conexões, um sinal. Funciona em 16px (favicon) e em grandes formatos.
 */
export function LogoMark({ size = 32, tone = "dark" }: { size?: number; tone?: "dark" | "light" }) {
  // cores sólidas por fibra (sem <linearGradient>): evita IDs duplicados quando há mais de um logo na página
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill={tone === "dark" ? "#0F172A" : "#FFFFFF"} />
      <g fill="none" strokeWidth="2.6" strokeLinecap="round">
        <path d="M6.5 10.5h7.2c4.3 0 5.2 5.5 9.3 5.5" stroke="#2563EB" />
        <path d="M6.5 16h16" stroke="#0EA5E9" />
        <path d="M6.5 21.5h7.2c4.3 0 5.2-5.5 9.3-5.5" stroke="#06B6D4" />
      </g>
      <circle cx="24.6" cy="16" r="2.6" fill="#67E8F9" />
    </svg>
  );
}

export function Logo({ tone = "dark", href = "/" }: { tone?: "dark" | "light"; href?: string | null }) {
  const body = (
    <span className={`logo logo--${tone}`}>
      <LogoMark tone={tone === "dark" ? "dark" : "light"} />
      <span className="logo__word">
        <strong>Veloz</strong>
        <span>Fibra</span>
      </span>
    </span>
  );
  if (!href) return body;
  return (
    <Link href={href} aria-label={`${company.name} — página inicial`} className="logo-link">
      {body}
    </Link>
  );
}
