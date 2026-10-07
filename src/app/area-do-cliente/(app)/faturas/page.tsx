"use client";

import { DashHeader } from "@/components/account/DashboardShell";
import { useInvoices } from "@/components/account/useAccountData";
import { InvoiceCard } from "@/components/billing/InvoiceCard";
import { InvoiceHistory } from "@/components/billing/InvoiceHistory";
import { EmptyState, Skeleton, LoadingLine } from "@/components/ui/EmptyState";
import { useCustomer } from "@/components/account/CustomerProvider";

export default function FaturasPage() {
  const invoices = useInvoices();
  const { customer } = useCustomer();
  const open = invoices?.filter((i) => i.status !== "paid") ?? [];

  return (
    <>
      <DashHeader title="Faturas" text={`Vencimento todo dia ${customer?.dueDay}. Pague por PIX, código de barras ou boleto.`} />
      {!invoices ? (
        <div className="card card--pad stack">
          <LoadingLine>Buscando suas faturas...</LoadingLine>
          <Skeleton h={28} w="40%" />
          <Skeleton h={80} />
        </div>
      ) : (
        <div className="stack-lg">
          <section aria-labelledby="open-title" className="dash-section">
            <h2 id="open-title" className="dash-section__title">Em aberto</h2>
            {open.length ? (
              open.map((inv) => <InvoiceCard key={inv.id} invoice={inv} />)
            ) : (
              <div className="card">
                <EmptyState icon="check" tone="green" title="Nenhuma fatura pendente" text="Está tudo em dia por aqui." />
              </div>
            )}
          </section>
          <section id="historico" aria-labelledby="hist-title" className="dash-section">
            <h2 id="hist-title" className="dash-section__title">Histórico de faturas</h2>
            <InvoiceHistory invoices={invoices} />
          </section>
        </div>
      )}
    </>
  );
}
