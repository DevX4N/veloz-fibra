import type { Metadata } from "next";
import { MapPin, Briefcase } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CareersForm } from "@/components/contact/CareersForm";
import { openPositions } from "@/data/content";
import { company } from "@/config/site";

export const metadata: Metadata = {
  title: "Trabalhe conosco",
  description: "Vagas abertas na Veloz Fibra: técnicos de instalação, suporte e comercial.",
  alternates: { canonical: "/trabalhe-conosco" },
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Trabalhe conosco", href: "/trabalhe-conosco" }]}
        title="Construa a rede com a gente"
        text="Procuramos pessoas que gostam de resolver problemas e de atender bem. Equipe própria, treinamento e crescimento junto com a rede."
      />
      <section className="section section--tight">
        <div className="container careers">
          <div>
            <h2 className="h-3" style={{ marginBottom: 20 }}>Vagas abertas</h2>
            <ul className="positions">
              {openPositions.map((p) => (
                <li key={p.title} className="card card--pad position">
                  <h3 className="h-4">{p.title}</h3>
                  <p>
                    <span><MapPin size={15} aria-hidden="true" /> {p.place}</span>
                    <span><Briefcase size={15} aria-hidden="true" /> {p.type}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="small muted" style={{ marginTop: 16 }}>
              Não encontrou sua vaga? Envie o currículo para <a className="link" href={`mailto:${company.careersEmail}`}>{company.careersEmail}</a>.
            </p>
          </div>
          <div className="card card--pad">
            <h2 className="h-3">Candidate-se</h2>
            <p className="muted" style={{ margin: "6px 0 24px" }}>Leva menos de 1 minuto.</p>
            <CareersForm positions={openPositions.map((p) => p.title)} />
          </div>
        </div>
      </section>
    </>
  );
}
