"use client";

import Link from "next/link";
import { Check, ArrowRight, ArrowDown, ArrowUp } from "lucide-react";
import type { Plan } from "@/data/plans";
import { splitPrice } from "@/utils/format";
import { trackEvent } from "@/lib/analytics";

/** maior velocidade do catálogo: referência da barra de comparação */
const MAX_SPEED = 1000;

function speedParts(plan: Plan) {
  return plan.speed >= 1000 ? { n: String(plan.speed / 1000), unit: "Giga" } : { n: String(plan.speed), unit: "Mega" };
}

export function PlanCard({ plan, ctaHref, headingLevel = 3 }: { plan: Plan; ctaHref?: string; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const { n, unit } = speedParts(plan);
  const business = plan.segment === "empresarial";
  const href = ctaHref ?? (business ? `/empresas?plano=${plan.id}#proposta` : `/assine?plano=${plan.id}`);
  // nos residenciais o nome do plano É a velocidade ("700 Mega"): ela vira o título
  const namedBySpeed = plan.name === plan.speedLabel;
  // a velocidade já aparece em destaque; não repetir "700 Mbps" na lista
  const benefits = plan.benefits.filter((b) => !/\d\s*(Mbps|Gbps)/i.test(b));

  const speed = (
    <>
      <span className="plan__speed-n">{n}</span>
      <span className="plan__speed-u">{unit}</span>
    </>
  );

  return (
    <article className={`plan ${plan.featured ? "plan--featured" : ""}`} aria-labelledby={`plan-${plan.id}`}>
      <header className="plan__head">
        {plan.badge && <span className="plan__badge">{plan.badge}</span>}
        {!namedBySpeed && (
          <H id={`plan-${plan.id}`} className="plan__name">
            {plan.name}
          </H>
        )}
        {namedBySpeed ? (
          <H id={`plan-${plan.id}`} className="plan__speed">
            {speed}
          </H>
        ) : (
          <p className="plan__speed">{speed}</p>
        )}
        <div className="plan__meter" aria-hidden="true">
          <span style={{ transform: `scaleX(${plan.speed / MAX_SPEED})` }} />
        </div>
        <p className="plan__updown">
          <span>
            <ArrowDown size={14} aria-hidden="true" /> <strong className="mono">{plan.speed}</strong> Mbps download
          </span>
          <span>
            <ArrowUp size={14} aria-hidden="true" /> <strong className="mono">{plan.upload}</strong> Mbps upload
          </span>
        </p>
      </header>

      <div className="plan__price">
        {plan.price !== null ? (
          <>
            <span className="plan__currency">R$</span>
            <span className="plan__int">{splitPrice(plan.price).int}</span>
            <span className="plan__dec">,{splitPrice(plan.price).dec}</span>
            <span className="plan__per">/mês</span>
          </>
        ) : (
          <span className="plan__quote">
            {plan.devices} dispositivos
            <small>Preço sob consulta, conforme endereço e necessidade</small>
          </span>
        )}
      </div>

      <ul className="check-list plan__benefits">
        {benefits.map((b) => (
          <li key={b}>
            <Check size={17} strokeWidth={2.4} aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>

      <p className="plan__ideal">
        <span>{business ? "Indicado para" : "Ideal para"}</span> {plan.idealFor.join(" · ")}
      </p>

      <Link
        href={href}
        className={`btn btn--lg btn--block ${plan.featured ? "btn--primary" : "btn--secondary"} plan__cta`}
        onClick={() =>
          trackEvent(business ? "business_lead" : "plan_selected", {
            plan: plan.name,
            price: plan.price ?? undefined,
            stage: business ? "card_click" : undefined,
          })
        }
      >
        {plan.cta}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}
