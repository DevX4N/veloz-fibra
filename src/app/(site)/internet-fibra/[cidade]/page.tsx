import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MessageCircle, MapPin } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { PlansSection } from "@/components/plans/PlansSection";
import { Benefits } from "@/components/home/Benefits";
import { FAQSection } from "@/components/shared/FAQSection";
import { FinalCTA } from "@/components/shared/FinalCTA";
import { CoverageChecker } from "@/components/coverage/CoverageChecker";
import { benefits } from "@/data/content";
import { cities, cityStats, getCity } from "@/data/coverage";
import { startingPrice } from "@/data/plans";
import { formatPrice } from "@/utils/format";
import { company, site } from "@/config/site";
import { whatsappLink, waMessages } from "@/lib/whatsapp";

type Params = { cidade: string };

export function generateStaticParams() {
  return cities.map((c) => ({ cidade: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { cidade } = await params;
  const city = getCity(cidade);
  if (!city) return {};
  const s = cityStats(city);
  return {
    title: { absolute: `Internet Fibra Óptica em ${city.name} | Veloz Fibra` },
    description:
      s.available > 0
        ? `Conheça os planos da Veloz Fibra disponíveis em ${city.name}: ${s.available} bairros atendidos, planos a partir de ${formatPrice(startingPrice)}/mês e consulta de cobertura no seu bairro.`
        : `A fibra óptica da Veloz Fibra está chegando a ${city.name}. Cadastre seu interesse e seja avisado quando a instalação for liberada.`,
    alternates: { canonical: `/internet-fibra/${city.slug}` },
  };
}

export default async function CidadePage({ params }: { params: Promise<Params> }) {
  const { cidade } = await params;
  const city = getCity(cidade);
  if (!city) notFound();
  const s = cityStats(city);
  const live = s.available > 0;
  const available = city.neighborhoods.filter((b) => b.status === "available");
  const expansion = city.neighborhoods.filter((b) => b.status === "expansion");

  const cityFaqs = [
    {
      q: `A Veloz Fibra atende todo o município de ${city.name}?`,
      a: live
        ? `Hoje atendemos ${s.available} bairros em ${city.name}${s.expansion ? ` e estamos levando a rede a mais ${s.expansion}` : ""}. Use a consulta por CEP para confirmar o seu endereço.`
        : `A rede ainda está em construção em ${city.name}. Cadastre seu interesse para ser avisado quando a instalação for liberada no seu bairro.`,
    },
    {
      q: `Quanto custa a internet fibra em ${city.name}?`,
      a: `Os planos residenciais começam em ${formatPrice(startingPrice)}/mês, com as mesmas condições das demais cidades atendidas. Condições comerciais sujeitas a alteração.`,
    },
    {
      q: `Qual o prazo de instalação em ${city.name}?`,
      a: "Na contratação online você escolhe o dia e o período da visita entre as datas disponíveis para a sua região.",
    },
    {
      q: "Existe atendimento local?",
      a: `Sim. Nossa equipe técnica atende ${city.name} com técnicos próprios, e o suporte está disponível pelo WhatsApp ${company.whatsappDisplay}.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Internet fibra óptica",
    provider: { "@type": "Organization", name: company.name, url: site.url },
    areaServed: { "@type": "City", name: city.name },
    offers: { "@type": "Offer", priceCurrency: "BRL", price: startingPrice.toFixed(2), availability: live ? "https://schema.org/InStock" : "https://schema.org/PreOrder" },
  };

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Cidades atendidas", href: "/internet-fibra" },
          { label: city.name, href: `/internet-fibra/${city.slug}` },
        ]}
        title={`Internet Fibra Óptica em ${city.name}`}
        meta={
          <span className={`badge ${live ? "badge--green" : "badge--amber"}`}>
            <span className={`dot ${live ? "" : "dot--warn"}`} aria-hidden="true" />
            {live ? `Fibra disponível · ${s.available} bairros atendidos` : "Em expansão"}
          </span>
        }
        text={
          live
            ? `Conheça os planos da Veloz Fibra disponíveis em ${city.name} e consulte a cobertura no seu bairro.`
            : `${city.blurb} Cadastre seu interesse para ser avisado assim que a instalação for liberada.`
        }
        aside={
          <div className="card card--pad page-hero__card">
            <CoverageChecker initialCity={city.slug} />
          </div>
        }
      >
        <div className="btn-row btn-row--stack page-hero__ctas">
          {live && (
            <Link href={`/assine?cidade=${city.slug}`} className="btn btn--primary btn--lg">
              Contratar em {city.name} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
          <a href={whatsappLink(waMessages.plan("de internet", city.name))} target="_blank" rel="noopener noreferrer" className="btn btn--success btn--lg">
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp
          </a>
        </div>
        {live && (
          <p className="page-hero__meta">
            A partir de <strong>{formatPrice(startingPrice)}/mês</strong> em {city.name}
          </p>
        )}
      </PageHero>

      <section className="section section--tight" aria-labelledby="bairros-title">
        <div className="container">
          <div className="section-head">
            <h2 id="bairros-title" className="h-2">
              Bairros atendidos em {city.name}
            </h2>
          </div>
          {available.length > 0 && (
            <ul className="hoods">
              {available.map((b) => (
                <li key={b.id} className="hoods__item">
                  <MapPin size={16} aria-hidden="true" /> {b.name}
                </li>
              ))}
            </ul>
          )}
          {expansion.length > 0 && (
            <>
              <h3 className="h-4" style={{ margin: "32px 0 14px" }}>
                Em expansão
              </h3>
              <ul className="hoods">
                {expansion.map((b) => (
                  <li key={b.id} className="hoods__item hoods__item--soon">
                    <MapPin size={16} aria-hidden="true" /> {b.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {live && <PlansSection tabs={false} />}
      <Benefits items={benefits} title={`Por que escolher a Veloz em ${city.name}`} />
      <FAQSection items={cityFaqs} title={`Perguntas sobre ${city.name}`} />
      <FinalCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
