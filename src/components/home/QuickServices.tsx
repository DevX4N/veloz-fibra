"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useNetworkStatus } from "@/components/providers/NetworkStatusProvider";

const tools: { href: string; icon: IconName; title: string; detail: string; status?: boolean }[] = [
  { href: "/segunda-via", icon: "receipt", title: "Segunda via", detail: "PIX e boleto na hora" },
  { href: "/teste-de-velocidade", icon: "gauge", title: "Teste de velocidade", detail: "Meça sua conexão" },
  { href: "/status", icon: "activity", title: "Status da rede", detail: "", status: true },
  { href: "/suporte", icon: "headphones", title: "Suporte", detail: "Diagnóstico e chamados" },
  { href: "/cobertura", icon: "map-pin", title: "Consultar cobertura", detail: "Por bairro ou CEP" },
];

/** Atalhos para quem já é cliente — logo abaixo do hero, sem passar pelo funil comercial. */
export function QuickServices() {
  const { level, label } = useNetworkStatus();
  return (
    <section className="quick" aria-labelledby="quick-title">
      <div className="container">
        <div className="quick__panel">
          <div className="quick__head">
            <h2 id="quick-title" className="quick__title">
              Já é cliente? Resolva por aqui
            </h2>
            <Link href="/area-do-cliente" className="link">
              Área do Cliente <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="quick__list">
            {tools.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="quick__item">
                  <span className="icon-tile">
                    <Icon name={t.icon} size={21} />
                  </span>
                  <span className="quick__text">
                    <strong>{t.title}</strong>
                    {t.status ? (
                      <span className={`quick__status quick__status--${level}`}>
                        <span className={`dot ${level === "degraded" ? "dot--warn" : level === "outage" ? "dot--down" : ""}`} aria-hidden="true" />
                        {level === "operational" ? "Operando normalmente" : label}
                      </span>
                    ) : (
                      <span>{t.detail}</span>
                    )}
                  </span>
                  <ChevronRight size={18} className="quick__chev" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
