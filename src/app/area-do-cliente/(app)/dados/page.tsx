"use client";

import Link from "next/link";
import { Lock, Save } from "lucide-react";
import { useState } from "react";
import { DashHeader } from "@/components/account/DashboardShell";
import { useCustomer } from "@/components/account/CustomerProvider";
import { updateCustomer } from "@/services/customerService";
import { simulateLatency } from "@/services/core";
import { maskPhone } from "@/utils/masks";
import { isValidEmail, isValidMobile } from "@/utils/validation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/providers/ToastProvider";

export default function DadosPage() {
  const { customer, refresh } = useCustomer();
  const toast = useToast();
  const c = customer!;
  const [email, setEmail] = useState(c.email);
  const [phone, setPhone] = useState(c.phone);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState<Record<string, string>>({});
  const [pwLoading, setPwLoading] = useState(false);
  const dirty = email !== c.email || phone !== c.phone;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!isValidEmail(email)) err.email = "Informe um e-mail válido.";
    if (!isValidMobile(phone)) err.phone = "Informe um celular com DDD.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSaving(true);
    await updateCustomer({ email, phone });
    await refresh();
    setSaving(false);
    toast("Dados atualizados com sucesso.");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (pw.current.length < 4) err.current = "Informe a senha atual.";
    if (pw.next.length < 8) err.next = "Use pelo menos 8 caracteres.";
    if (pw.confirm !== pw.next) err.confirm = "As senhas não conferem.";
    setPwErr(err);
    if (Object.keys(err).length) return;
    setPwLoading(true);
    await simulateLatency();
    setPwLoading(false);
    setPwOpen(false);
    setPw({ current: "", next: "", confirm: "" });
    toast("Senha alterada.");
  }

  return (
    <>
      <DashHeader title="Dados cadastrais" text="Mantenha seus contatos atualizados para receber faturas e avisos de manutenção." />
      <form className="card card--pad stack-lg" onSubmit={save} noValidate>
        <section aria-labelledby="d-holder">
          <h2 id="d-holder" className="dash-section__title">Titular</h2>
          <div className="form-grid form-grid--3">
            <TextField label="Nome completo" value={c.name} disabled optional={false} readOnly />
            <TextField label="CPF" value={c.document} disabled readOnly />
            <TextField label="Data de nascimento" value={c.birthDate} disabled readOnly />
          </div>
          <p className="field__hint" style={{ marginTop: 10 }}>Para alterar a titularidade, fale com nossa equipe — é necessário enviar documentos.</p>
        </section>

        <section aria-labelledby="d-contact">
          <h2 id="d-contact" className="dash-section__title">Contato</h2>
          <div className="form-grid form-grid--2">
            <TextField label="E-mail" type="email" inputMode="email" autoComplete="email" value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national" value={phone} error={errors.phone} onChange={(e) => setPhone(maskPhone(e.target.value))} />
          </div>
        </section>

        <section aria-labelledby="d-address">
          <h2 id="d-address" className="dash-section__title">Endereço de instalação</h2>
          <div className="form-grid form-grid--3">
            <TextField label="CEP" value={c.address.cep} disabled readOnly />
            <TextField className="span-2" label="Rua" value={`${c.address.street}, ${c.address.number}`} disabled readOnly />
            <TextField label="Complemento" value={c.address.complement} disabled readOnly />
            <TextField label="Bairro" value={c.address.district} disabled readOnly />
            <TextField label="Cidade" value={c.address.city} disabled readOnly />
          </div>
          <p className="field__hint" style={{ marginTop: 10 }}>
            Vai mudar de endereço? <Link className="link" href="/area-do-cliente/servicos">Solicite a mudança em Serviços</Link>.
          </p>
        </section>

        <div className="contract__actions">
          <Button variant="ghost" iconLeft={<Lock size={17} aria-hidden="true" />} onClick={() => setPwOpen(true)}>Alterar senha</Button>
          <Button type="submit" disabled={!dirty} loading={saving} loadingText="Salvando..." iconLeft={<Save size={17} aria-hidden="true" />}>
            Salvar alterações
          </Button>
        </div>
      </form>

      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        size="sm"
        title="Alterar senha"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPwOpen(false)}>Cancelar</Button>
            <Button type="submit" form="pw-form" loading={pwLoading} loadingText="Salvando...">Salvar senha</Button>
          </>
        }
      >
        <form id="pw-form" className="form-grid" onSubmit={changePassword} noValidate>
          <TextField label="Senha atual" type="password" autoComplete="current-password" value={pw.current} error={pwErr.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
          <TextField label="Nova senha" type="password" autoComplete="new-password" value={pw.next} error={pwErr.next} hint="Mínimo de 8 caracteres." onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          <TextField label="Confirmar nova senha" type="password" autoComplete="new-password" value={pw.confirm} error={pwErr.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
        </form>
      </Modal>
    </>
  );
}
