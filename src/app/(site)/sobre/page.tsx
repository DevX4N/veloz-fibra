import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/shared/FinalCTA";
import { Icon } from "@/components/ui/Icon";
import { aboutPillars, milestones } from "@/data/content";
import { company } from "@/config/site";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: "Conheça a história da Veloz Fibra: provedor regional de internet 100% fibra óptica com atendimento próximo e infraestrutura moderna.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Sobre nós", href: "/sobre" }]}
        title="Conectando pessoas. Aproximando histórias."
        text={`Desde ${company.foundedYear}, a Veloz Fibra tem um objetivo simples: oferecer uma internet rápida, estável e acompanhada de um atendimento que realmente funciona.`}
      />

      <section className="section section--tight" aria-labelledby="about-story">
        <div className="container about-story">
          <div>
            <h2 id="about-story" className="h-2">
              Uma rede construída bairro a bairro
            </h2>
            <div className="stack about-story__text">
              <p className="lead">
                Investimos continuamente em infraestrutura, tecnologia e pessoas para entregar uma experiência de conexão
                que acompanhe nossos clientes todos os dias.
              </p>
              <p>
                Começamos com poucos clientes no Centro de Santa Aurora e crescemos ouvindo a cidade. Cada nova rua é
                planejada pela nossa engenharia, construída por equipe própria e monitorada 24 horas pelo nosso núcleo de
                operações.
              </p>
              <p>
                Acreditamos que internet boa é aquela que você esquece que existe — porque simplesmente funciona. E,
                quando precisar de ajuda, do outro lado vai ter alguém que conhece a sua região.
              </p>
            </div>
          </div>
          <ol className="milestones" aria-label="Nossa trajetória">
            {milestones.map((m) => (
              <li key={m.year}>
                <span className="milestones__year mono">{m.year}</span>
                <p>{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Stats />

      <section className="section" aria-labelledby="values-title">
        <div className="container">
          <div className="section-head">
            <h2 id="values-title" className="h-2">
              Tecnologia com gente por trás
            </h2>
          </div>
          <ul className="benefits benefits--3">
            {aboutPillars.map((p) => (
              <li key={p.title} className="benefit">
                <span className="icon-tile icon-tile--lg">
                  <Icon name={p.icon} size={24} />
                </span>
                <h3 className="h-4">{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
          <div className="btn-row" style={{ marginTop: 40 }}>
            <Link href="/trabalhe-conosco" className="link">
              Trabalhe conosco <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <FinalCTA />
    </>
  );
}
