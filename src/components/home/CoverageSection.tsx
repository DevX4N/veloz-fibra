import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoverageChecker } from "@/components/coverage/CoverageChecker";
import { coverageTotals } from "@/data/coverage";

export function CoverageSection() {
  return (
    <section id="cobertura" className="section coverage-section" aria-labelledby="coverage-title">
      <div className="container coverage-section__grid">
        <div className="coverage-section__copy">
          <h2 id="coverage-title" className="h-2">
            A Veloz Fibra já chegou até você?
          </h2>
          <p className="lead">Informe sua localização e descubra se nossa rede está disponível na sua região.</p>
          <dl className="coverage-section__kpis">
            <div>
              <dt>Bairros conectados</dt>
              <dd className="mono">+{coverageTotals.neighborhoods}</dd>
            </div>
            <div>
              <dt>Cidades atendidas</dt>
              <dd className="mono">{coverageTotals.cities}</dd>
            </div>
            <div>
              <dt>Em expansão</dt>
              <dd className="mono">{coverageTotals.expansionNeighborhoods}</dd>
            </div>
          </dl>
          <Link href="/cobertura" className="link">
            Ver mapa de cobertura <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="coverage-card card">
          <CoverageChecker />
        </div>
      </div>
    </section>
  );
}
