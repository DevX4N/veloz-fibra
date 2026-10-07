import Link from "next/link";
import type { FAQ } from "@/data/content";
import { Accordion } from "@/components/ui/Accordion";

/** FAQ com dados estruturados (FAQPage) para SEO. */
export function FAQSection({
  id = "faq", title = "Dúvidas frequentes", items, white = false, aside = true,
}: {
  id?: string;
  title?: string;
  items: FAQ[];
  white?: boolean;
  aside?: boolean;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section id={id} className={`section ${white ? "section--white section--line" : ""}`} aria-labelledby={`${id}-title`}>
      <div className={`container faq ${aside ? "" : "faq--single"}`}>
        <div className="faq__head">
          <h2 id={`${id}-title`} className="h-2">
            {title}
          </h2>
          {aside && (
            <p className="lead">
              Não encontrou o que procurava? Visite a <Link href="/suporte">Central de ajuda</Link> ou fale com nosso time.
            </p>
          )}
        </div>
        <Accordion items={items.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
