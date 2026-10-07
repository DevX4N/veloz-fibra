import { Star } from "lucide-react";
import { testimonials } from "@/data/content";
import { initials } from "@/utils/format";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  return (
    <section className="section" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="section-head">
          <h2 id="testimonials-title" className="h-2">
            Quem usa, recomenda
          </h2>
        </div>
        <ul className="testimonials">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={t.name} delay={i * 80}>
              <figure className="testimonial">
                <div className="testimonial__stars" aria-label={`Avaliação ${t.rating} de 5`}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ))}
                </div>
                <blockquote>
                  <p>“{t.text}”</p>
                </blockquote>
                <figcaption>
                  <span className="avatar" aria-hidden="true" data-tone={i}>
                    {initials(t.name)}
                  </span>
                  <span>
                    <strong>{t.name}</strong>
                    <span>
                      {t.role} · {t.city}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
        <p className="disclaimer testimonials__note">
          Depoimentos fictícios, criados para apresentação.
        </p>
      </div>
    </section>
  );
}
