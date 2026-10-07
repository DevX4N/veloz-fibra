"use client";

import { Building, MapPinned, Search, CircleAlert, Check, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cities, demoAddresses } from "@/data/coverage";
import { checkAddress, checkNeighborhood, type CoverageResult } from "@/services/coverageService";
import { ServiceError } from "@/services/core";
import { maskCEP } from "@/utils/masks";
import { isValidCEP } from "@/utils/validation";
import { onlyDigits } from "@/utils/format";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField, FormAlert } from "@/components/ui/Field";
import { CoverageResultView } from "./CoverageResult";

type Mode = "bairro" | "endereco";

/** etapas mostradas enquanto a viabilidade é consultada (mesma ordem da consulta real em um ERP) */
const CHECK_STEPS: Record<Mode, string[]> = {
  bairro: ["Localizando o bairro na rede", "Buscando caixas de atendimento próximas", "Verificando portas livres"],
  endereco: ["Localizando o endereço pelo CEP", "Buscando caixas de atendimento próximas", "Verificando portas livres"],
};
/** tempo mínimo da consulta: dá para ler cada etapa, sem atrasar quem tem pressa */
const MIN_CHECK_MS = 1800;

function CheckProgress({ mode }: { mode: Mode }) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    const t = [setTimeout(() => setDone(1), 500), setTimeout(() => setDone(2), 1150)];
    return () => t.forEach(clearTimeout);
  }, []);
  const steps = CHECK_STEPS[mode];
  return (
    <ol className="check-progress" aria-live="polite">
      {steps.map((label, i) => {
        const state = i < done ? "done" : i === done ? "active" : "pending";
        return (
          <li key={label} className={`check-progress__step is-${state}`}>
            <span className="check-progress__icon" aria-hidden="true">
              {state === "done" ? <Check size={14} strokeWidth={3} /> : state === "active" ? <LoaderCircle size={16} className="spinning" /> : null}
            </span>
            {label}
            {state === "done" && <span className="sr-only"> — concluído</span>}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Consulta de viabilidade — por cidade/bairro ou por CEP + número.
 * Estados: ocioso, carregando, resultado (3 tipos) e erro.
 */
export function CoverageChecker({ initialCity }: { initialCity?: string }) {
  const [mode, setMode] = useState<Mode>("bairro");
  const [city, setCity] = useState(initialCity ?? "");
  const [neighborhood, setNeighborhood] = useState("");
  const [cep, setCep] = useState("");
  const [number, setNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoverageResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const selectedCity = cities.find((c) => c.slug === city);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [result]);

  function report(r: CoverageResult, via: Mode) {
    trackEvent("coverage_search", { via, city: r.citySlug });
    trackEvent(r.status === "available" ? "coverage_available" : r.status === "expansion" ? "coverage_expansion" : "coverage_unavailable", {
      city: r.citySlug,
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFailure(null);
    const err: Record<string, string> = {};
    if (mode === "bairro") {
      if (!city) err.city = "Selecione a cidade.";
      if (!neighborhood) err.neighborhood = city ? "Selecione o bairro." : "Escolha a cidade primeiro.";
    } else {
      if (!isValidCEP(cep)) err.cep = "Informe os 8 dígitos do CEP.";
      if (!number.trim()) err.number = "Informe o número.";
    }
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      const [r] = await Promise.all([
        mode === "bairro" ? checkNeighborhood(city, neighborhood) : checkAddress(cep, number),
        new Promise((ok) => setTimeout(ok, MIN_CHECK_MS)),
      ]);
      setResult(r);
      report(r, mode);
    } catch (e) {
      setFailure(
        e instanceof ServiceError && e.code === "network"
          ? "Não conseguimos consultar a cobertura agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp."
          : "Não encontramos esse endereço. Confira o CEP ou consulte por bairro.",
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setFailure(null);
  }

  if (result)
    return (
      <div ref={resultRef}>
        <CoverageResultView result={result} onReset={reset} />
      </div>
    );

  return (
    <form className="coverage-form" onSubmit={submit} noValidate aria-busy={loading}>
      <div className="segmented segmented--block" role="group" aria-label="Forma de consulta">
        <button type="button" className="segmented__btn" disabled={loading} aria-pressed={mode === "bairro"} onClick={() => { setMode("bairro"); setErrors({}); }}>
          <Building size={17} aria-hidden="true" /> Cidade e bairro
        </button>
        <button type="button" className="segmented__btn" disabled={loading} aria-pressed={mode === "endereco"} onClick={() => { setMode("endereco"); setErrors({}); }}>
          <MapPinned size={17} aria-hidden="true" /> Pelo endereço
        </button>
      </div>

      {loading ? (
        <CheckProgress mode={mode} key="progress" />
      ) : mode === "bairro" ? (
        <div className="form-grid form-grid--2 fade-in" key="bairro">
          <SelectField
            label="Cidade"
            name="city"
            value={city}
            error={errors.city}
            disabled={loading}
            onChange={(e) => {
              setCity(e.target.value);
              setNeighborhood("");
            }}
          >
            <option value="">Selecione</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Bairro"
            name="neighborhood"
            value={neighborhood}
            error={errors.neighborhood}
            disabled={!selectedCity || loading}
            hint={!selectedCity ? "Escolha a cidade para listar os bairros." : undefined}
            onChange={(e) => setNeighborhood(e.target.value)}
          >
            <option value="">{selectedCity ? "Selecione" : "—"}</option>
            {selectedCity?.neighborhoods.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </SelectField>
        </div>
      ) : (
        <div className="fade-in" key="endereco">
          <div className="form-grid form-grid--3">
            <TextField
              className="span-2"
              label="CEP"
              name="cep"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              value={cep}
              error={errors.cep}
              disabled={loading}
              success={isValidCEP(cep)}
              onChange={(e) => setCep(maskCEP(e.target.value))}
            />
            <TextField
              label="Número"
              name="number"
              inputMode="numeric"
              placeholder="123"
              value={number}
              error={errors.number}
              disabled={loading}
              onChange={(e) => setNumber(e.target.value.replace(/[^\dA-Za-z\s/-]/g, "").slice(0, 8))}
            />
          </div>
          <div className="demo-hint" style={{ marginTop: 14 }}>
            <span>CEPs de demonstração:</span>
            {demoAddresses.map((a) => (
              <button
                type="button"
                key={a.cep}
                className="demo-hint__chip"
                onClick={() => {
                  setCep(a.cep);
                  if (!number) setNumber(String(100 + (onlyDigits(a.cep).charCodeAt(6) % 9) * 37));
                  setErrors({});
                }}
              >
                {a.cep} <em>{a.hint}</em>
              </button>
            ))}
          </div>
        </div>
      )}

      {failure && (
        <FormAlert tone="error" icon={<CircleAlert size={18} aria-hidden="true" />}>
          {failure}
        </FormAlert>
      )}

      <Button type="submit" size="lg" block loading={loading} loadingText="Verificando disponibilidade..." iconLeft={<Search size={18} aria-hidden="true" />}>
        {mode === "bairro" ? "Consultar disponibilidade" : "Consultar cobertura"}
      </Button>
      {!loading && <p className="coverage-form__note">Consulta gratuita e sem compromisso. Leva menos de 1 minuto.</p>}
    </form>
  );
}
