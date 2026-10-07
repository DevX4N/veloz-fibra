"use client";

import { Check, ArrowRight, CircleCheck, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { DashHeader } from "@/components/account/DashboardShell";
import { useCustomer } from "@/components/account/CustomerProvider";
import { residentialPlans, getPlan, type Plan } from "@/data/plans";
import { pendingPlanRequest, requestPlanChange, type PlanRequest } from "@/services/customerService";
import { formatPrice, formatDateTime } from "@/utils/format";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormAlert } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/providers/ToastProvider";

const extras: Record<string, string[]> = {
  "1000": ["Mais velocidade", "Mais capacidade", "Melhor experiência em vários dispositivos"],
  "700": ["Wi-Fi 6 incluso", "Streaming 4K em várias telas", "Suporte prioritário"],
};

export default function PlanoPage() {
  const { customer } = useCustomer();
  const toast = useToast();
  const current = getPlan(customer!.planId)!;
  const upgrades = residentialPlans.filter((p) => p.speed > current.speed);
  const [target, setTarget] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<PlanRequest | null>(null);

  useEffect(() => setRequest(pendingPlanRequest()), []);

  async function confirm() {
    if (!target) return;
    setLoading(true);
    const r = await requestPlanChange(current.id, target.id);
    setLoading(false);
    setTarget(null);
    setRequest(r);
    trackEvent("plan_upgrade_requested", { from: current.name, to: target.name });
    toast("Solicitação enviada com sucesso.");
  }

  const requestedPlan = getPlan(request?.toId);

  return (
    <>
      <DashHeader title="Alterar meu plano" text="Upgrade aplicado remotamente, sem visita técnica na maioria dos casos." />

      {request && requestedPlan && (
        <FormAlert tone="success" icon={<CircleCheck size={18} aria-hidden="true" />}>
          <strong>Solicitação enviada com sucesso.</strong> Upgrade para {requestedPlan.name} registrado em{" "}
          {formatDateTime(new Date(request.requestedAt))} · protocolo <span className="mono">{request.protocol}</span>. A nova
          velocidade será ativada em até 24 horas. <em>(Demonstração: nenhuma alteração real foi feita.)</em>
        </FormAlert>
      )}

      <section className="dash-section" aria-labelledby="cur-plan">
        <h2 id="cur-plan" className="dash-section__title">Seu plano atual</h2>
        <div className="current-plan card">
          <div>
            <p className="dcard__big">{current.name}</p>
            <p className="muted">{formatPrice(current.price!)}/mês · {current.wifi} incluso</p>
          </div>
          <ul className="current-plan__list">
            {current.benefits.map((b) => (
              <li key={b}><Check size={16} aria-hidden="true" /> {b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dash-section" aria-labelledby="up-plans">
        <h2 id="up-plans" className="dash-section__title">Planos disponíveis para você</h2>
        {upgrades.length === 0 ? (
          <div className="card">
            <EmptyState icon="rocket" title="Você já tem o plano mais rápido" text="Não há upgrades residenciais disponíveis no seu endereço no momento." />
          </div>
        ) : (
          <ul className="upgrades">
            {upgrades.map((p) => (
              <li key={p.id} className="upgrade card">
                <div className="upgrade__head">
                  <span className="badge badge--gradient"><Rocket size={13} aria-hidden="true" /> Disponível na sua região</span>
                  <p className="dcard__big">{p.name}</p>
                  <p className="upgrade__price"><strong>{formatPrice(p.price!)}</strong>/mês</p>
                  <p className="upgrade__diff">Diferença: <strong className="mono">+ {formatPrice(p.price! - current.price!)}/mês</strong></p>
                </div>
                <div>
                  <p className="dcard__label">Benefícios adicionais</p>
                  <ul className="check-list">
                    {(extras[p.id] ?? p.benefits).map((b) => (
                      <li key={b}><Check size={16} aria-hidden="true" /> {b}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  size="lg"
                  disabled={request?.toId === p.id}
                  onClick={() => setTarget(p)}
                  iconRight={<ArrowRight size={18} aria-hidden="true" />}
                >
                  {request?.toId === p.id ? "Upgrade solicitado" : "Fazer upgrade"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        size="sm"
        title="Confirmar alteração?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTarget(null)}>Cancelar</Button>
            <Button loading={loading} loadingText="Enviando..." onClick={confirm}>Confirmar upgrade</Button>
          </>
        }
      >
        {target && (
          <dl className="review">
            <div><dt>Plano atual</dt><dd>{current.name}</dd></div>
            <div><dt>Novo plano</dt><dd><strong>{target.name}</strong></dd></div>
            <div><dt>Novo valor</dt><dd><strong>{formatPrice(target.price!)}/mês</strong></dd></div>
          </dl>
        )}
        <p className="disclaimer" style={{ marginTop: 14 }}>O novo valor é cobrado proporcionalmente a partir da ativação.</p>
      </Modal>
    </>
  );
}
