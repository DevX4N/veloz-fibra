import Link from "next/link";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { heroHighlights } from "@/data/content";
import { startingPrice } from "@/data/plans";
import { formatPrice } from "@/utils/format";
import { disclaimers } from "@/config/site";
import { HeroPanel } from "./HeroPanel";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="h-display">
            Internet <em className="hero__em">rápida</em> para acompanhar o seu mundo.
          </h1>
          <p className="lead hero__lead">
            Navegue, trabalhe, jogue e assista sem travamentos. Internet 100% fibra óptica com velocidade, estabilidade e
            suporte quando você precisar.
          </p>
          <div className="btn-row btn-row--stack hero__ctas">
            <Link href="/cobertura" className="btn btn--primary btn--lg">
              <MapPin size={19} aria-hidden="true" /> Consultar cobertura
            </Link>
            <Link href="/planos" className="btn btn--secondary btn--lg">
              Conhecer planos <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <p className="hero__price">
            <span className="hero__price-value">
              A partir de <strong>{formatPrice(startingPrice)}</strong>/mês
            </span>
            <span className="hero__price-note">{disclaimers.availability}</span>
          </p>
          <ul className="hero__highlights">
            {heroHighlights.map((h) => (
              <li key={h}>
                <span className="hero__check" aria-hidden="true">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero__visual">
          <HeroPanel />
        </div>
      </div>
    </section>
  );
}
