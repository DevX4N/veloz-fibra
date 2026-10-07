"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { DashHeader } from "@/components/account/DashboardShell";
import { accountServices, serviceRequests } from "@/data/account";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextAreaField } from "@/components/ui/Field";
import { newProtocol, simulateLatency } from "@/services/core";
import { useToast } from "@/components/providers/ToastProvider";

export default function ServicosPage() {
  const toast = useToast();
  const [active, setActive] = useState<(typeof serviceRequests)[number] | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState<Record<string, string>>({});

  async function confirm() {
    if (!active) return;
    setLoading(true);
    await simulateLatency();
    const p = newProtocol();
    setRequested((r) => ({ ...r, [active.id]: p }));
    setLoading(false);
    setActive(null);
    setNote("");
    toast(`Solicitação enviada com sucesso. Protocolo ${p}.`);
  }

  return (
    <>
      <DashHeader title="Serviços" text="Tudo o que você pode resolver sem ligar para ninguém." />

      <section className="dash-section" aria-labelledby="s-quick">
        <h2 id="s-quick" className="dash-section__title">Atalhos</h2>
        <ul className="svc-grid">
          {accountServices.map((s) => (
            <li key={s.id}>
              <Link href={s.href!} className="svc">
                <span className="icon-tile"><Icon name={s.icon} size={20} /></span>
                <span className="svc__text"><strong>{s.title}</strong><span>{s.text}</span></span>
                <ChevronRight size={18} className="svc__chev" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="dash-section" aria-labelledby="s-req">
        <h2 id="s-req" className="dash-section__title">Solicitações</h2>
        <ul className="req-list card">
          {serviceRequests.map((r) => (
            <li key={r.id} className="req">
              <span className="icon-tile icon-tile--neutral"><Icon name={r.icon} size={20} /></span>
              <div className="req__text">
                <strong>{r.title}</strong>
                <span>{requested[r.id] ? `Solicitado · protocolo ${requested[r.id]}` : r.text}</span>
              </div>
              {requested[r.id] ? (
                <span className="badge badge--blue">Em análise</span>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => setActive(r)}>Solicitar</Button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.title ?? ""}
        description={active?.text}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActive(null)}>Cancelar</Button>
            <Button loading={loading} loadingText="Enviando..." onClick={confirm}>Confirmar solicitação</Button>
          </>
        }
      >
        <TextAreaField label="Observações" optional placeholder="Algum detalhe que a equipe deve saber?" value={note} onChange={(e) => setNote(e.target.value)} />
      </Modal>
    </>
  );
}
