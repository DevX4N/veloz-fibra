"use client";

import { CircleCheck, TriangleAlert, CircleX, CalendarClock, MapPin, Clock, RefreshCw, FlaskConical } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getIncidents, getMaintenances, getStatus } from "@/services/networkService";
import type { Incident, Maintenance, NetworkLevel } from "@/data/network";
import { useNetworkStatus } from "@/components/providers/NetworkStatusProvider";
import { Icon } from "@/components/ui/Icon";
import { EmptyState, Skeleton, LoadingLine } from "@/components/ui/EmptyState";
import { formatDate, formatLongDate } from "@/utils/format";

type Status = Awaited<ReturnType<typeof getStatus>>;

const levelIcon = {
  operational: <CircleCheck size={18} aria-hidden="true" />,
  degraded: <TriangleAlert size={18} aria-hidden="true" />,
  outage: <CircleX size={18} aria-hidden="true" />,
};
const levelLabel: Record<NetworkLevel, string> = { operational: "Operacional", degraded: "Instabilidade", outage: "Indisponível" };
const mStatus: Record<Maintenance["status"], { label: string; cls: string }> = {
  scheduled: { label: "Programada", cls: "badge--blue" },
  "in-progress": { label: "Em andamento", cls: "badge--amber" },
  done: { label: "Finalizada", cls: "badge--green" },
};

function useRelative(date: Date | null) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((x) => x + 1), 15000);
    return () => clearInterval(id);
  }, []);
  if (!date) return "";
  const s = Math.round((Date.now() - date.getTime()) / 1000);
  if (s < 30) return "Agora";
  if (s < 90) return "Há 1 minuto";
  return `Há ${Math.round(s / 60)} minutos`;
}

