"use client";

import { CircleCheck, Paperclip, Send, Plus } from "lucide-react";
import { useState } from "react";
import { DashHeader } from "@/components/account/DashboardShell";
import { useTickets } from "@/components/account/useAccountData";
import { TicketBadge, TicketList } from "@/components/account/TicketList";
import type { Ticket } from "@/data/account";
import { ticketSubjects } from "@/data/content";
import { createTicket } from "@/services/customerService";
import { formatDateTime } from "@/utils/format";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField } from "@/components/ui/Field";
import { useToast } from "@/components/providers/ToastProvider";

export default function DashSupportPage() {
  const toast = useToast();
  const { tickets, setTickets } = useTickets();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Ticket | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!subject) err.subject = "Selecione o assunto.";
    if (description.trim().length < 10) err.description = "Descreva o problema com pelo menos 10 caracteres.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    const t = await createTicket(subject, description.trim());
    setLoading(false);
    setCreated(t);
    setTickets((list) => [t, ...(list ?? [])]);
    setSubject("");
    setDescription("");
    trackEvent("ticket_created", { subject });
    toast("Atendimento criado.");
  }

  const active = tickets?.filter((t) => !["resolved", "closed"].includes(t.status)) ?? null;
  const past = tickets?.filter((t) => ["resolved", "closed"].includes(t.status)) ?? null;

  return (
    <>
      <DashHeader title="Suporte" text="Abra um atendimento e acompanhe cada etapa pelo protocolo." />

      <div className="support-dash">
        <section id="novo" className="card card--pad" aria-labelledby="new-ticket">
          {created ? (
            <div className="ticket-created fade-in" role="status">
              <span className="form-success__icon"><CircleCheck size={30} aria-hidden="true" /></span>
              <h2 id="new-ticket" className="h-3">Atendimento aberto</h2>
              <dl className="review">
                <div><dt>Protocolo</dt><dd className="mono"><strong>{created.protocol}</strong></dd></div>
                <div><dt>Status</dt><dd><TicketBadge status={created.status} /></dd></div>
                <div><dt>Data</dt><dd>{formatDateTime(created.createdAt)}</dd></div>
                <div><dt>Assunto</dt><dd>{created.subject}</dd></div>
              </dl>
              <p className="muted">Nossa equipe analisará sua solicitação.</p>
              <Button variant="secondary" iconLeft={<Plus size={17} aria-hidden="true" />} onClick={() => setCreated(null)}>
                Abrir outro atendimento
              </Button>
            </div>
          ) : (
            <form className="form-grid" onSubmit={submit} noValidate>
              <h2 id="new-ticket" className="h-3">Abrir atendimento</h2>
              <SelectField label="Assunto" name="subject" value={subject} error={errors.subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="">Selecione</option>
                {ticketSubjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </SelectField>
              <TextAreaField
                label="Descrição"
                name="description"
                placeholder="Conte um pouco mais sobre o problema..."
                value={description}
                error={errors.description}
                maxLength={800}
                hint={`${description.length}/800`}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="attach" aria-disabled="true">
                <Paperclip size={18} aria-hidden="true" />
                <span>
                  <strong>Anexos</strong> — fotos do equipamento e prints (disponível na integração com o helpdesk)
                </span>
              </div>
              <Button type="submit" size="lg" loading={loading} loadingText="Abrindo atendimento..." iconRight={<Send size={17} aria-hidden="true" />}>
                Abrir atendimento
              </Button>
            </form>
          )}
        </section>

        <div className="stack-lg">
          <section className="dash-section" aria-labelledby="t-active">
            <h2 id="t-active" className="dash-section__title">Em andamento</h2>
            <TicketList tickets={active} emptyAction={false} />
          </section>
          <section className="dash-section" aria-labelledby="t-past">
            <h2 id="t-past" className="dash-section__title">Histórico</h2>
            <TicketList tickets={past} emptyAction={false} />
          </section>
          <div className="ticket-legend">
            <p className="small muted">Status possíveis:</p>
            <div className="ticket-legend__list">
              {(["open", "analysis", "waiting", "resolved", "closed"] as const).map((s) => (
                <TicketBadge key={s} status={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
