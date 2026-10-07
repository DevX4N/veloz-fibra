"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import { useConsent } from "@/components/providers/ConsentProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/providers/ToastProvider";

export function CookieBanner() {
  const { consent, ready, save, settingsOpen, openSettings, closeSettings } = useConsent();
  const toast = useToast();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (settingsOpen) {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }
  }, [settingsOpen, consent]);

  const show = ready && !consent.decidedAt;

  return (
    <>
      {show && (
        <section className="cookie" aria-label="Aviso de cookies">
          <div className="cookie__text">
            <Cookie size={20} aria-hidden="true" />
            <p>
              Utilizamos cookies para melhorar sua experiência, analisar o uso do site e oferecer funcionalidades relevantes.{" "}
              <Link href="/politica-de-privacidade#cookies">Política de Privacidade</Link>
            </p>
          </div>
          <div className="cookie__actions">
            <Button variant="ghost" size="sm" onClick={openSettings}>
              Configurar
            </Button>
            <Button size="sm" onClick={() => save({ analytics: true, marketing: true })}>
              Aceitar todos
            </Button>
          </div>
        </section>
      )}

      <Modal
        open={settingsOpen}
        onClose={closeSettings}
        title="Preferências de cookies"
        description="Escolha quais categorias podem ser usadas. Você pode mudar isso a qualquer momento no rodapé."
        footer={
          <>
            <Button variant="ghost" onClick={() => { save({ analytics: false, marketing: false }); closeSettings(); toast("Somente cookies essenciais ativos."); }}>
              Recusar opcionais
            </Button>
            <Button onClick={() => { save({ analytics, marketing }); closeSettings(); toast("Preferências salvas."); }}>
              Salvar preferências
            </Button>
          </>
        }
      >
        <ul className="cookie-prefs">
          <li>
            <div>
              <strong>Essenciais</strong>
              <p>Necessários para login, segurança e funcionamento do site.</p>
            </div>
            <span className="badge">Sempre ativos</span>
          </li>
          <li>
            <label htmlFor="ck-analytics">
              <strong>Analytics</strong>
              <p>Medem o uso do site de forma agregada para melhorarmos a experiência.</p>
            </label>
            <span className="switch">
              <input id="ck-analytics" type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
              <span />
            </span>
          </li>
          <li>
            <label htmlFor="ck-marketing">
              <strong>Marketing</strong>
              <p>Permitem anúncios mais relevantes em outras plataformas.</p>
            </label>
            <span className="switch">
              <input id="ck-marketing" type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
              <span />
            </span>
          </li>
        </ul>
      </Modal>
    </>
  );
}