export function NetworkStatus() {
  const { level, setLevel } = useNetworkStatus();
  const [status, setStatus] = useState<Status | null>(null);
  const [maint, setMaint] = useState<Maintenance[] | null>(null);
  const [incidents, setIncidents] = useState<Incident[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hideMaint, setHideMaint] = useState(false);
  const updated = useRelative(status?.updatedAt ?? null);

  const load = useCallback(async (l: NetworkLevel) => {
    setRefreshing(true);
    const s = await getStatus(l);
    setStatus(s);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load(level);
  }, [level, load]);

  useEffect(() => {
    getMaintenances().then(setMaint);
    getIncidents().then(setIncidents);
  }, []);

  const scheduled = (maint ?? []).filter((m) => m.status !== "done");
  const finished = (maint ?? []).filter((m) => m.status === "done");
  // em cenário de interrupção, a manutenção próxima entra "em andamento" para demonstrar o badge
  const shownMaint = scheduled.map((m, i) => (level === "outage" && i === 0 ? { ...m, status: "in-progress" as const } : m));

  return (
    <div className="status">
      {/* banner geral */}
      {!status ? (
        <div className="status-banner status-banner--loading" aria-busy="true">
          <LoadingLine>Consultando status dos serviços...</LoadingLine>
        </div>
      ) : (
        <div className={`status-banner status-banner--${status.level} fade-in`} role="status">
          <span className="status-banner__icon" aria-hidden="true">
            {status.level === "operational" ? <CircleCheck size={28} /> : status.level === "degraded" ? <TriangleAlert size={26} /> : <CircleX size={28} />}
          </span>
          <div className="status-banner__text">
            <h2 className="h-3">{status.copy.title}</h2>
            <p>{status.copy.text}</p>
            {status.impact && (
              <p className="status-banner__impact">
                <MapPin size={15} aria-hidden="true" /> {status.impact.region}
              </p>
            )}
          </div>
          <div className="status-banner__meta">
            <span>Última atualização</span>
            <strong>{updated}</strong>
            <button type="button" className="status-banner__refresh" onClick={() => load(level)} disabled={refreshing} aria-label="Atualizar status">
              <RefreshCw size={16} className={refreshing ? "spinning" : ""} aria-hidden="true" /> Atualizar
            </button>
          </div>
        </div>
      )}

      {/* simulador para apresentação */}
      <div className="demo-switch" role="group" aria-label="Simular estado da rede (demonstração)">
        <span className="demo-switch__label">
          <FlaskConical size={15} aria-hidden="true" /> Simular cenário
        </span>
        {(["operational", "degraded", "outage"] as NetworkLevel[]).map((l) => (
          <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)} className={`demo-switch__btn demo-switch__btn--${l}`}>
            <span className={`dot dot--static ${l === "degraded" ? "dot--warn" : l === "outage" ? "dot--down" : ""}`} aria-hidden="true" />
            {l === "operational" ? "Operando" : l === "degraded" ? "Instabilidade" : "Interrupção"}
          </button>
        ))}
      </div>

      {/* serviços */}
      <section aria-labelledby="services-title" className="status-block">
        <div className="status-block__head">
          <h2 id="services-title" className="h-3">
            Serviços monitorados
          </h2>
          <span className="small muted">Disponibilidade dos últimos 30 dias</span>
        </div>
        <ul className="services card">
          {!status
            ? Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="service">
                  <Skeleton w={20} h={20} r={6} />
                  <div style={{ flex: 1, display: "grid", gap: 8 }}>
                    <Skeleton w="40%" h={16} />
                    <Skeleton w="70%" h={12} />
                  </div>
                </li>
              ))
            : status.services.map((s) => (
                <li key={s.id} className="service">
                  <Icon name={s.icon} size={20} className="service__icon" />
                  <div className="service__main">
                    <div className="service__row">
                      <h3 className="service__name">{s.name}</h3>
                      <span className={`status-chip status-chip--${s.level}`}>
                        {levelIcon[s.level]} {levelLabel[s.level]}
                      </span>
                    </div>
                    <p className="service__desc">{s.note ?? s.description}</p>
                    <div className="uptime" aria-label={`Disponibilidade de ${s.uptime.toLocaleString("pt-BR")}% nos últimos 30 dias`}>
                      <div className="uptime__bars" aria-hidden="true">
                        {s.bars.map((b, i) => (
                          <span key={i} className={`uptime__bar uptime__bar--${b}`} />
                        ))}
                      </div>
                      <span className="uptime__pct mono">{s.uptime.toLocaleString("pt-BR")}%</span>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </section>

      {/* manutenções */}
      <section aria-labelledby="maint-title" className="status-block">
        <div className="status-block__head">
          <h2 id="maint-title" className="h-3">
            Manutenções programadas
          </h2>
          <button type="button" className="text-btn" onClick={() => setHideMaint((h) => !h)}>
            {hideMaint ? "Mostrar manutenções" : "Ver estado vazio"}
          </button>
        </div>
        {!maint ? (
          <div className="card card--pad"><Skeleton h={80} /></div>
        ) : hideMaint || shownMaint.length === 0 ? (
          <div className="card">
            <EmptyState icon="calendar" title="Nenhuma manutenção programada" text="Não existem manutenções programadas para sua região neste momento." />
          </div>
        ) : (
          <ul className="maint">
            {shownMaint.map((m) => (
              <li key={m.id} className="maint__item card">
                <div className="maint__date" aria-hidden="true">
                  <span className="mono">{m.date.toLocaleDateString("pt-BR", { day: "2-digit" })}</span>
                  <small>{m.date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</small>
                </div>
                <div className="maint__body">
                  <div className="service__row">
                    <h3 className="h-4">{m.title}</h3>
                    <span className={`badge ${mStatus[m.status].cls}`}>{mStatus[m.status].label}</span>
                  </div>
                  <dl className="maint__meta">
                    <div><dt><MapPin size={14} aria-hidden="true" /> Região</dt><dd>{m.region}</dd></div>
                    <div><dt><CalendarClock size={14} aria-hidden="true" /> Data</dt><dd>{formatDate(m.date)}</dd></div>
                    <div><dt><Clock size={14} aria-hidden="true" /> Horário</dt><dd>{m.window}</dd></div>
                  </dl>
                  <p>{m.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* histórico */}
      <section aria-labelledby="history-title" className="status-block">
        <div className="status-block__head">
          <h2 id="history-title" className="h-3">
            Histórico
          </h2>
          <span className="small muted">Últimos 30 dias</span>
        </div>
        {!incidents ? (
          <div className="card card--pad"><Skeleton h={120} /></div>
        ) : (
          <ol className="history">
            {[...incidents.map((i) => ({ ...i, kind: "incident" as const })), ...finished.map((m) => ({ id: m.id, date: m.date, title: m.title, status: "resolved" as const, description: m.description, duration: m.window, kind: "maintenance" as const }))]
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((i) => (
                <li key={i.id} className="history__item">
                  <time dateTime={i.date.toISOString()} className="history__date">
                    {formatLongDate(i.date)}
                  </time>
                  <div className="history__card">
                    <div className="service__row">
                      <h3 className="h-4">{i.title}</h3>
                      <span className="badge badge--green">
                        <CircleCheck size={14} aria-hidden="true" /> {i.kind === "maintenance" ? "Finalizada" : "Resolvido"}
                      </span>
                    </div>
                    <p>{i.description}</p>
                    <p className="history__dur mono">{i.kind === "maintenance" ? `Janela ${i.duration}` : `Duração ${i.duration}`}</p>
                  </div>
                </li>
              ))}
          </ol>
        )}
      </section>
    </div>
  );
}
