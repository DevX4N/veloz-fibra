"use client";

import Link from "next/link";
import { ArrowRight, Copy, Check, MessageCircle, ChevronRight, Gauge, TriangleAlert } from "lucide-react";
import { DashHeader } from "@/components/account/DashboardShell";
import { useCustomer } from "@/components/account/CustomerProvider";
import { useInvoices, useTickets } from "@/components/account/useAccountData";
import { TicketList } from "@/components/account/TicketList";
import { useNetworkStatus } from "@/components/providers/NetworkStatusProvider";
import { accountServices } from "@/data/account";
import { getPlan } from "@/data/plans";
import { formatDate, formatPrice, firstName, daysBetween } from "@/utils/format";
import { Icon } from "@/components/ui/Icon";
import { Skeleton, EmptyState } from "@/components/ui/EmptyState";
import { useCopy } from "@/hooks/useCopy";
import { whatsappLink, waMessages } from "@/lib/whatsapp";

/** atalhos que não repetem os blocos principais (fatura e suporte já estão no topo) */
const shortcuts = accountServices.filter((s) => s.id !== "segunda-via" && s.id !== "suporte");

const headline = {
  operational: "Sua internet está ativa e a rede opera normalmente.",
  degraded: "Há instabilidade em parte da rede. Nossa equipe já está atuando.",
  outage: "Há uma interrupção em parte da rede. Acompanhe a previsão em Status da rede.",
};

