import { Router } from "lucide-react";
import { connectedDevices, connectedUses } from "@/data/content";
import { Icon } from "@/components/ui/Icon";

/** Roteador central com dispositivos ao redor — todos conectados ao mesmo tempo. */
export function ConnectedHome() {
  const n = connectedDevices.length;
  return (
    <section className="section connected" aria-labelledby="connected-title">
      <div className="container connected__grid">
        <div className="connected__copy">
          <h2 id="connected-title" className="h-2">
            Sua casa conectada de verdade
          </h2>
          <p className="lead">
            Filmes, séries, trabalho, jogos e vários dispositivos conectados ao mesmo tempo sem perder desempenho.
          </p>
          <ul className="connected__uses">
            {connectedUses.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
          <p className="disclaimer">Wi-Fi 6 incluso nos planos a partir de 700 Mega. Equipamentos fornecidos em comodato.</p>
        </div>

        <div className="orbit" role="img" aria-label="Roteador Wi-Fi 6 conectado a Smart TV, notebook, smartphone, console, tablet e dispositivos inteligentes">
          <svg className="orbit__lines" viewBox="0 0 400 400" aria-hidden="true">
            <circle cx="200" cy="200" r="150" className="orbit__ring" />
            <circle cx="200" cy="200" r="96" className="orbit__ring orbit__ring--inner" />
            {connectedDevices.map((_, i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2;
              const x = 200 + Math.cos(a) * 150;
              const y = 200 + Math.sin(a) * 150;
              return (
                <g key={i}>
                  <line x1="200" y1="200" x2={x} y2={y} className="orbit__spoke" />
                  <line x1="200" y1="200" x2={x} y2={y} className="orbit__signal" pathLength={100} style={{ animationDelay: `${i * 0.4}s` }} />
                </g>
              );
            })}
          </svg>
          <div className="orbit__core" aria-hidden="true">
            <span className="orbit__wave" />
            <span className="orbit__wave orbit__wave--2" />
            <Router size={30} strokeWidth={1.7} />
            <strong>Wi-Fi 6</strong>
          </div>
          {connectedDevices.map((d, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const left = 50 + Math.cos(a) * 37.5;
            const top = 50 + Math.sin(a) * 37.5;
            return (
              <div key={d.label} className="orbit__device" style={{ left: `${left}%`, top: `${top}%` }} aria-hidden="true">
                <Icon name={d.icon} size={20} />
                <span>
                  <strong>{d.label}</strong>
                  <em>{d.usage}</em>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
