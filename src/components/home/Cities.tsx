import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cities, cityStats, coverageTotals } from "@/data/coverage";

/** Diretório da rede: uma linha por cidade, com a proporção de bairros já ligados. */
export function Cities({ title = "Onde estamos", headingAs = "h2" }: { title?: string; headingAs?: "h1" | "h2" }) {
  const H = headingAs;
  return (
    <section id="cidades" className="section" aria-labelledby="cities-title">
      <div className="container">
        <div className="section-head section-head--row">
          <div>
            <H id="cities-title" className="h-2">
              {title}
            </H>
            <p className="lead">
              Fibra própria em {coverageTotals.cities} cidades da região
              {coverageTotals.expansionCities > 0 && ` e obras em mais ${coverageTotals.expansionCities}`}, bairro a bairro.
            </p>
          </div>
          <Link href="/cobertura" className="link">
            Consultar meu endereço <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <ul className="cities">
          {cities.map((c) => {
            const s = cityStats(c);
            const live = s.available > 0;
            const total = s.available + s.expansion;
            return (
              <li key={c.slug}>
                <Link href={live ? `/internet-fibra/${c.slug}` : "/cobertura"} className={`city ${live ? "" : "city--soon"}`}>
                  <h3 className="city__name">{c.name}</h3>
                  <span className={`city__status ${live ? "" : "city__status--soon"}`}>
                    <span className={`dot dot--static ${live ? "" : "dot--warn"}`} aria-hidden="true" />
                    {live ? "Fibra disponível" : "Em expansão"}
                  </span>
                  <span className="city__count">
                    {live ? (
                      <>
                        <strong className="mono">{s.available}</strong> bairros conectados
                        {s.expansion > 0 && <span className="muted"> · {s.expansion} em obras</span>}
                      </>
                    ) : (
                      <>
                        <strong className="mono">{s.expansion}</strong> bairros em obras
                      </>
                    )}
                  </span>
                  <span className="city__meter" aria-hidden="true">
                    <span style={{ transform: `scaleX(${total ? s.available / total : 0})` }} />
                  </span>
                  <span className="city__cta">
                    {live ? "Ver planos na cidade" : "Avise-me quando chegar"} <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
