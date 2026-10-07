"use client";

import { useEffect, useState } from "react";

const SAMPLES = 36;

function seed() {
  return Array.from({ length: SAMPLES }, (_, i) => 4 + Math.round(Math.sin(i * 1.7) * 0.8 + Math.cos(i * 0.6) * 0.5));
}

/** Medidor de latência ao vivo (simulado) — "PING 4 ms". */
export function PingMeter() {
  const [data, setData] = useState<number[]>(seed);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setData((d) => {
        const r = Math.random();
        const next = r > 0.92 ? 6 : r > 0.7 ? 5 : r > 0.25 ? 4 : 3;
        return [...d.slice(1), next];
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const w = 320;
  const h = 72;
  const max = 10;
  const pts = data.map((v, i) => `${(i / (SAMPLES - 1)) * w},${h - (v / max) * h}`).join(" ");
  const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);

  return (
    <div className="ping">
      <div className="ping__top">
        <span className="ping__label mono">PING</span>
        <span className="badge badge--dark">
          <span className="dot" aria-hidden="true" /> estável
        </span>
      </div>
      <p className="ping__value" aria-label={`Ping médio de ${avg} milissegundos`}>
        <span className="mono">{avg}</span>
        <small>ms</small>
      </p>
      <svg className="ping__chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ping-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#06B6D4" stopOpacity="0.35" />
            <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" x2={w} y1={h - (20 / max) * h * 0.25} y2={h - (20 / max) * h * 0.25} className="ping__ref" />
        <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#ping-fill)" />
        <polyline points={pts} className="ping__line" />
      </svg>
      <dl className="ping__meta">
        <div>
          <dt>Jitter</dt>
          <dd className="mono">1 ms</dd>
        </div>
        <div>
          <dt>Perda de pacotes</dt>
          <dd className="mono">0%</dd>
        </div>
        <div>
          <dt>Rota</dt>
          <dd className="mono">Fibra direta</dd>
        </div>
      </dl>
    </div>
  );
}
