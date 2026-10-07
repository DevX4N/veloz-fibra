import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Cities } from "@/components/home/Cities";
import { CoverageMap } from "@/components/coverage/CoverageMap";
import { FinalCTA } from "@/components/shared/FinalCTA";
import { coverageTotals } from "@/data/coverage";

export const metadata: Metadata = {
  title: "Cidades atendidas",
  description: `Internet fibra óptica em ${coverageTotals.cities} cidades e ${coverageTotals.neighborhoods} bairros. Veja onde a Veloz Fibra está e consulte seu endereço.`,
  alternates: { canonical: "/internet-fibra" },
};

export default function CidadesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Cidades atendidas", href: "/internet-fibra" }]}
        title="Cidades atendidas"
        text={`Hoje são ${coverageTotals.neighborhoods} bairros conectados em ${coverageTotals.cities} cidades, e a rede segue crescendo. Escolha sua cidade para ver planos, bairros e condições locais.`}
      />
      <Cities title="Escolha sua cidade" />
      <section className="section section--tight section--white section--line" aria-labelledby="map-title">
        <div className="container">
          <div className="section-head">
            <h2 id="map-title" className="h-2">
              Bairros por cidade
            </h2>
          </div>
          <CoverageMap />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
