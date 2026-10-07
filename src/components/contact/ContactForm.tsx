"use client";

import { CircleCheck, Send } from "lucide-react";
import { useState } from "react";
import { contactSubjects } from "@/data/content";
import { submitContact } from "@/services/leadService";
import { maskPhone } from "@/utils/masks";
import { isValidEmail, isValidPhone } from "@/utils/validation";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { useToast } from "@/components/providers/ToastProvider";

const empty = { name: "", email: "", phone: "", subject: "", message: "" };

export function ContactForm() {
  const toast = useToast();
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<Partial<typeof empty>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Partial<typeof empty> = {};
    if (v.name.trim().length < 3) err.name = "Informe seu nome.";
    if (!isValidEmail(v.email)) err.email = "Informe um e-mail válido.";
    if (!isValidPhone(v.phone)) err.phone = "Informe um WhatsApp com DDD.";
    if (!v.subject) err.subject = "Selecione o assunto.";
    if (v.message.trim().length < 10) err.message = "Conte um pouco mais (mínimo de 10 caracteres).";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    const r = await submitContact(v);
    setLoading(false);
    setDone(r.protocol);
    trackEvent("contact_submitted", { subject: v.subject });
    toast("Mensagem enviada com sucesso.");
  }

  if (done)
    return (
      <div className="form-success fade-in" role="status">
        <span className="form-success__icon"><CircleCheck size={30} aria-hidden="true" /></span>
        <h3 className="h-3">Mensagem enviada com sucesso.</h3>
        <p>
          Protocolo <strong className="mono">{done}</strong>. Respondemos em até 1 dia útil pelo e-mail ou WhatsApp informado.
        </p>
        <Button variant="secondary" onClick={() => { setV(empty); setDone(null); }}>
          Enviar nova mensagem
        </Button>
      </div>
    );

  return (
    <form className="form-grid form-grid--2" onSubmit={submit} noValidate>
      <TextField label="Nome" name="name" autoComplete="name" value={v.name} error={errors.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
      <TextField
        label="E-mail"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={v.email}
        error={errors.email}
        onChange={(e) => setV({ ...v, email: e.target.value })}
      />
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
      <SelectField label="Assunto" name="subject" value={v.subject} error={errors.subject} onChange={(e) => setV({ ...v, subject: e.target.value })}>
        <option value="">Selecione</option>
        {contactSubjects.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </SelectField>
      <TextAreaField
        className="span-all"
        label="Mensagem"
        name="message"
        placeholder="Como podemos ajudar?"
        value={v.message}
        error={errors.message}
        maxLength={1000}
        hint={`${v.message.length}/1000`}
        onChange={(e) => setV({ ...v, message: e.target.value })}
      />
      <div className="span-all form-foot">
        <Button type="submit" size="lg" loading={loading} loadingText="Enviando..." iconRight={<Send size={18} aria-hidden="true" />}>
          Enviar mensagem
        </Button>
      </div>
    </form>
  );
}
