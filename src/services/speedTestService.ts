/**
 * Motor de speed test SIMULADO.
 *
 * A interface consome apenas `runSpeedTest(onUpdate, signal)`. Para usar um serviço real
 * (Ookla/Speedtest Custom, LibreSpeed, M-Lab NDT7, servidor próprio), implemente o mesmo
 * contrato emitindo as fases e as leituras parciais.
 */

export type SpeedPhase = "idle" | "connecting" | "ping" | "download" | "upload" | "done";

export type SpeedSnapshot = {
  phase: SpeedPhase;
  /** progresso total 0–1 */
  progress: number;
  /** leitura instantânea da fase atual (Mbps ou ms) */
  live: number;
  ping: number | null;
  jitter: number | null;
  download: number | null;
  upload: number | null;
};

export type SpeedResult = { ping: number; jitter: number; download: number; upload: number; server: string; connection: string };

const TARGET = { ping: 4, jitter: 1, download: 687, upload: 352 };
const PHASES: { phase: Exclude<SpeedPhase, "idle" | "done">; ms: number }[] = [
  { phase: "connecting", ms: 900 },
  { phase: "ping", ms: 1600 },
  { phase: "download", ms: 4800 },
  { phase: "upload", ms: 4200 },
];
const TOTAL = PHASES.reduce((a, p) => a + p.ms, 0);

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function runSpeedTest(onUpdate: (s: SpeedSnapshot) => void, signal?: AbortSignal): Promise<SpeedResult> {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const snap: SpeedSnapshot = { phase: "connecting", progress: 0, live: 0, ping: null, jitter: null, download: null, upload: null };
    let raf = 0;

    const tick = (now: number) => {
      if (signal?.aborted) {
        cancelAnimationFrame(raf);
        reject(new DOMException("Teste cancelado", "AbortError"));
        return;
      }
      const elapsed = now - start;
      let acc = 0;
      let current = PHASES[PHASES.length - 1];
      let t = 1;
      for (const p of PHASES) {
        if (elapsed < acc + p.ms) {
          current = p;
          t = (elapsed - acc) / p.ms;
          break;
        }
        acc += p.ms;
      }

      if (elapsed >= TOTAL) {
        Object.assign(snap, { phase: "done", progress: 1, live: TARGET.download, ...TARGET });
        onUpdate({ ...snap });
        resolve({ ...TARGET, server: "Veloz Fibra — Santa Aurora", connection: "Fibra óptica" });
        return;
      }

      // finaliza fases anteriores
      const idx = PHASES.indexOf(current);
      if (idx > 1 && snap.ping === null) Object.assign(snap, { ping: TARGET.ping, jitter: TARGET.jitter });
      if (idx > 2 && snap.download === null) snap.download = TARGET.download;

      const noise = (amp: number) => (Math.sin(elapsed / 90) + Math.sin(elapsed / 37) * 0.6) * amp;
      snap.phase = current.phase;
      snap.progress = Math.min(elapsed / TOTAL, 1);

      if (current.phase === "connecting") snap.live = 0;
      if (current.phase === "ping") {
        snap.live = Math.max(3, Math.round(TARGET.ping + (1 - t) * 6 + noise(1.2)));
      }
      if (current.phase === "download") {
        snap.live = Math.max(0, ease(Math.min(t * 1.4, 1)) * TARGET.download + noise(28) * (t < 0.95 ? 1 : 0));
      }
      if (current.phase === "upload") {
        snap.live = Math.max(0, ease(Math.min(t * 1.4, 1)) * TARGET.upload + noise(16) * (t < 0.95 ? 1 : 0));
      }
      onUpdate({ ...snap });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
}

export function rateConnection(r: Pick<SpeedResult, "download" | "ping">) {
  if (r.download >= 300 && r.ping <= 15) return { level: "excellent" as const, title: "Sua conexão está excelente." };
  if (r.download >= 100) return { level: "good" as const, title: "Sua conexão está boa." };
  return { level: "low" as const, title: "Sua conexão está abaixo do esperado." };
}
