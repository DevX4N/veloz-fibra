"use client";

import { useEffect, useState } from "react";

/** Painel de monitoramento de link (ilustrativo) para o hero empresarial. */
export function LinkMonitor() {
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 28 }, (_, i) => 62 + Math.round(Math.sin(i / 2) * 14 + Math.cos(i) * 6)));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setBars((b) => [...b.slice(1), 50 + Math.round(Math.random() * 38)]), 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="monitor" role="img" aria-label="Painel ilustrativo de monitoramento de link empresarial: disponibilidade 99,98%, latência 3 ms">
      <div className="monitor__head" aria-hidden="true">
        <span className="mono">LINK-EMP-0427 · Matriz</span>
        <span className="badge badge--dark"><span className="dot" /> Online</span>
      </div>
      <div className="monitor__chart" aria-hidden="true">
        {bars.map((h, i) => (
          <span key={i} style={{ transform: `scaleY(${h / 100})` }} />
        ))}
      </div>
      <dl className="monitor__kpis" aria-hidden="true">
        <div><dt>Disponibilidade 30d</dt><dd className="mono">99,98%</dd></div>
        <div><dt>Latência</dt><dd className="mono">3 ms</dd></div>
        <div><dt>Banda</dt><dd className="mono">500/500</dd></div>
        <div><dt>IP fixo</dt><dd className="mono">/29</dd></div>
      </dl>
    </div>
  );
}
