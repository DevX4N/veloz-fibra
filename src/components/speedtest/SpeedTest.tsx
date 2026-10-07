"use client";

import { ArrowDown, ArrowUp, Timer, Activity, RotateCcw, Server, Cable, Info, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { rateConnection, runSpeedTest, type SpeedResult, type SpeedSnapshot } from "@/services/speedTestService";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

const phaseText: Record<SpeedSnapshot["phase"], string> = {
  idle: "",
  connecting: "Conectando...",
  ping: "Testando ping...",
  download: "Testando download...",
  upload: "Testando upload...",
  done: "Teste concluído",
};

const TICKS = [0, 50, 100, 250, 500, 750, 1000];
const ORDER: SpeedSnapshot["phase"][] = ["idle", "connecting", "ping", "download", "upload", "done"];
const START = 135; // graus
const SWEEP = 270;

/** escala não linear: dá mais espaço às velocidades baixas, como nos medidores reais */
const toFrac = (mbps: number) => Math.sqrt(Math.min(Math.max(mbps, 0), 1000) / 1000);

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const s = polar(cx, cy, r, from);
  const e = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

export function SpeedTest({ compact = false }: { compact?: boolean }) {
  const [snap, setSnap] = useState<SpeedSnapshot | null>(null);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function start() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setResult(null);
    trackEvent("speed_test_started");
    try {
      const r = await runSpeedTest(setSnap, ac.signal);
      setResult(r);
      trackEvent("speed_test_completed", { download: r.download, upload: r.upload, ping: r.ping });
    } catch {
      /* cancelado */
    }
  }

  const running = !!snap && snap.phase !== "done";
  const phase = snap?.phase ?? "idle";
  const isSpeed = phase === "download" || phase === "upload" || phase === "done";
  const gaugeValue = phase === "done" ? result?.download ?? 0 : isSpeed ? snap?.live ?? 0 : 0;
  const frac = toFrac(gaugeValue);
  const rating = result ? rateConnection(result) : null;

  const cx = 160;
  const cy = 160;
  const r = 130;
  const needle = polar(cx, cy, r - 26, START + SWEEP * frac);

  return (
    <div className={`speedtest ${compact ? "speedtest--compact" : ""}`}>
      <div className="speedtest__stage">
        <div className="gauge">
          <svg viewBox="0 0 320 300" className="gauge__svg" aria-hidden="true">
            <defs>
              <linearGradient id="gauge-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#2563EB" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <path d={arc(cx, cy, r, START, START + SWEEP)} className="gauge__track" />
            {frac > 0.001 && <path d={arc(cx, cy, r, START, START + SWEEP * frac)} className={`gauge__value ${phase === "upload" ? "gauge__value--up" : ""}`} />}
            {TICKS.map((t) => {
              const deg = START + SWEEP * toFrac(t);
              const p1 = polar(cx, cy, r - 16, deg);
              const p2 = polar(cx, cy, r - 8, deg);
              const lp = polar(cx, cy, r - 34, deg);
              return (
                <g key={t}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="gauge__tick" />
                  <text x={lp.x} y={lp.y + 4} textAnchor="middle" className="gauge__label">
                    {t}
                  </text>
                </g>
              );
            })}
            {isSpeed && <circle cx={needle.x} cy={needle.y} r="6" className="gauge__needle" />}
          </svg>

          <div className="gauge__center">
            {phase === "idle" ? (
              <button type="button" className="gauge__start" onClick={start}>
                <span>Iniciar teste</span>
              </button>
            ) : (
              <div className="gauge__readout" aria-live="polite">
                <span className="gauge__phase">{phaseText[phase]}</span>
                <span className="gauge__num mono">
                  {phase === "connecting" ? "—" : phase === "ping" ? Math.round(snap!.live) : Math.round(gaugeValue)}
                </span>
                <span className="gauge__unit">{phase === "ping" ? "ms" : "Mbps"}</span>
                {phase === "done" && <span className="gauge__dir"><ArrowDown size={14} aria-hidden="true" /> download</span>}
                {phase === "upload" && <span className="gauge__dir"><ArrowUp size={14} aria-hidden="true" /> upload</span>}
              </div>
            )}
          </div>
        </div>

        <div className="speedtest__progress" aria-hidden={!running}>
          <span style={{ transform: `scaleX(${snap?.progress ?? 0})` }} />
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {running ? phaseText[phase] : result ? `Resultado: download ${result.download} Mbps, upload ${result.upload} Mbps, ping ${result.ping} ms.` : ""}
        </p>
      </div>

      <div className="speedtest__side">
        <p className="speedtest__server">
          <Server size={15} aria-hidden="true" />
          {phase === "idle"
            ? "O servidor mais próximo é escolhido automaticamente."
            : phase === "connecting"
              ? "Conectando ao servidor mais próximo…"
              : <>Servidor <strong>{result?.server ?? "Veloz Fibra — Santa Aurora"}</strong></>}
        </p>
        <ol className="st-steps">
          {[
            { k: "ping", label: "Ping", hint: "tempo de resposta", icon: <Timer size={17} />, unit: "ms", value: phase === "ping" ? Math.round(snap?.live ?? 0) : snap?.ping },
            { k: "jitter", label: "Jitter", hint: "variação do ping", icon: <Activity size={17} />, unit: "ms", value: snap?.jitter },
            { k: "download", label: "Download", hint: "para receber dados", icon: <ArrowDown size={17} />, unit: "Mbps", value: phase === "download" ? Math.round(snap?.live ?? 0) : snap?.download },
            { k: "upload", label: "Upload", hint: "para enviar dados", icon: <ArrowUp size={17} />, unit: "Mbps", value: phase === "upload" ? Math.round(snap?.live ?? 0) : snap?.upload },
          ].map((m) => {
            const own = (m.k === "jitter" ? "ping" : m.k) as SpeedSnapshot["phase"];
            const state = phase === own ? "active" : ORDER.indexOf(phase) > ORDER.indexOf(own) ? "done" : "pending";
            return (
              <li key={m.k} className={`st-step is-${state}`}>
                <span className="st-step__icon" aria-hidden="true">
                  {state === "done" ? <Check size={16} strokeWidth={2.6} /> : m.icon}
                </span>
                <span className="st-step__label">
                  <strong>{m.label}</strong>
                  <small>{m.hint}</small>
                </span>
                <span className="st-step__value">
                  <span className="mono">{state === "pending" || m.value == null ? "—" : m.value}</span>
                  <small>{m.unit}</small>
                </span>
              </li>
            );
          })}
        </ol>
        {result && rating && (
          <div className={`speedtest__result fade-in speedtest__result--${rating.level}`}>
            <div>
              <h2 className="h-4">{rating.title}</h2>
              <p className="speedtest__meta">
                <span><Cable size={15} aria-hidden="true" /> Conexão: <strong>{result.connection}</strong></span>
              </p>
            </div>
            <Button variant="secondary" onClick={start} iconLeft={<RotateCcw size={17} aria-hidden="true" />}>
              Testar novamente
            </Button>
          </div>
        )}
      </div>

      <p className="speedtest__notice">
        <Info size={15} aria-hidden="true" /> Os valores apresentados nesta demonstração são simulados.
      </p>
    </div>
  );
}
