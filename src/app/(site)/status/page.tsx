import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { NetworkStatus } from "@/components/status/NetworkStatus";
import { company } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Status da Rede | Veloz Fibra" },
  description: "Acompanhe em tempo real o status da rede Veloz Fibra, manutenções programadas e histórico de incidentes.",
  alternates: { canonical: "/status" },
};

export default function StatusPage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Status da rede", href: "/status" }]}
        title="Status da rede"
        text={`Transparência sobre o funcionamento dos nossos serviços. ${company.supportNote}`}
      />
      <section className="section section--tight" aria-label="Painel de status">
        <div className="container container--narrow">
          <NetworkStatus />
          <div className="status-help">
            <p>
              <strong>Sua internet está com problema e não aparece aqui?</strong> Faça o diagnóstico rápido ou abra um
              atendimento.
            </p>
            <Link href="/suporte" className="btn btn--primary">
              Ir para o suporte <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
