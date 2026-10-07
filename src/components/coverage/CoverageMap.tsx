"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cities, cityStats, coverageTotals, type CoverageStatus } from "@/data/coverage";

/**
 * Mapa esquemático de cobertura (células hexagonais por bairro).
 * Preparado para trocar por Google Maps / Mapbox / Leaflet: basta substituir
 * <SchematicMap> mantendo a lista lateral e a legenda, que consomem os mesmos dados.
 */

const W = 1000;
const H = 640;
const SIZE = 25;

function axialSpiral(count: number) {
  const out: [number, number][] = [[0, 0]];
  const dirs: [number, number][] = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  for (let k = 1; out.length < count; k++) {
    let q = -k;
    let r = k;
    for (let side = 0; side < 6; side++) {
      for (let step = 0; step < k; step++) {
        if (out.length < count) out.push([q, r]);
        q += dirs[side][0];
        r += dirs[side][1];
      }
    }
  }
  return out;
}

function hexPoints(cx: number, cy: number, s: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

const statusLabel: Record<CoverageStatus, string> = {
  available: "Cobertura disponível",
  expansion: "Rede em expansão",
  unavailable: "Ainda não atendido",
};

type Tip = { x: number; y: number; name: string; city: string; status: CoverageStatus } | null;

export function CoverageMap() {
  const [selected, setSelected] = useState(cities[0].slug);
  const [tip, setTip] = useState<Tip>(null);

  const layout = useMemo(
    () =>
      cities.map((c) => {
        const cx = (c.map.x / 100) * W;
        const cy = (c.map.y / 100) * H;
        const coords = axialSpiral(c.neighborhoods.length);
        const tiles = c.neighborhoods.map((b, i) => {
          const [q, r] = coords[i];
          return { ...b, x: cx + SIZE * Math.sqrt(3) * (q + r / 2), y: cy + SIZE * 1.5 * r };
        });
        const top = Math.min(...tiles.map((t) => t.y)) - SIZE - 26;
        return { city: c, cx, cy, tiles, top };
      }),
    [],
  );

  // anel óptico entre as cidades (topologia em anel = redundância)
  const ring = ["santa-aurora", "vale-serrano", "monte-alvo", "porto-ipe", "santa-aurora"]
    .map((slug) => layout.find((l) => l.city.slug === slug))
    .filter(Boolean) as typeof layout;
  const backbone = ring.map((l) => `${l.cx},${l.cy}`);
  const city = cities.find((c) => c.slug === selected)!;

  return (
    <div className="cmap">
      <div className="cmap__canvas">
        <svg viewBox={`0 0 ${W} ${H}`} className="cmap__svg" role="img" aria-label="Mapa esquemático da cobertura por bairro nas cidades atendidas" onMouseLeave={() => setTip(null)}>
          <defs>
            <pattern id="cmap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
            </pattern>
            <pattern id="cmap-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" fill="#FEF3C7" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="#F59E0B" strokeWidth="3" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#cmap-grid)" />
          {/* rio e estradas (decorativos) */}
          <path d="M-20 520 C 200 470, 320 600, 520 560 S 820 470, 1020 520" className="cmap__river" />
          <path d="M0 250 C 300 230, 560 300, 1000 210" className="cmap__road" />
          <path d="M520 0 C 500 200, 560 420, 480 640" className="cmap__road" />

          {/* backbone de fibra entre cidades */}
          <polyline points={backbone.join(" ")} className="cmap__backbone" />
          <polyline points={backbone.join(" ")} className="cmap__pulse" pathLength={600} />

          {layout.map(({ city: c, tiles, cx, top }) => {
            const active = c.slug === selected;
            return (
              <g key={c.slug} className={`cmap__city ${active ? "is-active" : ""}`}>
                {tiles.map((t) => (
                  <polygon
                    key={t.id}
                    points={hexPoints(t.x, t.y, SIZE - 2)}
                    className={`cmap__hex cmap__hex--${t.status}`}
                    onMouseEnter={() => setTip({ x: t.x, y: t.y, name: t.name, city: c.name, status: t.status })}
                    onClick={() => setSelected(c.slug)}
                  />
                ))}
                <g className="cmap__label" transform={`translate(${cx}, ${top})`} onClick={() => setSelected(c.slug)}>
                  <rect x={-c.name.length * 5.4 - 14} y="-17" width={c.name.length * 10.8 + 28} height="30" rx="15" />
                  <text textAnchor="middle" y="3">
                    {c.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
        {tip && (
          <div className="cmap__tip" style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }} aria-hidden="true">
            <strong>{tip.name}</strong>
            <span>
              {tip.city} · {statusLabel[tip.status]}
            </span>
          </div>
        )}
        <ul className="cmap__legend" aria-label="Legenda">
          <li><span className="cmap__key cmap__key--available" /> Cobertura disponível</li>
          <li><span className="cmap__key cmap__key--expansion" /> Rede em expansão</li>
          <li><span className="cmap__key cmap__key--unavailable" /> Ainda não atendido</li>
        </ul>
      </div>

      <aside className="cmap__side" aria-label="Bairros por cidade">
        <dl className="cmap__kpis">
          <div>
            <dt>Bairros conectados</dt>
            <dd>+{coverageTotals.neighborhoods}</dd>
          </div>
          <div>
            <dt>Cidades atendidas</dt>
            <dd>
              {coverageTotals.cities}
              <small> + {coverageTotals.expansionCities} em obras</small>
            </dd>
          </div>
        </dl>
        <div className="cmap__tabs" role="group" aria-label="Escolha a cidade">
          {cities.map((c) => (
            <button key={c.slug} type="button" aria-pressed={c.slug === selected} onClick={() => setSelected(c.slug)}>
              {c.name}
            </button>
          ))}
        </div>
        <ul className="cmap__list" aria-live="polite">
          {city.neighborhoods.map((b) => (
            <li key={b.id}>
              <span className={`cmap__key cmap__key--${b.status}`} aria-hidden="true" />
              <span>{b.name}</span>
              <em>{b.status === "available" ? "Disponível" : b.status === "expansion" ? "Em expansão" : "Não atendido"}</em>
            </li>
          ))}
        </ul>
        {cityStats(city).available > 0 ? (
          <Link href={`/internet-fibra/${city.slug}`} className="link">
            Planos em {city.name} →
          </Link>
        ) : (
          <p className="small muted">Obras em andamento. Cadastre seu interesse na consulta acima.</p>
        )}
        <p className="disclaimer">Dados demonstrativos.</p>
      </aside>
    </div>
  );
}
