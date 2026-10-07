"use client";

import { Search, UserRound, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { demoDocuments } from "@/data/customers";
import { getInvoicesByDocument, type InvoiceLookup as Lookup } from "@/services/invoiceService";
import { ServiceError } from "@/services/core";
import { maskCPFOrCNPJ } from "@/utils/masks";
import { isValidDocument } from "@/utils/validation";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { TextField, FormAlert } from "@/components/ui/Field";
import { EmptyState, Skeleton, LoadingLine } from "@/components/ui/EmptyState";
import { InvoiceCard } from "./InvoiceCard";
import { InvoiceHistory } from "./InvoiceHistory";

export function InvoiceLookup() {
  const [doc, setDoc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Lookup | null>(null);
  const [notFound, setNotFound] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  async function submit(e?: React.FormEvent, value = doc) {
    e?.preventDefault();
    setNotFound(false);
    if (!isValidDocument(value)) {
      setError("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }
    setError(null);
    setLoading(true);
    setData(null);
    trackEvent("invoice_search");
    try {
      setData(await getInvoicesByDocument(value));
    } catch (err) {
      if (err instanceof ServiceError && err.code === "not_found") setNotFound(true);
      else setError("Não foi possível consultar agora. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  const open = data?.invoices.filter((i) => i.status !== "paid") ?? [];

  return (
    <div className="lookup">
      <form className="lookup__form card card--pad" onSubmit={submit} noValidate>
        <div className="lookup__row">
          <TextField
            label="CPF ou CNPJ do titular"
            name="document"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            value={doc}
            error={error}
            disabled={loading}
            success={isValidDocument(doc)}
            onChange={(e) => {
              setDoc(maskCPFOrCNPJ(e.target.value));
              setError(null);
            }}
          />
          <Button type="submit" size="lg" loading={loading} loadingText="Consultando..." iconLeft={<Search size={18} aria-hidden="true" />}>
            Consultar fatura
          </Button>
        </div>
        <div className="demo-hint">
          <span>Documentos de demonstração:</span>
          {demoDocuments.map((d) => (
            <button
              key={d.document}
              type="button"
              className="demo-hint__chip"
              onClick={() => {
                setDoc(d.document);
                submit(undefined, d.document);
              }}
            >
              {d.document} <em>{d.hint}</em>
            </button>
          ))}
        </div>
      </form>

      {loading && (
        <div className="lookup__loading card card--pad" aria-busy="true">
          <LoadingLine>Buscando suas faturas...</LoadingLine>
          <Skeleton h={22} w="45%" />
          <Skeleton h={44} w="30%" />
          <Skeleton h={48} />
        </div>
      )}

      {notFound && (
        <div className="card fade-in">
          <EmptyState
            icon="user"
            title="Nenhum contrato encontrado"
            text="Não localizamos faturas para este documento. Confira os números ou fale com a nossa equipe."
            action={
              <Button variant="secondary" onClick={() => { setNotFound(false); setDoc(""); }} iconLeft={<RotateCcw size={16} aria-hidden="true" />}>
                Tentar outro documento
              </Button>
            }
          />
        </div>
      )}

      {data && (
        <div className="lookup__result fade-in">
          <p className="lookup__holder">
            <UserRound size={16} aria-hidden="true" /> Titular <strong>{data.holder}</strong> · <span className="mono">{data.documentMasked}</span>
          </p>
          {open.length ? (
            open.map((inv) => <InvoiceCard key={inv.id} invoice={inv} />)
          ) : (
            <div className="card">
              <EmptyState
                icon="check"
                tone="green"
                title="Nenhuma fatura pendente"
                text="Está tudo em dia por aqui."
                action={
                  <Button variant="secondary" onClick={() => historyRef.current?.scrollIntoView({ behavior: "smooth" })}>
                    Ver histórico
                  </Button>
                }
              />
            </div>
          )}
          <div ref={historyRef} className="lookup__history">
            <h2 className="h-3">Histórico de faturas</h2>
            <InvoiceHistory invoices={data.invoices} />
          </div>
        </div>
      )}

      {!data && !loading && !notFound && (
        <FormAlert tone="info">
          Por segurança, mostramos apenas as iniciais do titular. Para ver todos os detalhes, acesse a Área do Cliente.
        </FormAlert>
      )}
    </div>
  );
}
