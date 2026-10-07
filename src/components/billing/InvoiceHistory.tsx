"use client";

import { useState } from "react";
import type { Invoice } from "@/data/customers";
import { formatDate, formatPrice } from "@/utils/format";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InvoiceStatusBadge } from "./InvoiceCard";

/** Histórico em tabela (desktop) que vira lista de cartões no mobile. */
export function InvoiceHistory({ invoices }: { invoices: Invoice[] }) {
  const [detail, setDetail] = useState<Invoice | null>(null);
  return (
    <>
      <div className="table-wrap">
        <table className="table table--stack">
          <caption className="sr-only">Histórico de faturas</caption>
          <thead>
            <tr>
              <th scope="col">Mês</th>
              <th scope="col">Valor</th>
              <th scope="col">Vencimento</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="cell-title">{inv.reference}</td>
                <td className="num" data-label="Valor">{formatPrice(inv.amount)}</td>
                <td className="num" data-label="Vencimento">{formatDate(inv.dueDate)}</td>
                <td>
                  <InvoiceStatusBadge invoice={inv} />
                </td>
                <td className="actions">
                  <Button variant="secondary" size="sm" onClick={() => setDetail(inv)}>
                    Ver detalhes
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Fatura ${detail.reference}` : ""}
        description={detail ? `Vencimento ${formatDate(detail.dueDate)}` : undefined}
        footer={<Button onClick={() => setDetail(null)}>Fechar</Button>}
      >
        {detail && (
          <div className="invoice-detail">
            <dl>
              {detail.items.map((i) => (
                <div key={i.label}>
                  <dt>{i.label}</dt>
                  <dd className="mono">{formatPrice(i.value)}</dd>
                </div>
              ))}
              <div>
                <dt>Descontos</dt>
                <dd className="mono">{formatPrice(0)}</dd>
              </div>
              <div className="invoice-detail__total">
                <dt>Total</dt>
                <dd className="mono">{formatPrice(detail.amount)}</dd>
              </div>
            </dl>
            <p className="invoice-detail__status">
              <InvoiceStatusBadge invoice={detail} />
              {detail.paidAt && <span>Pago em {formatDate(detail.paidAt)} via PIX</span>}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
