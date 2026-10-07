import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Router, Wifi, Radio, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { PlansSection } from "@/components/plans/PlansSection";
import { ComparisonTable } from "@/components/plans/ComparisonTable";
import { Benefits } from "@/components/home/Benefits";
import { FAQSection } from "@/components/shared/FAQSection";
import { FinalCTA } from "@/components/shared/FinalCTA";
import { benefits, faqs } from "@/data/content";
import { startingPrice } from "@/data/plans";
import { formatPrice } from "@/utils/format";
import { disclaimers } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Planos de Internet Fibra Óptica | Veloz Fibra" },
  description: `Planos de internet 100% fibra óptica de 500 Mega a 1 Giga, a partir de ${formatPrice(startingPrice)}/mês. Wi-Fi 6, instalação grátis e suporte especializado.`,
  alternates: { canonical: "/planos" },
};

export default function PlanosPage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Planos", href: "/planos" }]}
        title="Planos de internet fibra óptica"
        text="Velocidade de verdade do roteador até cada cômodo. Compare, escolha e contrate online em poucos minutos."
      >
        <p className="page-hero__meta">
          A partir de <strong>{formatPrice(startingPrice)}/mês</strong> · Planos disponíveis conforme região ·{" "}
          <Link href="/cobertura" className="link link--inline">
            Consultar cobertura <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </p>
      </PageHero>

      <PlansSection tabs={false} />

      <section className="section section--tight" aria-labelledby="compare-title">
        <div className="container">
          <div className="section-head">
            <h2 id="compare-title" className="h-2">
              Compare os planos lado a lado
            </h2>
          </div>
          <ComparisonTable />
          <p className="disclaimer" style={{ marginTop: 16 }}>
            {disclaimers.speed} {disclaimers.equipment}
          </p>
        </div>
      </section>

      <Benefits items={benefits} />

      <section className="section" aria-labelledby="wifi-title">
        <div className="container wifi-feature">
          <div>
            <h2 id="wifi-title" className="h-2">
              Wi-Fi 6 configurado por quem entende
            </h2>
            <p className="lead">
              Nos planos de 700 Mega e 1 Giga você recebe roteador Wi-Fi 6 em comodato. O técnico posiciona, configura e
              testa o sinal com você antes de ir embora.
            </p>
            <ul className="wifi-feature__list">
              <li><Wifi size={20} aria-hidden="true" /> Redes 2.4 GHz e 5 GHz com troca automática</li>
              <li><Radio size={20} aria-hidden="true" /> Mais dispositivos ao mesmo tempo, com menos interferência</li>
              <li><ShieldCheck size={20} aria-hidden="true" /> Segurança WPA3 e atualizações remotas</li>
            </ul>
          </div>
          <div className="wifi-feature__card" aria-hidden="true">
            <Router size={56} strokeWidth={1.3} />
            <strong>Veloz AX3000</strong>
            <span className="mono">Wi-Fi 6 · 802.11ax · dual band</span>
            <dl>
              <div><dt>Velocidade Wi-Fi</dt><dd className="mono">até 3 Gbps</dd></div>
              <div><dt>Cobertura</dt><dd className="mono">até 120 m²</dd></div>
              <div><dt>Portas</dt><dd className="mono">4× Gigabit</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <FAQSection items={[...faqs.plans, ...faqs.general.slice(1, 4)]} white title="Dúvidas sobre os planos" />
      <FinalCTA />
    </>
  );
}
