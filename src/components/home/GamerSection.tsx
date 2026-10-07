import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gamerIndicators } from "@/data/content";
import { Icon } from "@/components/ui/Icon";
import { PingMeter } from "./PingMeter";

export function GamerSection() {
  return (
    <section className="gamer on-dark" aria-labelledby="gamer-title">
      <div className="gamer__glow" aria-hidden="true" />
      <div className="container gamer__grid">
        <div>
          <h2 id="gamer-title" className="h-2 gamer__title">
            Menos lag. Mais vitória.
          </h2>
          <p className="lead gamer__lead">Uma conexão preparada para quem leva cada milissegundo a sério.</p>
          <ul className="gamer__list">
            {gamerIndicators.map((g) => (
              <li key={g.label}>
                <span className="icon-tile icon-tile--dark">
                  <Icon name={g.icon} size={20} />
                </span>
                <div>
                  <strong>{g.label}</strong>
                  <span>{g.detail}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/planos" className="btn btn--light btn--lg">
            Conhecer planos <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <PingMeter />
      </div>
    </section>
  );
}
