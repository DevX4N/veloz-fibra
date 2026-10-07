import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { PageHero } from "./PageHero";

export type LegalSection = { id: string; title: string; body: ReactNode };

export function LegalPage({
  title, intro, crumb, href, updated, sections,
}: {
  title: string;
  intro: string;
  crumb: string;
  href: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero crumbs={[{ label: crumb, href }]} title={title} text={intro} />
      <section className="section section--tight">
        <div className="container legal">
          <nav className="legal__toc" aria-label="Nesta página">
            <p className="legal__toc-title">Nesta página</p>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="legal__body">
            <div className="form-alert form-alert--warn" role="note">
              <TriangleAlert size={18} aria-hidden="true" />
              <div>
                <strong>Este conteúdo é demonstrativo</strong> e deve ser revisado por profissional jurídico antes da
                utilização em produção.
              </div>
            </div>
            <p className="legal__updated">Última atualização: {updated}</p>
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="legal__section">
                <h2 className="h-3">
                  <span className="mono legal__num">{String(i + 1).padStart(2, "0")}</span> {s.title}
                </h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
