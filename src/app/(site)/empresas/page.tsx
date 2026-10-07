import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Server, Network, Check } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Benefits } from "@/components/home/Benefits";
import { PlansSection } from "@/components/plans/PlansSection";
import { FAQSection } from "@/components/shared/FAQSection";
import { BusinessForm } from "@/components/business/BusinessForm";
import { LinkMonitor } from "@/components/business/LinkMonitor";
import { businessBenefits, faqs } from "@/data/content";
import { company } from "@/config/site";
import { whatsappLink, waMessages } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: { absolute: "Internet Empresarial e Link Dedicado | Veloz Fibra" },
  description:
    "Internet empresarial em fibra óptica, IP fixo, link dedicado com SLA e Wi-Fi empresarial. Solicite uma proposta para sua empresa.",
  alternates: { canonical: "/empresas" },
};

export default function EmpresasPage() {
  return (
    <>
      <PageHero
        tone="dark"
        crumbs={[{ label: "Para sua empresa", href: "/empresas" }]}
        title="Sua empresa não pode ficar offline."
        text="Conectividade de alta performance para manter sua equipe, sistemas e clientes sempre conectados."
        aside={<LinkMonitor />}
      >
        <div className="btn-row btn-row--stack page-hero__ctas">
          <Link href="#proposta" className="btn btn--light btn--lg">
            Solicitar proposta <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a href={whatsappLink(waMessages.business)} target="_blank" rel="noopener noreferrer" className="btn btn--outline-light btn--lg">
            <MessageCircle size={18} aria-hidden="true" /> Falar com comercial
          </a>
        </div>
      </PageHero>

      <Benefits
        title="Infraestrutura pensada para negócios"
        text="Do pequeno comércio à operação com várias filiais, com suporte de quem conhece a rede."
        items={businessBenefits}
        columns={4}
      />

      <PlansSection id="planos-empresariais" initial="empresarial" tabs={false} />

      <section className="section section--white section--line" aria-label="Soluções avançadas">
        <div className="container solutions">
          <article id="ip-fixo" className="solution">
            <Server size={28} strokeWidth={1.6} className="solution__icon" aria-hidden="true" />
            <h2 className="h-3">IP fixo</h2>
            <p>
              Um endereço público que não muda. Ideal para acessar câmeras, servidores, ERPs locais e VPNs de qualquer
              lugar, com estabilidade para integrações e certificados.
            </p>
            <ul className="check-list">
              <li><Check size={17} aria-hidden="true" /> Bloco /32 ou /29 conforme projeto</li>
              <li><Check size={17} aria-hidden="true" /> Configuração feita pela nossa equipe</li>
              <li><Check size={17} aria-hidden="true" /> Disponível nos planos empresariais</li>
            </ul>
          </article>
          <article id="link-dedicado" className="solution solution--dark on-dark">
            <Network size={28} strokeWidth={1.6} className="solution__icon" aria-hidden="true" />
            <h2 className="h-3">Link dedicado</h2>
            <p>
              Banda exclusiva e simétrica, sem compartilhamento, com contrato de nível de serviço. Para operações que não
              podem parar: clínicas, indústrias, call centers e sistemas em nuvem.
            </p>
            <ul className="check-list">
              <li><Check size={17} aria-hidden="true" /> Download e upload iguais (simétrico)</li>
              <li><Check size={17} aria-hidden="true" /> SLA com prazos de reparo definidos em contrato</li>
              <li><Check size={17} aria-hidden="true" /> Monitoramento 24h e abertura proativa de chamados</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="proposta" className="section" aria-labelledby="proposta-title">
        <div className="container proposal">
          <div className="proposal__aside">
            <h2 id="proposta-title" className="h-2">
              Solicite uma proposta
            </h2>
            <p className="lead">Conte um pouco sobre sua empresa. Um consultor retorna em até 1 dia útil com a solução ideal.</p>
            <ol className="proposal__steps">
              <li><strong>Análise</strong><span>Entendemos sua operação e verificamos a viabilidade no endereço.</span></li>
              <li><strong>Projeto</strong><span>Montamos a proposta com velocidade, IP, equipamentos e SLA.</span></li>
              <li><strong>Ativação</strong><span>Instalação agendada para não interromper sua rotina.</span></li>
            </ol>
            <p className="small muted">
              Prefere e-mail? <a className="link" href={`mailto:${company.commercialEmail}`}>{company.commercialEmail}</a>
            </p>
          </div>
          <div className="card card--pad proposal__form">
            <Suspense>
              <BusinessForm />
            </Suspense>
          </div>
        </div>
      </section>

      <FAQSection items={faqs.business} white title="Dúvidas de empresas" />
    </>
  );
}
