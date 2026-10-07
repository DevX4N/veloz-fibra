"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { submitApplication } from "@/services/leadService";
import { isValidEmail } from "@/utils/validation";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { useToast } from "@/components/providers/ToastProvider";

export function CareersForm({ positions }: { positions: string[] }) {
  const toast = useToast();
  const [v, setV] = useState({ name: "", email: "", position: "" });
  const [errors, setErrors] = useState<Partial<typeof v>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Partial<typeof v> = {};
    if (v.name.trim().length < 3) err.name = "Informe seu nome.";
    if (!isValidEmail(v.email)) err.email = "Informe um e-mail válido.";
    if (!v.position) err.position = "Escolha uma vaga.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    await submitApplication(v);
    setLoading(false);
    setDone(true);
    toast("Candidatura enviada.");
  }

  if (done)
    return (
      <div className="form-success fade-in" role="status">
        <span className="form-success__icon"><CircleCheck size={30} aria-hidden="true" /></span>
        <h3 className="h-4">Candidatura enviada.</h3>
        <p>Obrigado! Nosso time de pessoas entra em contato por e-mail caso o perfil avance.</p>
      </div>
    );

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <TextField label="Nome completo" name="name" autoComplete="name" value={v.name} error={errors.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
      <TextField label="E-mail" name="email" type="email" inputMode="email" autoComplete="email" value={v.email} error={errors.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
      <SelectField label="Vaga" name="position" value={v.position} error={errors.position} onChange={(e) => setV({ ...v, position: e.target.value })}>
        <option value="">Selecione</option>
        {positions.map((p) => (
          <option key={p}>{p}</option>
        ))}
        <option>Banco de talentos</option>
      </SelectField>
      <Button type="submit" loading={loading} loadingText="Enviando..." block>
        Enviar candidatura
      </Button>
    </form>
  );
}
