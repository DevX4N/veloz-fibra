"use client";

import { Check, CircleCheck, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { businessNeeds, employeeRanges } from "@/data/content";
import { cities } from "@/data/coverage";
import { getPlan } from "@/data/plans";
import { submitBusinessLead, type BusinessLead } from "@/services/leadService";
import { maskCNPJ, maskPhone } from "@/utils/masks";
import { isValidCNPJ, isValidEmail, isValidMobile, isValidPhone } from "@/utils/validation";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField, FormAlert } from "@/components/ui/Field";
import { useToast } from "@/components/providers/ToastProvider";

const empty: BusinessLead = { company: "", name: "", cnpj: "", phone: "", whatsapp: "", email: "", city: "", employees: "", needs: [] };

export function BusinessForm() {
  const toast = useToast();
  const [v, setV] = useState<BusinessLead>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessLead, string>>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [planNote, setPlanNote] = useState<string | null>(null);

  const params = useSearchParams();
  const planParam = params.get("plano");

  useEffect(() => {
    const plan = getPlan(planParam);
    if (plan && plan.segment === "empresarial") {
      setPlanNote(plan.name);
      setV((x) => ({ ...x, needs: x.needs.includes("Internet empresarial") ? x.needs : ["Internet empresarial", ...x.needs] }));
    }
  }, [planParam]);

  const set = (k: keyof BusinessLead) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setV({ ...v, [k]: e.target.value });

  function toggleNeed(n: string) {
    setV((x) => ({ ...x, needs: x.needs.includes(n) ? x.needs.filter((i) => i !== n) : [...x.needs, n] }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: typeof errors = {};
    if (!v.company.trim()) err.company = "Informe o nome da empresa.";
    if (v.name.trim().split(" ").length < 2) err.name = "Informe nome e sobrenome.";
    if (!isValidCNPJ(v.cnpj)) err.cnpj = "CNPJ inválido. Confira os 14 dígitos.";
    if (!isValidPhone(v.phone)) err.phone = "Informe um telefone com DDD.";
    if (!isValidMobile(v.whatsapp)) err.whatsapp = "Informe um celular com DDD, ex.: (00) 90000-0000.";
    if (!isValidEmail(v.email)) err.email = "Informe um e-mail válido.";
    if (!v.city) err.city = "Selecione a cidade.";
    if (!v.employees) err.employees = "Selecione a faixa de funcionários.";
    if (!v.needs.length) err.needs = "Selecione ao menos uma opção.";
    setErrors(err);
    if (Object.keys(err).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(err)[0]}"]`)?.focus();
      return;
    }
    setLoading(true);
    const r = await submitBusinessLead(v);
    setLoading(false);
    setDone(r.protocol);
    trackEvent("business_lead", { needs: v.needs.join("|"), employees: v.employees, city: v.city });
    toast("Solicitação enviada com sucesso.");
  }

  if (done)
    return (
      <div className="form-success fade-in" role="status">
        <span className="form-success__icon"><CircleCheck size={30} aria-hidden="true" /></span>
        <h3 className="h-3">Solicitação enviada com sucesso.</h3>
        <p>
          Protocolo <strong className="mono">{done}</strong>. Um consultor empresarial entrará em contato em até 1 dia útil
          pelo WhatsApp ou telefone informado.
        </p>
        <p className="disclaimer">Em uma aplicação real, os dados seriam enviados ao CRM comercial do provedor.</p>
        <Button variant="secondary" onClick={() => { setV(empty); setDone(null); }}>
          Enviar outra solicitação
        </Button>
      </div>
    );

  return (
    <form className="stack-lg" onSubmit={submit} noValidate>
      {planNote && (
        <FormAlert tone="info" icon={<Check size={18} aria-hidden="true" />}>
          Plano de interesse: <strong>{planNote}</strong>. Ajuste as necessidades abaixo se quiser.
        </FormAlert>
      )}
      <div className="form-grid form-grid--2">
        <TextField label="Empresa" name="company" autoComplete="organization" value={v.company} error={errors.company} onChange={set("company")} />
        <TextField label="Nome" name="name" autoComplete="name" value={v.name} error={errors.name} onChange={set("name")} />
        <TextField
          label="CNPJ"
          name="cnpj"
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          value={v.cnpj}
          error={errors.cnpj}
          success={isValidCNPJ(v.cnpj)}
          onChange={(e) => setV({ ...v, cnpj: maskCNPJ(e.target.value) })}
        />
        <TextField
          label="E-mail"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nome@empresa.com.br"
          value={v.email}
          error={errors.email}
          onChange={set("email")}
        />
        <TextField
          label="Telefone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(00) 0000-0000"
          value={v.phone}
          error={errors.phone}
          onChange={(e) => setV({ ...v, phone: maskPhone(e.target.value) })}
        />
        <TextField
          label="WhatsApp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          placeholder="(00) 90000-0000"
          value={v.whatsapp}
          error={errors.whatsapp}
          onChange={(e) => setV({ ...v, whatsapp: maskPhone(e.target.value) })}
        />
        <SelectField label="Cidade" name="city" value={v.city} error={errors.city} onChange={set("city")}>
          <option value="">Selecione</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
          <option value="Outra">Outra cidade</option>
        </SelectField>
        <SelectField label="Quantidade aproximada de funcionários" name="employees" value={v.employees} error={errors.employees} onChange={set("employees")}>
          <option value="">Selecione</option>
          {employeeRanges.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </SelectField>
      </div>

      <fieldset className="fieldset">
        <legend className="field__label">O que sua empresa precisa?</legend>
        <div className="choice-grid">
          {businessNeeds.map((n, i) => (
            <label key={n} className="choice">
              <input type="checkbox" name={i === 0 ? "needs" : undefined} checked={v.needs.includes(n)} onChange={() => toggleNeed(n)} />
              <span className="choice__box" aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              {n}
            </label>
          ))}
        </div>
        {errors.needs && (
          <p className="field__error" role="alert" style={{ marginTop: 8 }}>
            {errors.needs}
          </p>
        )}
      </fieldset>

      <div className="form-foot">
        <Button type="submit" size="lg" loading={loading} loadingText="Enviando..." iconRight={<Send size={18} aria-hidden="true" />}>
          Solicitar proposta
        </Button>
        <p className="disclaimer">
          Ao enviar, você concorda com o contato da equipe comercial. Seus dados são tratados conforme a{" "}
          <a href="/politica-de-privacidade">Política de Privacidade</a>.
        </p>
      </div>
    </form>
  );
}
