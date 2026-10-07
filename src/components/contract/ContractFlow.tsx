"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CircleCheck, MapPin, Search, ShieldCheck, Sun, Sunset, PartyPopper, Wifi, CalendarCheck, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cities } from "@/data/coverage";
import { residentialPlans, getPlan } from "@/data/plans";
import { buildInstallSlots } from "@/data/account";
import { checkNeighborhood, lookupCep, type CoverageResult } from "@/services/coverageService";
import { submitContract } from "@/services/leadService";
import { formatPrice, formatDayMonth, formatWeekday, formatDate, onlyDigits } from "@/utils/format";
import { maskCEP, maskCPF, maskDate, maskPhone } from "@/utils/masks";
import { isValidCEP, isValidCPF, isValidEmail, isValidMobile, validateBirthDate } from "@/utils/validation";
import { trackEvent } from "@/lib/analytics";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField, FormAlert } from "@/components/ui/Field";
import { CoverageResultView } from "@/components/coverage/CoverageResult";
import { disclaimers } from "@/config/site";

const STEPS = ["Endereço", "Plano", "Seus dados", "Instalação", "Resumo"];

type Address = { cep: string; city: string; neighborhood: string; street: string; number: string; complement: string };
type Person = { name: string; cpf: string; birthDate: string; phone: string; email: string; terms: boolean };

