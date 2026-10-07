import { howItWorks } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

/** Linha do tempo real (sequência importa): o "cabo" liga as etapas com um pulso de luz. */
export function HowItWorks() {
  return (
    <section className="section section--white section--line" aria-labelledby="how-title">
      <div className="container">
        <div className="section-head">
          <h2 id="how-title" className="h-2">
            Sua nova internet em poucos passos
          </h2>
        </div>
        <div className="timeline-wrap">
          <span className="timeline__cable" aria-hidden="true">
            <span className="timeline__pulse" />
          </span>
          <ol className="timeline">
          {howItWorks.map((s, i) => (
            <Reveal as="li" key={s.title} className="timeline__step" delay={i * 90}>
              <span className="timeline__num mono" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="h-4">
                <span className="sr-only">Passo {i + 1}: </span>
                {s.title}
              </h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