export default function PainelPage() {
  const { customer, notifications } = useCustomer();
  const { level } = useNetworkStatus();
  const invoices = useInvoices();
  const { tickets } = useTickets();
  const { copy, copied } = useCopy();
  const plan = getPlan(customer?.planId)!;
  const c = customer!;
  const open = invoices?.find((i) => i.status !== "paid");
  const last = invoices?.[0];
  const days = open ? daysBetween(new Date(), open.dueDate) : 0;
  const healthy = level === "operational";

  return (
    <>
      <DashHeader title={`Olá, ${firstName(c.name)}`} text={headline[level]} />

      {/* 1 · conexão */}
      <section className={`dpanel conn ${healthy ? "" : "conn--alert"}`} aria-labelledby="c-internet">
        <div className="conn__main">
          <p className={`conn__state ${healthy ? "" : "conn__state--warn"}`}>
            {healthy ? <span className="dot" aria-hidden="true" /> : <TriangleAlert size={16} aria-hidden="true" />}
            {healthy ? "Internet ativa" : "Instabilidade na região"}
          </p>
          <h2 id="c-internet" className="conn__plan">
            Veloz {plan.name}
          </h2>
          <p className="conn__addr">
            {c.address.street}, {c.address.number} · {c.address.district}, {c.address.city}
          </p>
          <dl className="conn__meta">
            <div>
              <dt>Download</dt>
              <dd><span className="mono">{plan.speed}</span> Mbps</dd>
            </div>
            <div>
              <dt>Upload</dt>
              <dd><span className="mono">{plan.upload}</span> Mbps</dd>
            </div>
            <div>
              <dt>Wi-Fi</dt>
              <dd>{plan.wifi}</dd>
            </div>
          </dl>
        </div>

        <ol className="conn__route" aria-label="Caminho da sua conexão">
          {[
            { name: "Central Veloz", tech: "OLT" },
            { name: "Caixa da rua", tech: "CTO" },
            { name: "Sua casa", tech: "ONT · roteador" },
          ].map((n, i) => {
            const warn = !healthy && i === 1;
            return (
              <li key={n.name} className={`conn__node ${warn ? "is-warn" : ""}`}>
                <span className="conn__dot" aria-hidden="true">
                  {warn ? <TriangleAlert size={13} strokeWidth={2.4} /> : <Check size={13} strokeWidth={3} />}
                </span>
                <strong>{n.name}</strong>
                <small>
                  {n.tech} · {warn ? "instável" : "online"}
                </small>
              </li>
            );
          })}
        </ol>

        <div className="conn__actions">
          <Link href="/area-do-cliente/teste-de-velocidade" className="btn btn--primary btn--sm">
            <Gauge size={16} aria-hidden="true" /> Testar velocidade
          </Link>
          <Link href="/area-do-cliente/internet" className="btn btn--secondary btn--sm">
            Detalhes da conexão
          </Link>
          {!healthy && (
            <Link href="/status" className="btn btn--ghost btn--sm">
              Ver status da rede
            </Link>
          )}
          {healthy && plan.speed < 1000 && (
            <Link href="/area-do-cliente/plano" className="btn btn--ghost btn--sm">
              Fazer upgrade
            </Link>
          )}
        </div>
      </section>

      <div className="dash-pair">
        {/* 2 · fatura e segunda via */}
        <section className="dpanel" aria-labelledby="c-invoice">
          <div className="dpanel__head">
            <h2 id="c-invoice" className="dpanel__title">
              {open ? "Próxima fatura" : "Faturas"}
            </h2>
            {invoices && (open ? <span className="badge badge--amber">Em aberto</span> : <span className="badge badge--green">Em dia</span>)}
          </div>
          {!invoices ? (
            <div className="stack-sm">
              <Skeleton h={38} w="50%" />
              <Skeleton h={14} w="60%" />
              <Skeleton h={40} />
            </div>
          ) : open ? (
            <>
              <p className="bill__amount">{formatPrice(open.amount)}</p>
              <p className="bill__due">
                Vence em <strong className="mono">{formatDate(open.dueDate)}</strong>
                <span className={days <= 3 ? "bill__soon" : ""}>
                  {" "}· {days <= 0 ? "vence hoje" : `faltam ${days} ${days === 1 ? "dia" : "dias"}`}
                </span>
              </p>
              <div className="dpanel__actions">
                <button type="button" className="btn btn--success" onClick={() => copy(open.pixCode, "pix", "Código PIX copiado.")}>
                  {copied === "pix" ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                  {copied === "pix" ? "PIX copiado" : "Copiar código PIX"}
                </button>
                <Link href="/area-do-cliente/faturas" className="btn btn--secondary">
                  Boleto e código de barras
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              icon="check"
              tone="green"
              title="Nenhuma fatura pendente"
              text={`Está tudo em dia por aqui. Última fatura paga: ${last?.reference}.`}
              action={
                <Link href="/area-do-cliente/faturas#historico" className="btn btn--secondary btn--sm">
                  Ver histórico
                </Link>
              }
            />
          )}
        </section>

        {/* 3 · suporte */}
        <section className="dpanel" aria-labelledby="c-support">
          <div className="dpanel__head">
            <h2 id="c-support" className="dpanel__title">
              Suporte
            </h2>
            <Link href="/area-do-cliente/suporte" className="link">
              Ver todos <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="dpanel__actions dpanel__actions--top">
            <Link href="/area-do-cliente/suporte" className="btn btn--secondary">
              Abrir atendimento
            </Link>
            <a href={whatsappLink(waMessages.support)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              <MessageCircle size={17} aria-hidden="true" /> WhatsApp
            </a>
          </div>
          <div className="dpanel__flush">
            <TicketList tickets={tickets?.slice(0, 2) ?? null} compact bare />
          </div>
        </section>
      </div>

      <div className="dash-pair">
        <section className="dash-section" aria-labelledby="notif-title">
          <h2 id="notif-title" className="dash-section__title">
            Avisos
          </h2>
          <ul className="notif-list dpanel dpanel--flush">
            {notifications.map((n) => (
              <li key={n.id} className={`notif notif--${n.kind}`}>
                <span className="notif__icon">
                  <Icon name={n.kind === "billing" ? "receipt" : n.kind === "upgrade" ? "rocket" : "wrench"} size={18} />
                </span>
                <div className="notif__body">
                  <strong>{n.title}</strong>
                  <p>{n.text}</p>
                  <Link href={n.href} className="link">
                    {n.cta} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 4 · serviços */}
        <section className="dash-section" aria-labelledby="quick-services">
          <h2 id="quick-services" className="dash-section__title">
            Serviços
          </h2>
          <ul className="shortcut-list dpanel dpanel--flush">
            {shortcuts.map((s) => (
              <li key={s.id}>
                <Link href={s.href!} className="shortcut">
                  <Icon name={s.icon} size={20} className="shortcut__icon" />
                  <span className="shortcut__text">
                    <strong>{s.title}</strong>
                    <span>{s.text}</span>
                  </span>
                  <ChevronRight size={18} className="shortcut__chev" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
