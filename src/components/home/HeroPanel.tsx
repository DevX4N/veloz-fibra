"use client";

import { Server, Router, Tv, Laptop, Smartphone, Gamepad2, ArrowDown, ArrowUp, Timer } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Assinatura visual: a rota da fibra, da central até a casa do cliente,
 * com pulsos de luz percorrendo o cabo e os dispositivos conectados ao Wi-Fi.
 */

const devices = [
  { Icon: Tv, label: "Smart TV", use: "4K", x: 24 },
  { Icon: Laptop, label: "Notebook", use: "Chamada", x: 140 },
  { Icon: Smartphone, label: "Celular", use: "Stories", x: 256 },
  { Icon: Gamepad2, label: "Console", use: "Online", x: 372 },
];

function useLive(base: number, amp: number, ms = 1400) {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setV(base + Math.round((Math.random() - 0.5) * 2 * amp)), ms);
    return () => clearInterval(id);
  }, [base, amp, ms]);
  return v;
}

export function HeroPanel() {
  const down = useLive(950, 9);
  const up = useLive(480, 6, 1700);

  return (
    <div className="hero-panel" aria-label="Ilustração: rota da fibra óptica da central Veloz até sua casa" role="img">
      <div className="hero-panel__bar" aria-hidden="true">
        <span className="hero-panel__live">
          <span className="dot" /> Rede Veloz · ao vivo
        </span>
        <span className="mono">FTTH · GPON</span>
      </div>

      <svg className="hero-panel__svg" viewBox="0 0 500 300" aria-hidden="true">
        <defs>
          <linearGradient id="fiber" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#67E8F9" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#06B6D4" stopOpacity="0.35" />
            <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* malha de fundo */}
        <g className="hp-grid">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50} x2="500" y2={i * 50} />
          ))}
        </g>

        {/* ramais para outras casas da rede */}
        <path className="hp-cable hp-cable--faint" d="M250 70 C 262 40, 282 26, 330 20" />
        <path className="hp-cable hp-cable--faint" d="M250 70 C 262 34, 300 14, 476 12" />

        {/* tronco: central → divisor → sua casa */}
        <path className="hp-cable" d="M170 70 H 330" />
        <path className="hp-pulse" d="M170 70 H 330" pathLength={600} />
        <path className="hp-pulse hp-pulse--late" d="M170 70 H 330" pathLength={600} />

        {/* Wi-Fi: casa → dispositivos */}
        {devices.map((d, i) => {
          const tx = d.x + 52;
          const path = `M413 100 C 413 ${140 + i * 2}, ${tx} 132, ${tx} 182`;
          return (
            <g key={d.label}>
              <path className="hp-cable hp-cable--wifi" d={path} />
              <path className="hp-pulse hp-pulse--wifi" d={path} pathLength={600} style={{ animationDelay: `${1.1 + i * 0.35}s` }} />
            </g>
          );
        })}

        {/* nó: central */}
        <g>
          <rect className="hp-node" x="16" y="40" width="154" height="60" rx="14" />
          <rect className="hp-node__icon" x="28" y="54" width="32" height="32" rx="9" />
          <Server x={36} y={62} width={16} height={16} color="#67E8F9" strokeWidth={1.8} />
          <text className="hp-t1" x="72" y="67">Central Veloz</text>
          <text className="hp-t2" x="72" y="85">OLT · núcleo</text>
        </g>

        {/* divisor óptico */}
        <circle cx="250" cy="70" r="16" fill="url(#glow)" />
        <circle className="hp-split" cx="250" cy="70" r="5" />
        <text className="hp-t2" x="250" y="100" textAnchor="middle">divisor óptico</text>

        {/* nó: sua casa */}
        <g>
          <circle cx="413" cy="70" r="70" fill="url(#glow)" className="hp-halo" />
          <rect className="hp-node hp-node--home" x="330" y="40" width="160" height="60" rx="14" />
          <rect className="hp-node__icon hp-node__icon--home" x="342" y="54" width="32" height="32" rx="9" />
          <Router x={350} y={62} width={16} height={16} color="#ffffff" strokeWidth={1.8} />
          <text className="hp-t1" x="386" y="67">Sua casa</text>
          <text className="hp-t2" x="386" y="85">ONT · Wi-Fi 6</text>
        </g>

        {/* dispositivos */}
        {devices.map(({ Icon, label, use, x }) => (
          <g key={label}>
            <rect className="hp-device" x={x} y="182" width="104" height="58" rx="12" />
            <Icon x={x + 12} y={196} width={16} height={16} color="#CBD5E1" strokeWidth={1.8} />
            <text className="hp-t1 hp-t1--sm" x={x + 34} y="209">{label}</text>
            <circle cx={x + 16} cy="226" r="3" fill="#22C55E" />
            <text className="hp-t2" x={x + 25} y="229.5">{use}</text>
          </g>
        ))}
      </svg>

      <div className="speed-card" aria-hidden="true">
        <div className="speed-card__head">
          <strong>Sua conexão</strong>
          <span className="badge badge--green">
            <span className="dot dot--static" /> Excelente
          </span>
        </div>
        <dl className="speed-card__metrics">
          <div>
            <dt><ArrowDown size={14} /> Download</dt>
            <dd><span className="mono">{down}</span> Mbps</dd>
          </div>
          <div>
            <dt><ArrowUp size={14} /> Upload</dt>
            <dd><span className="mono">{up}</span> Mbps</dd>
          </div>
          <div>
            <dt><Timer size={14} /> Ping</dt>
            <dd><span className="mono">4</span> ms</dd>
          </div>
        </dl>
        <div className="speed-card__bar">
          <span style={{ transform: `scaleX(${down / 1000})` }} />
        </div>
      </div>
    </div>
  );
}
