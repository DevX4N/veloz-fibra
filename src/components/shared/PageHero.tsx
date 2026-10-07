import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/config/site";

export type Crumb = { label: string; href?: string };

/** Cabeçalho padrão das páginas internas, com breadcrumb + JSON-LD. */
export function PageHero({
  title, text, meta, crumbs, children, aside, tone = "light", center = false, compact = false,
}: {
  title: ReactNode;
  text?: ReactNode;
  /** linha de status abaixo do texto (ex.: cobertura da cidade) */
  meta?: ReactNode;
  /** versão baixa para páginas-ferramenta: a ferramenta precisa aparecer na primeira dobra */
  compact?: boolean;
  crumbs: Crumb[];
  children?: ReactNode;
  aside?: ReactNode;
  tone?: "light" | "dark";
  center?: boolean;
}) {
  const all = [{ label: "Início", href: "/" }, ...crumbs];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${site.url}${c.href}` } : {}),
    })),
  };
  return (
    <section className={`page-hero page-hero--${tone} ${tone === "dark" ? "on-dark" : ""} ${center ? "page-hero--center" : ""} ${compact ? "page-hero--compact" : ""}`}>
      <div className="page-hero__bg" aria-hidden="true">
        {!aside && (
          <svg className="page-hero__fibers" viewBox="0 0 640 300" aria-hidden="true" focusable="false">
            <path className="f1" d="M0 60C260 60 360 150 600 150" />
            <path className="f2" d="M0 150H600" />
            <path className="f3" d="M0 240C260 240 360 150 600 150" />
            <path className="pulse" pathLength="600" d="M0 60C260 60 360 150 600 150" />
            <path className="pulse pulse--2" pathLength="600" d="M0 240C260 240 360 150 600 150" />
            <circle cx="606" cy="150" r="5" />
          </svg>
        )}
      </div>
      <div className={`container ${aside ? "page-hero__grid" : ""}`}>
        <div className="page-hero__copy">
          <nav aria-label="Você está em" className="crumbs">
            <ol>
              {all.map((c, i) => (
                <li key={c.label}>
                  {c.href && i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                  {i < all.length - 1 && <ChevronRight size={14} aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="h-1">{title}</h1>
          {text && <p className="lead page-hero__lead">{text}</p>}
          {meta && <div className="page-hero__status">{meta}</div>}
          {children}
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
