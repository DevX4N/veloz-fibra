import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { aboutPillars } from "@/data/content";
import { Icon } from "@/components/ui/Icon";

export function AboutTeaser() {
  return (
    <section className="section section--white section--line" aria-labelledby="about-title">
      <div className="container about-teaser">
        <div>
          <h2 id="about-title" className="h-2">
            Conectando pessoas. Aproximando histórias.
          </h2>
          <div className="stack about-teaser__text">
            <p className="lead">
              A Veloz Fibra nasceu com um objetivo simples: oferecer uma internet rápida, estável e acompanhada de um
              atendimento que realmente funciona.
            </p>
            <p>
              Investimos continuamente em infraestrutura, tecnologia e pessoas para entregar uma experiência de conexão
              que acompanhe nossos clientes todos os dias.
            </p>
          </div>
          <Link href="/sobre" className="link">
            Conheça nossa história <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="pillars">
          {aboutPillars.map((p) => (
            <li key={p.title}>
              <Icon name={p.icon} size={20} />
              <div>
                <strong>{p.title}</strong>
                <span>{p.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
