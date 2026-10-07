"use client";

import Link from "next/link";
import { useNetworkStatus } from "@/components/providers/NetworkStatusProvider";

const dotClass = { operational: "", degraded: "dot--warn", outage: "dot--down" } as const;

/** Indicador discreto do estado da rede — leva à página de status. */
export function NetworkPill({ compact = false }: { compact?: boolean }) {
  const { level, label } = useNetworkStatus();
  return (
    <Link href="/status" className={`net-pill net-pill--${level} ${compact ? "net-pill--compact" : ""}`} aria-label={`Status da rede: ${label}`}>
      <span className={`dot ${dotClass[level]}`} aria-hidden="true" />
      <span className="net-pill__label">{label}</span>
    </Link>
  );
}
