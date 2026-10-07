"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, ArrowLeft, Receipt, Gauge, Headphones, TrendingUp } from "lucide-react";
import { useState } from "react";
import { demoDocuments } from "@/data/customers";
import { login } from "@/services/customerService";
import { ServiceError, simulateLatency } from "@/services/core";
import { maskCPFOrCNPJ } from "@/utils/masks";
import { isValidDocument, isValidEmail } from "@/utils/validation";
import { trackEvent } from "@/lib/analytics";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { TextField, FormAlert } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/providers/ToastProvider";

function RecoverModal({ open, onClose, mode }: { open: boolean; onClose: () => void; mode: "forgot" | "first" }) {
  const toast = useToast();
  const [doc, setDoc] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (!isValidDocument(doc)) x.doc = "Informe um CPF ou CNPJ válido.";
    if (mode === "first" && !isValidEmail(email)) x.email = "Informe o e-mail cadastrado.";
    setErr(x);
    if (Object.keys(x).length) return;
    setLoading(true);
    await simulateLatency();
    setLoading(false);
    setSent(true);
    toast(mode === "forgot" ? "Link de redefinição enviado." : "Cadastro de acesso iniciado.");
  }

  const close = () => {
    onClose();
    setTimeout(() => { setSent(false); setDoc(""); setEmail(""); setErr({}); }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      size="sm"
      title={mode === "forgot" ? "Esqueci minha senha" : "Primeiro acesso"}
      description={
        sent
          ? undefined
          : mode === "forgot"
            ? "Informe o documento do titular. Enviaremos um link para o e-mail e WhatsApp cadastrados."
            : "Crie sua senha usando os dados do contrato."
      }
    >
      {sent ? (
        <div className="stack">
          <FormAlert tone="success">
            {mode === "forgot"
              ? "Pronto! Se o documento estiver cadastrado, você receberá o link em instantes."
              : "Enviamos um código de confirmação para o e-mail informado."}
          </FormAlert>
          <p className="disclaimer">Demonstração: nenhuma mensagem é enviada de verdade.</p>
          <Button block onClick={close}>Voltar ao login</Button>
        </div>
      ) : (
        <form className="form-grid" onSubmit={submit} noValidate>
          <TextField label="CPF ou CNPJ" inputMode="numeric" placeholder="000.000.000-00" value={doc} error={err.doc} onChange={(e) => setDoc(maskCPFOrCNPJ(e.target.value))} />
          {mode === "first" && (
            <TextField label="E-mail cadastrado" type="email" inputMode="email" value={email} error={err.email} onChange={(e) => setEmail(e.target.value)} />
          )}
          <Button type="submit" block loading={loading} loadingText="Enviando...">
            {mode === "forgot" ? "Enviar link" : "Continuar"}
          </Button>
        </form>
      )}
    </Modal>
  );
}

export function CustomerLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [doc, setDoc] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [entering, setEntering] = useState(false);
  const [modal, setModal] = useState<"forgot" | "first" | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFailure(null);
    const err: Record<string, string> = {};
    if (!isValidDocument(doc)) err.doc = "Informe um CPF ou CNPJ válido.";
    if (password.length < 4) err.password = "A senha tem pelo menos 4 caracteres.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    try {
      await login(doc, password);
      trackEvent("customer_login");
      setEntering(true);
      router.push("/area-do-cliente/painel");
    } catch (e) {
      setFailure(e instanceof ServiceError ? e.message : "Não foi possível entrar agora. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <aside className="login__brand on-dark" aria-hidden="true">
        <svg className="login__fibers" viewBox="0 0 400 800" preserveAspectRatio="none">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${-40 + i * 50} 820 C ${60 + i * 30} 520, ${140 + i * 24} 380, ${460} ${120 + i * 40}`} pathLength={600} style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </svg>
        <div className="login__brand-inner">
          <Logo tone="light" href={null} />
          <div>
            <h2 className="login__title">Sua internet, na palma da mão.</h2>
          </div>
          <ul className="login__features">
            <li><Receipt size={18} /> Segunda via e PIX em segundos</li>
            <li><Gauge size={18} /> Teste de velocidade e diagnóstico</li>
            <li><TrendingUp size={18} /> Upgrade de plano sem visita técnica</li>
            <li><Headphones size={18} /> Chamados com protocolo e histórico</li>
          </ul>
        </div>
      </aside>

      <main className="login__main" id="conteudo">
        <div className="login__top">
          <span className="login__mobile-logo"><Logo /></span>
          <Link href="/" className="text-btn"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao site</Link>
        </div>

        <div className="login__card">
          {entering ? (
            <div className="login__entering fade-in" role="status">
              <span className="spinner spinner--lg" aria-hidden="true" />
              <p className="h-4">Carregando sua conta...</p>
              <p className="muted small">Buscando plano, faturas e atendimentos.</p>
            </div>
          ) : (
            <>
              <h1 className="h-2">Área do Cliente</h1>
              <p className="muted">Acesse com o CPF ou CNPJ do titular do contrato.</p>

              {params.get("expirou") && <FormAlert tone="info">Faça login para acessar a Área do Cliente.</FormAlert>}
              {params.get("saiu") && <FormAlert tone="success">Você saiu da sua conta com segurança.</FormAlert>}
              {failure && <FormAlert tone="error">{failure}</FormAlert>}

              <form className="form-grid" onSubmit={submit} noValidate>
                <TextField
                  label="CPF ou CNPJ"
                  name="document"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="000.000.000-00"
                  value={doc}
                  error={errors.doc}
                  disabled={loading}
                  onChange={(e) => setDoc(maskCPFOrCNPJ(e.target.value))}
                />
                <div className="field-pass">
                  <TextField
                    label="Senha"
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    error={errors.password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="field-pass__toggle" onClick={() => setShow((s) => !s)} aria-label={show ? "Ocultar senha" : "Mostrar senha"} aria-pressed={show}>
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="login__links">
                  <button type="button" className="text-btn" onClick={() => setModal("forgot")}>Esqueci minha senha</button>
                  <button type="button" className="text-btn" onClick={() => setModal("first")}>Primeiro acesso</button>
                </div>
                <Button type="submit" size="lg" block loading={loading} loadingText="Entrando..." iconLeft={<LogIn size={18} aria-hidden="true" />}>
                  Entrar
                </Button>
              </form>

              <div className="login__demo">
                <p><strong>Acesso de demonstração</strong> — qualquer senha com 4+ caracteres.</p>
                <div className="demo-hint">
                  {demoDocuments.map((d) => (
                    <button key={d.document} type="button" className="demo-hint__chip" onClick={() => { setDoc(d.document); setPassword("demo1234"); setErrors({}); }}>
                      {d.document} <em>{d.hint}</em>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <p className="login__foot">Autenticação simulada · nenhum dado real é verificado.</p>
      </main>

      <RecoverModal open={modal !== null} mode={modal ?? "forgot"} onClose={() => setModal(null)} />
    </div>
  );
}
