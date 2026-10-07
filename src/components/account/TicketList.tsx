"use client";

import Link from "next/link";
import { useState } from "react";
import { ticketStatusLabel, type Ticket, type TicketStatus } from "@/data/account";
import { formatDate, formatDateTime } from "@/utils/format";
import { EmptyState, Skeleton } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const tone: Record<TicketStatus, string> = {
  open: "badge--blue",
  analysis: "badge--amber",
  waiting: "badge--amber",
  resolved: "badge--green",
  closed: "",
};

export function TicketBadge({ status }: { status: TicketStatus }) {
  return <span className={`badge ${tone[status]}`}>{ticketStatusLabel[status]}</span>;
}

export function TicketList({
  tickets, compact = false, emptyAction = true, bare = false,
}: {
  tickets: Ticket[] | null;
  compact?: boolean;
  emptyAction?: boolean;
  /** sem moldura de card: para usar dentro de outro painel */
  bare?: boolean;
}) {
  const [detail, setDetail] = useState<Ticket | null>(null);

  if (!tickets)
    return (
      <div className={`${bare ? "tickets--bare-pad" : "card card--pad"} stack`}>
        <Skeleton h={16} w="50%" />
        <Skeleton h={16} w="80%" />
        <Skeleton h={16} w="65%" />
      </div>
    );

  if (!tickets.length)
    return (
      <div className={bare ? "" : "card"}>
        <EmptyState
          icon="headphones"
          title="Nenhum atendimento aberto"
          text="Quando você solicitar suporte, seus atendimentos aparecerão aqui."
          action={emptyAction ? <Link href="/area-do-cliente/suporte#novo" className="btn btn--primary btn--sm">Solicitar suporte</Link> : undefined}
        />
      </div>
    );

  return (
    <>
      <ul className={`tickets ${bare ? "tickets--bare" : "card"} ${compact ? "tickets--compact" : ""}`}>
        {tickets.map((t) => (
          <li key={t.protocol}>
            <button type="button" className="ticket" onClick={() => setDetail(t)}>
              <span className="ticket__main">
                <span className="ticket__top">
                  <strong>{t.subject}</strong>
                  <span className="mono ticket__proto">{t.protocol}</span>
                </span>
                <span className="ticket__desc">{t.description}</span>
              </span>
              <span className="ticket__side">
                <TicketBadge status={t.status} />
                <span className="ticket__date">{formatDate(t.createdAt)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `${detail.subject} · ${detail.protocol}` : ""}
        description={detail ? `Aberto em ${formatDateTime(detail.createdAt)}` : undefined}
        footer={<Button onClick={() => setDetail(null)}>Fechar</Button>}
      >
        {detail && (
          <div className="stack">
            <p className="ticket-detail__status">
              Status: <TicketBadge status={detail.status} />
            </p>
            <p className="muted">{detail.description}</p>
            <ol className="history ticket-detail__timeline">
              {detail.timeline.map((e, i) => (
                <li key={i} className="history__item">
                  <time className="history__date">{formatDateTime(e.at)}</time>
                  <div className="history__card"><p>{e.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Modal>
    </>
  );
}
