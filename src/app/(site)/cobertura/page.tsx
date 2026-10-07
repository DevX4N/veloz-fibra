import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CoverageChecker } from "@/components/coverage/CoverageChecker";
import { CoverageMap } from "@/components/coverage/CoverageMap";
import { Cities } from "@/components/home/Cities";
import { FAQSection } from "@/components/shared/FAQSection";
import { FinalCTA } from "@/components/shared/FinalCTA";
import { faqs } from "@/data/content";
import { coverageTotals } from "@/data/coverage";

export const metadata: Metadata = {
  title: { absolute: "Consulte a Cobertura da Veloz Fibra" },
  description: `Veja se a fibra óptica da Veloz já chegou ao seu endereço. ${coverageTotals.neighborhoods} bairros conectados em ${coverageTotals.cities} cidades e novas regiões em expansão.`,
  alternates: { canonical: "/cobertura" },
};

export default function CoberturaPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Cobertura", href: "/cobertura" }]}
        title="A Veloz Fibra já chegou até você?"
        text="Informe sua localização e descubra se nossa rede está disponível na sua região. A consulta é gratuita e leva menos de 1 minuto."
        aside={
          <div className="card card--pad page-hero__card">
            <CoverageChecker />
          </div>
        }
      />

      <section className="section section--tight" aria-labelledby="map-title">
        <div className="container">
          <div className="section-head section-head--row">
            <div>
              <h2 id="map-title" className="h-2">
                Onde a fibra já passa
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: 440 }}>
              Cada célula representa um bairro. Passe o mouse para ver o nome e o status da rede.
            </p>
          </div>
          <CoverageMap />
        </div>
      </section>

      <Cities />
      <FAQSection items={faqs.coverage} white title="Dúvidas sobre cobertura" />
      <FinalCTA title="Sua região ainda não tem cobertura?" text="Cadastre seu interesse na consulta acima ou fale com a nossa equipe — usamos esses pedidos para planejar a expansão." />
    </>
  );
}
