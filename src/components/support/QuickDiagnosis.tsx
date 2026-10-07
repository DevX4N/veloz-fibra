"use client";

import Link from "next/link";
import { Check, MessageCircle, Activity, PartyPopper, RotateCcw } from "lucide-react";
import { useState } from "react";
import { diagnosticSteps } from "@/data/content";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

/** Diagnóstico guiado: o cliente marca cada passo e decide se ainda precisa de suporte. */
export function QuickDiagnosis() {
  const [done, setDone] = useState<boolean[]>(diagnosticSteps.map(() => false));
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const count = done.filter(Boolean).length;
  const all = count === diagnosticSteps.length;

  return (
    <div className="diag">
      <div className="diag__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${count / diagnosticSteps.length})` }} />
      </div>
      <ol className="diag__steps">
        {diagnosticSteps.map((s, i) => (
          <li key={s.title}>
            <label className={`diag__step ${done[i] ? "is-done" : ""}`}>
              <input
                type="checkbox"
                checked={done[i]}
                onChange={() => {
                  setDone((d) => d.map((x, j) => (j === i ? !x : x)));
                  setAnswer(null);
                }}
              />
              <span className="diag__num mono" aria-hidden="true">
                {done[i] ? <Check size={16} strokeWidth={3} /> : i + 1}
              </span>
              <span>
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </span>
            </label>
          </li>
        ))}
      </ol>

      <div className={`diag__ask ${all ? "is-ready" : ""}`} aria-live="polite">
        {!all ? (
          <p className="muted small">Marque os passos conforme for concluindo ({count}/{diagnosticSteps.length}).</p>
        ) : answer === "no" ? (
          <div className="diag__ok fade-in">
            <PartyPopper size={22} aria-hidden="true" />
            <p><strong>Que bom que voltou a funcionar!</strong> Se acontecer de novo, abra um atendimento para nossa equipe analisar.</p>
            <button type="button" className="text-btn" onClick={() => { setDone(done.map(() => false)); setAnswer(null); }}>
              <RotateCcw size={14} aria-hidden="true" /> Recomeçar
            </button>
          </div>
        ) : (
          <div className="fade-in">
            <p className="diag__question">O problema continua?</p>
            {answer === null && (
              <div className="btn-row">
                <Button variant="secondary" size="sm" onClick={() => setAnswer("yes")}>Sim, continua</Button>
                <Button variant="ghost" size="sm" onClick={() => setAnswer("no")}>Não, resolveu</Button>
              </div>
            )}
            {answer === "yes" && (
              <div className="btn-row btn-row--stack fade-in">
                <a
                  href={whatsappLink(`${waMessages.support} Já reiniciei o equipamento e o problema continua.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--success"
                  onClick={() => trackEvent("click_whatsapp", { location: "diagnosis" })}
                >
                  <MessageCircle size={18} aria-hidden="true" /> Falar com suporte
                </a>
                <Link href="/status" className="btn btn--secondary">
                  <Activity size={18} aria-hidden="true" /> Verificar status da rede
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
