"use client";

import { Check, Copy, Download, MessageCircle, QrCode, Barcode, CalendarDays } from "lucide-react";
import { useState } from "react";
import type { Invoice } from "@/data/customers";
import { downloadBoleto, sendInvoiceByWhatsApp } from "@/services/invoiceService";
import { formatDate, formatPrice, daysBetween } from "@/utils/format";
import { useCopy } from "@/hooks/useCopy";
import { useToast } from "@/components/providers/ToastProvider";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

export function InvoiceStatusBadge({ invoice }: { invoice: Invoice }) {
  if (invoice.status === "paid") return <span className="badge badge--green"><Check size={13} strokeWidth={3} aria-hidden="true" /> Pago</span>;
  if (invoice.status === "overdue") return <span className="badge badge--red">Vencida</span>;
  return <span className="badge badge--amber">Em aberto</span>;
}

/** Fatura em destaque com PIX, código de barras, boleto e envio por WhatsApp. */
export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const { copy, copied } = useCopy();
  const toast = useToast();
  const [busy, setBusy] = useState<"pdf" | "wa" | null>(null);
  const days = daysBetween(new Date(), invoice.dueDate);

  return (
    <article className="invoice card" aria-labelledby={`inv-${invoice.id}`}>
      <header className="invoice__head">
        <div>
          <p className="invoice__ref mono">Fatura {invoice.reference}</p>
          <h3 id={`inv-${invoice.id}`} className="h-3">
            Fatura {invoice.month}
          </h3>
        </div>
        <InvoiceStatusBadge invoice={invoice} />
      </header>

      <dl className="invoice__summary">
        <div>
          <dt>Valor</dt>
          <dd className="invoice__amount">{formatPrice(invoice.amount)}</dd>
        </div>
        <div>
          <dt>Vencimento</dt>
          <dd>
            <span className="mono">{formatDate(invoice.dueDate)}</span>
            {invoice.status === "open" && (
              <small className={days <= 3 ? "is-soon" : ""}>
                <CalendarDays size={13} aria-hidden="true" /> {days < 0 ? "vencida" : days === 0 ? "vence hoje" : `vence em ${days} ${days === 1 ? "dia" : "dias"}`}
              </small>
            )}
          </dd>
        </div>
      </dl>

      {invoice.status !== "paid" ? (
        <>
          <div className="invoice__codes">
            <div>
              <p className="invoice__label"><QrCode size={15} aria-hidden="true" /> PIX copia e cola</p>
              <div className="code-box">
                <code>{invoice.pixCode}</code>
              </div>
            </div>
            <div>
              <p className="invoice__label"><Barcode size={15} aria-hidden="true" /> Código de barras</p>
              <div className="code-box">
                <code>{invoice.barcode}</code>
              </div>
            </div>
          </div>
          <div className="invoice__actions">
            <Button
              variant="success"
              iconLeft={copied === "pix" ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              onClick={() => {
                copy(invoice.pixCode, "pix", "Código PIX copiado.");
                trackEvent("invoice_copy_pix", { month: invoice.month });
              }}
            >
              {copied === "pix" ? "Código copiado!" : "Copiar código PIX"}
            </Button>
            <Button
              variant="secondary"
              iconLeft={copied === "bar" ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              onClick={() => copy(invoice.barcode.replace(/\D/g, ""), "bar", "Código de barras copiado.")}
            >
              {copied === "bar" ? "Código copiado!" : "Copiar código de barras"}
            </Button>
            <Button
              variant="secondary"
              loading={busy === "pdf"}
              loadingText="Gerando boleto..."
              iconLeft={<Download size={18} aria-hidden="true" />}
              onClick={async () => {
                setBusy("pdf");
                await downloadBoleto(invoice.id);
                setBusy(null);
                toast("Boleto gerado. Em produção, o PDF seria baixado agora.", "info");
              }}
            >
              Baixar boleto
            </Button>
            <Button
              variant="ghost"
              loading={busy === "wa"}
              loadingText="Enviando..."
              iconLeft={<MessageCircle size={18} aria-hidden="true" />}
              onClick={async () => {
                setBusy("wa");
                await sendInvoiceByWhatsApp(invoice.id);
                setBusy(null);
                toast("Fatura enviada para o WhatsApp cadastrado.");
              }}
            >
              Enviar pelo WhatsApp
            </Button>
          </div>
        </>
      ) : (
        <p className="invoice__paid">
          <Check size={16} aria-hidden="true" /> Pagamento identificado em {invoice.paidAt ? formatDate(invoice.paidAt) : "—"}.
        </p>
      )}
    </article>
  );
}