export function ContractFlow() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address>({ cep: "", city: "", neighborhood: "", street: "", number: "", complement: "" });
  const [person, setPerson] = useState<Person>({ name: "", cpf: "", birthDate: "", phone: "", email: "", terms: false });
  const [planId, setPlanId] = useState("700");
  const [slot, setSlot] = useState<{ date: Date; period: "manha" | "tarde" } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checking, setChecking] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const slots = useMemo(() => buildInstallSlots(), []);

  const plan = getPlan(planId)!;
  const city = cities.find((c) => c.slug === address.city);

  // parâmetros vindos de outras páginas (?plano=1000&cidade=santa-aurora&bairro=Centro)
  useEffect(() => {
    const p = params.get("plano");
    if (p && residentialPlans.some((x) => x.id === p)) setPlanId(p);
    const c = params.get("cidade");
    const b = params.get("bairro");
    const cityMatch = cities.find((x) => x.slug === c);
    if (cityMatch) {
      const nb = cityMatch.neighborhoods.find((n) => n.name === b);
      setAddress((a) => ({ ...a, city: cityMatch.slug, neighborhood: nb?.id ?? "" }));
    }
    trackEvent("contract_started", { plan: p ?? undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    headingRef.current?.closest(".contract")?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("contract_step", { step: step + 1 });
  }, [step, protocol]);

  /* ---------- etapa 1: endereço ---------- */

  async function onCep(value: string) {
    const masked = maskCEP(value);
    setAddress((a) => ({ ...a, cep: masked }));
    setErrors((e) => ({ ...e, cep: "" }));
    if (onlyDigits(masked).length !== 8) return;
    setCepLoading(true);
    try {
      const r = await lookupCep(masked);
      const c = cities.find((x) => x.slug === r.citySlug);
      const nb = c?.neighborhoods.find((n) => n.name === r.neighborhood);
      setAddress((a) => ({ ...a, cep: masked, city: r.citySlug, neighborhood: nb?.id ?? "", street: r.street }));
    } catch {
      setErrors((e) => ({ ...e, cep: "Não encontramos esse CEP. Preencha o endereço manualmente." }));
    } finally {
      setCepLoading(false);
    }
  }

  async function checkStep1(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!isValidCEP(address.cep)) err.cep = "Informe os 8 dígitos do CEP.";
    if (!address.city) err.city = "Selecione a cidade.";
    if (!address.neighborhood) err.neighborhood = "Selecione o bairro.";
    if (address.street.trim().length < 3) err.street = "Informe a rua.";
    if (!address.number.trim()) err.number = "Informe o número.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setChecking(true);
    setCoverage(null);
    // a viabilidade considera o bairro escolhido (que pode ter sido ajustado manualmente)
    let result: CoverageResult;
    try {
      const r = await checkNeighborhood(address.city, address.neighborhood);
      result = { ...r, street: `${address.street}, ${address.number}` };
    } catch {
      setChecking(false);
      setErrors({ form: "Não foi possível verificar a cobertura agora. Tente novamente em instantes." });
      return;
    }
    setChecking(false);
    trackEvent("coverage_search", { via: "contract", city: result.citySlug });
    if (result.status === "available") {
      trackEvent("coverage_available", { city: result.citySlug, via: "contract" });
      setStep(1);
    } else {
      setCoverage(result);
    }
  }

  /* ---------- etapa 3: dados ---------- */

  function checkStep3(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (person.name.trim().split(/\s+/).length < 2) err.name = "Informe nome e sobrenome.";
    if (!isValidCPF(person.cpf)) err.cpf = "CPF inválido. Confira os 11 dígitos.";
    const bd = validateBirthDate(person.birthDate);
    if (bd) err.birthDate = bd;
    if (!isValidMobile(person.phone)) err.phone = "Informe um celular com DDD, ex.: (00) 90000-0000.";
    if (!isValidEmail(person.email)) err.email = "Informe um e-mail válido, ex.: nome@email.com.";
    if (!person.terms) err.terms = "É preciso aceitar os termos para continuar.";
    setErrors(err);
    if (Object.keys(err).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(err)[0]}"]`)?.focus();
      return;
    }
    setStep(3);
  }

  async function finish() {
    setSubmitting(true);
    const nb = city?.neighborhoods.find((n) => n.id === address.neighborhood);
    const r = await submitContract({
      address: { ...address, city: city?.name ?? "", neighborhood: nb?.name ?? "" },
      planId,
      customer: person,
      installation: { date: slot!.date.toISOString(), period: slot!.period },
    });
    setSubmitting(false);
    setProtocol(r.protocol);
    trackEvent("contract_completed", { plan: plan.name, price: plan.price ?? undefined });
  }

  const nbName = city?.neighborhoods.find((n) => n.id === address.neighborhood)?.name;

  /* ---------- sucesso ---------- */

  if (protocol)
    return (
      <div className="contract contract--done">
        <div className="card contract__success fade-in">
          <span className="contract__success-icon"><PartyPopper size={34} aria-hidden="true" /></span>
          <h2 ref={headingRef} tabIndex={-1} className="h-1">Pedido recebido!</h2>
          <p className="lead">
            Obrigado, {person.name.split(" ")[0]}. Seu pedido <strong className="mono">{protocol}</strong> foi registrado e você
            vai receber a confirmação pelo WhatsApp {person.phone}.
          </p>
          <ul className="contract__next">
            <li><CircleCheck size={18} aria-hidden="true" /> Plano <strong>{plan.name}</strong> · {formatPrice(plan.price!)}/mês</li>
            <li><CalendarCheck size={18} aria-hidden="true" /> Instalação em <strong>{formatWeekday(slot!.date)}, {formatDate(slot!.date)}</strong> · {slot!.period === "manha" ? "manhã (08h às 12h)" : "tarde (13h às 18h)"}</li>
            <li><MapPin size={18} aria-hidden="true" /> {address.street}, {address.number}{address.complement ? ` · ${address.complement}` : ""} — {nbName}, {city?.name}</li>
          </ul>
          <FormAlert tone="info">
            Em uma aplicação real, os dados seriam enviados para o sistema do provedor. Nenhum pagamento foi realizado.
          </FormAlert>
          <div className="btn-row btn-row--stack" style={{ justifyContent: "center" }}>
            <Link href="/" className="btn btn--primary btn--lg">Voltar para o início</Link>
            <a className="btn btn--success btn--lg" href={whatsappLink(`Olá! Acabei de fazer o pedido ${protocol} pelo site.`)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> Acompanhar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    );

  return (
    <div className="contract">
      <ol className="steps contract__steps" aria-label="Etapas da contratação">
        {STEPS.map((s, i) => (
          <li key={s} className="steps__item" data-state={i < step ? "done" : i === step ? "current" : "todo"} aria-current={i === step ? "step" : undefined}>
            <span className="steps__bar" />
            <span className="steps__label">
              <span className="steps__n">{i + 1}</span> {s}
            </span>
          </li>
        ))}
      </ol>

      <div className="contract__grid">
        <div className="card contract__card">
          <p className="contract__count">Etapa {step + 1} de {STEPS.length}</p>

          {step === 0 && (
            <form onSubmit={checkStep1} noValidate className="contract__step fade-in" key="s0">
              <h2 ref={headingRef} tabIndex={-1} className="h-2">Onde você mora?</h2>
              <p className="muted contract__sub">Usamos o endereço para confirmar a viabilidade técnica da fibra.</p>
              <div className="form-grid form-grid--3">
                <TextField
                  label="CEP"
                  name="cep"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  value={address.cep}
                  error={errors.cep}
                  loading={cepLoading}
                  success={isValidCEP(address.cep) && !cepLoading && !errors.cep}
                  hint={<>Demo: <button type="button" className="inline-btn" onClick={() => onCep("12900-100")}>12900-100</button></>}
                  onChange={(e) => onCep(e.target.value)}
                />
                <SelectField label="Cidade" name="city" value={address.city} error={errors.city} onChange={(e) => setAddress({ ...address, city: e.target.value, neighborhood: "" })}>
                  <option value="">Selecione</option>
                  {cities.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </SelectField>
                <SelectField label="Bairro" name="neighborhood" value={address.neighborhood} error={errors.neighborhood} disabled={!city} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}>
                  <option value="">{city ? "Selecione" : "—"}</option>
                  {city?.neighborhoods.map((n) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </SelectField>
                <TextField className="span-2" label="Rua" name="street" autoComplete="address-line1" value={address.street} error={errors.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                <TextField label="Número" name="number" inputMode="numeric" placeholder="123" value={address.number} error={errors.number} onChange={(e) => setAddress({ ...address, number: e.target.value.slice(0, 8) })} />
                <TextField className="span-all" label="Complemento" name="complement" optional autoComplete="address-line2" placeholder="Apto, bloco, casa..." value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} />
              </div>
              {errors.form && <FormAlert tone="error">{errors.form}</FormAlert>}
              {coverage ? (
                <div className="contract__coverage">
                  <CoverageResultView result={coverage} onReset={() => setCoverage(null)} />
                </div>
              ) : (
                <div className="contract__actions">
                  <span />
                  <Button type="submit" size="lg" loading={checking} loadingText="Verificando cobertura..." iconLeft={<Search size={18} aria-hidden="true" />}>
                    Verificar disponibilidade
                  </Button>
                </div>
              )}
            </form>
          )}

          {step === 1 && (
            <div className="contract__step fade-in" key="s1">
              <div className="contract__ok">
                <CircleCheck size={20} aria-hidden="true" /> {address.street}, {address.number} · {nbName}, {city?.name}
              </div>
              <h2 ref={headingRef} tabIndex={-1} className="h-2">Ótimo! Temos cobertura</h2>
              <p className="muted contract__sub">Escolha a velocidade ideal para sua casa.</p>
              <fieldset className="plan-pick">
                <legend className="sr-only">Plano</legend>
                {residentialPlans.map((p) => (
                  <label key={p.id} className={`plan-pick__opt ${p.featured ? "is-featured" : ""}`}>
                    <input type="radio" name="plan" value={p.id} checked={planId === p.id} onChange={() => { setPlanId(p.id); trackEvent("plan_selected", { plan: p.name, price: p.price ?? undefined, via: "contract" }); }} />
                    <span className="plan-pick__radio" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                    <span className="plan-pick__main">
                      <strong>{p.name}</strong>
                      <span>{p.wifi} · Instalação {p.installation.toLowerCase()} · {p.devices} dispositivos</span>
                    </span>
                    {p.badge && <span className="badge badge--blue">{p.badge}</span>}
                    <span className="plan-pick__price">
                      <strong>{formatPrice(p.price!)}</strong>
                      <span>/mês</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <div className="contract__actions">
                <Button variant="ghost" onClick={() => setStep(0)} iconLeft={<ArrowLeft size={18} aria-hidden="true" />}>Voltar</Button>
                <Button size="lg" onClick={() => setStep(2)} iconRight={<ArrowRight size={18} aria-hidden="true" />}>Continuar</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={checkStep3} noValidate className="contract__step fade-in" key="s2">
              <h2 ref={headingRef} tabIndex={-1} className="h-2">Seus dados</h2>
              <p className="muted contract__sub">O titular do contrato precisa ser maior de 18 anos.</p>
              <div className="form-grid form-grid--2">
                <TextField className="span-all" label="Nome completo" name="name" autoComplete="name" value={person.name} error={errors.name} onChange={(e) => setPerson({ ...person, name: e.target.value })} />
                <TextField label="CPF" name="cpf" inputMode="numeric" placeholder="000.000.000-00" value={person.cpf} error={errors.cpf} success={isValidCPF(person.cpf)} onChange={(e) => setPerson({ ...person, cpf: maskCPF(e.target.value) })} />
                <TextField label="Data de nascimento" name="birthDate" inputMode="numeric" autoComplete="bday" placeholder="dd/mm/aaaa" value={person.birthDate} error={errors.birthDate} onChange={(e) => setPerson({ ...person, birthDate: maskDate(e.target.value) })} />
                <TextField label="WhatsApp" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(00) 90000-0000" value={person.phone} error={errors.phone} onChange={(e) => setPerson({ ...person, phone: maskPhone(e.target.value) })} />
                <TextField label="E-mail" name="email" type="email" inputMode="email" autoComplete="email" placeholder="nome@email.com" value={person.email} error={errors.email} onChange={(e) => setPerson({ ...person, email: e.target.value })} />
              </div>
              <label className={`terms ${errors.terms ? "terms--error" : ""}`}>
                <input type="checkbox" name="terms" checked={person.terms} onChange={(e) => setPerson({ ...person, terms: e.target.checked })} />
                <span className="choice__box" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                <span>
                  Li e aceito os <Link href="/termos-de-uso#contrato" target="_blank">termos do contrato</Link> e a{" "}
                  <Link href="/politica-de-privacidade" target="_blank">Política de Privacidade</Link>.
                </span>
              </label>
              {errors.terms && <p className="field__error" role="alert">{errors.terms}</p>}
              <p className="contract__secure"><ShieldCheck size={16} aria-hidden="true" /> Seus dados são usados apenas para o cadastro e a instalação.</p>
              <div className="contract__actions">
                <Button variant="ghost" onClick={() => setStep(1)} iconLeft={<ArrowLeft size={18} aria-hidden="true" />}>Voltar</Button>
                <Button type="submit" size="lg" iconRight={<ArrowRight size={18} aria-hidden="true" />}>Continuar</Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="contract__step fade-in" key="s3">
              <h2 ref={headingRef} tabIndex={-1} className="h-2">Agende sua instalação</h2>
              <p className="muted contract__sub">Escolha o dia e o período. O técnico avisa pelo WhatsApp antes de chegar.</p>
              <ul className="slots">
                {slots.map((d) => (
                  <li key={d.date.toISOString()} className="slot">
                    <p className="slot__day">
                      <strong>{formatWeekday(d.date)}</strong>
                      <span className="mono">{formatDayMonth(d.date)}</span>
                    </p>
                    <div className="slot__periods">
                      {d.periods.map((p) => {
                        const selected = slot?.date.getTime() === d.date.getTime() && slot.period === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            className="slot__btn"
                            aria-pressed={selected}
                            disabled={!p.available}
                            onClick={() => setSlot({ date: d.date, period: p.id })}
                            aria-label={`${formatWeekday(d.date)} ${formatDayMonth(d.date)}, ${p.label} ${p.window}${p.available ? "" : " — indisponível"}`}
                          >
                            {p.id === "manha" ? <Sun size={16} aria-hidden="true" /> : <Sunset size={16} aria-hidden="true" />}
                            <span>
                              <strong>{p.label}</strong>
                              <small>{p.available ? p.window : "Esgotado"}</small>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
              {errors.slot && <p className="field__error" role="alert">{errors.slot}</p>}
              <div className="contract__actions">
                <Button variant="ghost" onClick={() => setStep(2)} iconLeft={<ArrowLeft size={18} aria-hidden="true" />}>Voltar</Button>
                <Button
                  size="lg"
                  onClick={() => {
                    if (!slot) return setErrors({ slot: "Escolha um dia e um período para continuar." });
                    setErrors({});
                    setStep(4);
                  }}
                  iconRight={<ArrowRight size={18} aria-hidden="true" />}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 4 && slot && (
            <div className="contract__step fade-in" key="s4">
              <h2 ref={headingRef} tabIndex={-1} className="h-2">Confira seu pedido</h2>
              <p className="muted contract__sub">Revise as informações antes de finalizar.</p>
              <dl className="review">
                <div><dt>Plano</dt><dd><strong>{plan.name}</strong></dd></div>
                <div><dt>Mensalidade</dt><dd><strong>{formatPrice(plan.price!)}</strong></dd></div>
                <div><dt>Instalação</dt><dd className="review__free">{plan.installation === "Grátis" ? "Grátis" : "Inclusa"}</dd></div>
                <div><dt>{plan.wifi}</dt><dd>Incluso</dd></div>
                <div><dt>Endereço</dt><dd>{address.street}, {address.number}{address.complement ? ` · ${address.complement}` : ""}<br /><span className="muted">{nbName}, {city?.name} · CEP {address.cep}</span></dd></div>
                <div><dt>Agendamento</dt><dd>{formatWeekday(slot.date)}, {formatDate(slot.date)} · {slot.period === "manha" ? "Manhã" : "Tarde"}</dd></div>
                <div><dt>Titular</dt><dd>{person.name}<br /><span className="muted">{person.email} · {person.phone}</span></dd></div>
              </dl>
              <p className="disclaimer">{disclaimers.availability} {disclaimers.equipment} Nenhum pagamento é realizado nesta etapa.</p>
              <div className="contract__actions">
                <Button variant="ghost" onClick={() => setStep(3)} iconLeft={<ArrowLeft size={18} aria-hidden="true" />}>Voltar</Button>
                <Button size="lg" loading={submitting} loadingText="Enviando pedido..." onClick={finish} iconLeft={<Check size={18} aria-hidden="true" />}>
                  Finalizar contratação
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="contract__summary" aria-label="Resumo do pedido">
          <div className="card">
            <div className="summary__head">
              <span className="summary__title">Seu pedido</span>
              <Wifi size={18} aria-hidden="true" />
            </div>
            <div className="summary__plan">
              <strong>{plan.name}</strong>
              <span>{plan.speed} Mbps · {plan.wifi}</span>
            </div>
            <dl className="summary__list">
              <div><dt>Mensalidade</dt><dd className="mono">{formatPrice(plan.price!)}</dd></div>
              <div><dt>Instalação</dt><dd className="review__free">{plan.installation === "Grátis" ? "Grátis" : "Inclusa"}</dd></div>
              <div><dt>Roteador</dt><dd>Comodato</dd></div>
              {nbName && step > 0 && <div><dt>Endereço</dt><dd>{nbName}</dd></div>}
              {slot && <div><dt>Instalação</dt><dd>{formatDayMonth(slot.date)} · {slot.period === "manha" ? "manhã" : "tarde"}</dd></div>}
            </dl>
            <div className="summary__total">
              <span>Total mensal</span>
              <strong>{formatPrice(plan.price!)}</strong>
            </div>
          </div>
          <p className="summary__help">
            Dúvidas? <a className="link" href={whatsappLink(waMessages.sales)} target="_blank" rel="noopener noreferrer">Fale com um consultor</a>
          </p>
        </aside>
      </div>
    </div>
  );
}
