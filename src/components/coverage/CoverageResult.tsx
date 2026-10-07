"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck, Hourglass, MapPinOff, MessageCircle, RotateCcw, BellRing, Check } from "lucide-react";
import { useState } from "react";
import type { CoverageResult as Result } from "@/services/coverageService";
import { registerInterest } from "@/services/coverageService";
import { formatPrice } from "@/utils/format";
import { maskPhone } from "@/utils/masks";
import { isValidEmail, isValidMobile } from "@/utils/validation";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useToast } from "@/components/providers/ToastProvider";

function InterestForm({ region, cta }: { region: string; cta: string }) {
  const toast = useToast();
  const [v, setV] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Partial<typeof v>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Partial<typeof v> = {};
    if (v.name.trim().split(" ").length < 2) err.name = "Informe nome e sobrenome.";
    if (!isValidMobile(v.phone)) err.phone = "Informe um WhatsApp com DDD, ex.: (00) 90000-0000.";
    if (!isValidEmail(v.email)) err.email = "Informe um e-mail válido, ex.: nome@email.com.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    await registerInterest({ ...v, region });
    setLoading(false);
    setDone(true);
    trackEvent("expansion_interest", { region });
    toast("Interesse cadastrado. Avisaremos você!");
  }

  if (done)
    return (
      <div className="form-alert form-alert--success" role="status">
        <BellRing size={18} aria-hidden="true" />
        <div>
          <strong>Pronto! Você será avisado.</strong> Assim que a fibra chegar em {region}, entraremos em contato pelo WhatsApp.
        </div>
      </div>
    );

  return (
    <form className="form-grid form-grid--3 coverage-interest" onSubmit={submit} noValidate>
      <TextField label="Nome" name="name" autoComplete="name" value={v.name} error={errors.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
      <TextField
        label="WhatsApp"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="(00) 90000-0000"
        value={v.phone}
        error={errors.phone}
        onChange={(e) => setV({ ...v, phone: maskPhone(e.target.value) })}
      />
      <TextField
        label="E-mail"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="nome@email.com"
        value={v.email}
        error={errors.email}
        onChange={(e) => setV({ ...v, email: e.target.value })}
      />
      <div className="span-all">
        <Button type="submit" loading={loading} loadingText="Enviando...">
          {cta}
        </Button>
      </div>
    </form>
  );
}

export function CoverageResultView({ result, onReset }: { result: Result; onReset: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const region = `${result.neighborhood}, ${result.city}`;

  return (
    <div className={`coverage-result coverage-result--${result.status}`} role="status" aria-live="polite">
      <div className="coverage-result__head">
        <span className="coverage-result__icon" aria-hidden="true">
          {result.status === "available" ? <CircleCheck size={26} /> : result.status === "expansion" ? <Hourglass size={24} /> : <MapPinOff size={24} />}
        </span>
        <div>
          <p className="coverage-result__where">
            {result.street ? `${result.street} · ` : ""}
            {region}
          </p>
          <h3 className="h-3">
            {result.status === "available" && "Temos cobertura!"}
            {result.status === "expansion" && "Estamos chegando!"}
            {result.status === "unavailable" && "Ainda não atendemos essa região"}
          </h3>
          <p className="coverage-result__text">
            {result.status === "available" && "Nossa fibra já está disponível nesta região."}
            {result.status === "expansion" && "Nossa rede está em expansão nessa região. Deixe seu contato e avisamos quando a instalação for liberada."}
            {result.status === "unavailable" && "Estamos expandindo nossa rede constantemente. Cadastre seu interesse."}
          </p>
        </div>
      </div>

      {result.status === "available" && (
        <div className="coverage-result__body">
          <ul className="coverage-result__checks">
            <li><Check size={16} strokeWidth={2.6} aria-hidden="true" /> Fibra óptica até a sua região</li>
            <li><Check size={16} strokeWidth={2.6} aria-hidden="true" /> Porta disponível para nova instalação</li>
            <li><Check size={16} strokeWidth={2.6} aria-hidden="true" /> Instalação com agendamento online</li>
          </ul>
          <p className="coverage-result__price">
            Planos a partir de <strong>{formatPrice(result.startingPrice)}/mês</strong>
          </p>
          <div className="btn-row btn-row--stack">
            <Link href={`/assine?cidade=${result.citySlug}&bairro=${encodeURIComponent(result.neighborhood)}`} className="btn btn--primary btn--lg">
              Escolher meu plano <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href={whatsappLink(`${waMessages.sales} Moro em ${region}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--success btn--lg"
              onClick={() => trackEvent("click_whatsapp", { location: "coverage_result" })}
            >
              <MessageCircle size={18} aria-hidden="true" /> Contratar pelo WhatsApp
            </a>
          </div>
        </div>
      )}

      {result.status === "expansion" && (
        <div className="coverage-result__body">
          <InterestForm region={region} cta="Quero ser avisado" />
        </div>
      )}

      {result.status === "unavailable" && (
        <div className="coverage-result__body">
          {showForm ? (
            <InterestForm region={region} cta="Cadastrar interesse" />
          ) : (
            <Button variant="secondary" onClick={() => setShowForm(true)}>
              Cadastrar interesse
            </Button>
          )}
        </div>
      )}

      <button type="button" className="coverage-result__reset" onClick={onReset}>
        <RotateCcw size={15} aria-hidden="true" /> Fazer nova consulta
      </button>
    </div>
  );
}
