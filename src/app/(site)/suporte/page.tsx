import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, UserRound, Receipt, Activity, Gauge } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SupportSearch } from "@/components/support/SupportCenter";
import { QuickDiagnosis } from "@/components/support/QuickDiagnosis";
import { company } from "@/config/site";
import { whatsappLink, waMessages } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: { absolute: "Central de Ajuda | Veloz Fibra" },
  description: "Respostas para internet lenta, sem conexão, Wi-Fi, faturas e mais. Diagnóstico rápido e canais de suporte da Veloz Fibra.",
  alternates: { canonical: "/suporte" },
};

export default function SuportePage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Central de ajuda", href: "/suporte" }]}
        title="Como podemos ajudar?"
        text="Encontre respostas rápidas, faça o diagnóstico da sua conexão ou fale com a equipe técnica."
      >
        <ul className="support-shortcuts">
          <li><Link href="/segunda-via"><Receipt size={17} aria-hidden="true" /> Segunda via</Link></li>
          <li><Link href="/status"><Activity size={17} aria-hidden="true" /> Status da rede</Link></li>
          <li><Link href="/teste-de-velocidade"><Gauge size={17} aria-hidden="true" /> Teste de velocidade</Link></li>
          <li><Link href="/area-do-cliente"><UserRound size={17} aria-hidden="true" /> Área do Cliente</Link></li>
        </ul>
      </PageHero>

      <section className="section section--tight" aria-label="Busca e artigos">
        <div className="container">
          <SupportSearch />
        </div>
      </section>

      <section id="diagnostico" className="section section--white section--line" aria-labelledby="diag-title">
        <div className="container diag-layout">
          <div>
            <h2 id="diag-title" className="h-2">
              Sua internet não está funcionando?
            </h2>
            <p className="lead">
              Na maioria dos casos, estes quatro passos resolvem. Se não resolver, nossa equipe assume a partir daqui.
            </p>
          </div>
          <QuickDiagnosis />
        </div>
      </section>

      <section className="section" aria-labelledby="channels-title">
        <div className="container">
          <div className="section-head">
            <h2 id="channels-title" className="h-2">
              Fale com o suporte
            </h2>
          </div>
          <ul className="channels">
            <li className="card card--pad">
              <span className="icon-tile icon-tile--green"><MessageCircle size={22} aria-hidden="true" /></span>
              <h3 className="h-4">WhatsApp</h3>
              <p>Atendimento técnico e financeiro, com envio de fotos do equipamento.</p>
              <a className="btn btn--success btn--block" href={whatsappLink(waMessages.support)} target="_blank" rel="noopener noreferrer">
                Abrir WhatsApp
              </a>
            </li>
            <li className="card card--pad">
              <span className="icon-tile"><UserRound size={22} aria-hidden="true" /></span>
              <h3 className="h-4">Área do Cliente</h3>
              <p>Abra e acompanhe chamados com protocolo e histórico.</p>
              <Link className="btn btn--primary btn--block" href="/area-do-cliente">
                Abrir atendimento
              </Link>
            </li>
            <li className="card card--pad">
              <span className="icon-tile icon-tile--neutral"><Phone size={22} aria-hidden="true" /></span>
              <h3 className="h-4">Telefone</h3>
              <p>
                {company.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}
              </p>
              <a className="btn btn--secondary btn--block" href={`tel:${company.phoneHref}`}>
                Ligar {company.phone}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
