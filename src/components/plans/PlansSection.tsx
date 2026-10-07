"use client";

import Link from "next/link";
import { Building2, House, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { businessPlans, residentialPlans, type PlanSegment } from "@/data/plans";
import { disclaimers } from "@/config/site";
import { PlanCard } from "./PlanCard";

const copy = {
  residencial: {
    title: "Escolha a velocidade ideal para você",
    text: "Planos para cada tipo de conexão.",
  },
  empresarial: {
    title: "Internet que acompanha o ritmo da sua empresa",
    text: "Conectividade profissional, estabilidade e suporte para manter sua empresa sempre online.",
  },
};

export function PlansSection({
  id = "planos", initial = "residencial", tabs = true, headingAs = "h2",
}: {
  id?: string;
  initial?: PlanSegment;
  tabs?: boolean;
  headingAs?: "h1" | "h2";
}) {
  const [segment, setSegment] = useState<PlanSegment>(initial);
  const list = segment === "residencial" ? residentialPlans : businessPlans;
  const H = headingAs;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const segments: PlanSegment[] = ["residencial", "empresarial"];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + segments.length) % segments.length;
    setSegment(segments[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id={id} className="section plans-section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="section-head section-head--row plans-section__head">
          <div>
            <H id={`${id}-title`} className="h-2" key={segment}>
              <span className="fade-in" style={{ display: "inline-block" }}>{copy[segment].title}</span>
            </H>
            <p className="lead">{copy[segment].text}</p>
          </div>
          {tabs && (
            <div className="plans-section__tabs">
              <div className="segmented" role="tablist" aria-label="Tipo de plano">
                {segments.map((s, i) => (
                  <button
                    key={s}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${s}`}
                    aria-selected={segment === s}
                    aria-controls={`${id}-panel`}
                    tabIndex={segment === s ? 0 : -1}
                    className="segmented__btn"
                    onClick={() => setSegment(s)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    {s === "residencial" ? <House size={17} aria-hidden="true" /> : <Building2 size={17} aria-hidden="true" />}
                    {s === "residencial" ? "Residencial" : "Empresarial"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          id={`${id}-panel`}
          role={tabs ? "tabpanel" : undefined}
          aria-labelledby={tabs ? `${id}-tab-${segment}` : undefined}
          className="plans-grid"
          key={segment}
        >
          {list.map((p, i) => (
            <div key={p.id} className="fade-in" style={{ animationDelay: `${i * 70}ms` }}>
              <PlanCard plan={p} />
            </div>
          ))}
        </div>

        {segment === "residencial" ? (
          <p className="plans-section__note">
            Consulte disponibilidade e condições para sua região. <span className="muted">{disclaimers.equipment}</span>
          </p>
        ) : (
          <div className="plans-section__business-cta">
            <p>
              <strong>Precisa de IP fixo, link dedicado ou solução personalizada?</strong>
              <span>Nosso time comercial monta a proposta com você.</span>
            </p>
            <Link href="/empresas#proposta" className="btn btn--primary">
              Falar com comercial <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
