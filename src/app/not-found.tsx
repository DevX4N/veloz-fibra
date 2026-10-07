import Link from "next/link";
import { ArrowLeft, Headphones } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <SiteShell>
      <section className="page-hero notfound">
        <div className="page-hero__bg" aria-hidden="true" />
        <div className="container notfound__inner">
          <svg className="notfound__art" viewBox="0 0 420 140" aria-hidden="true">
            <defs>
              <linearGradient id="nf-fiber" x1="0" x2="1">
                <stop offset="0" stopColor="#2563EB" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <path d="M10 70 C 70 70, 110 40, 170 62" className="notfound__cable" />
            <path d="M10 70 C 70 70, 110 40, 170 62" className="notfound__pulse" pathLength={600} />
            <path d="M250 78 C 310 100, 350 70, 410 70" className="notfound__cable notfound__cable--dead" />
            <circle cx="172" cy="62" r="5" fill="#06B6D4" className="notfound__spark" />
            <circle cx="248" cy="78" r="5" fill="#CBD5E1" />
            <g className="notfound__bits" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round">
              <line x1="186" y1="52" x2="194" y2="46" />
              <line x1="188" y1="66" x2="198" y2="68" />
              <line x1="184" y1="78" x2="190" y2="86" />
            </g>
          </svg>
          <p className="notfound__code">Erro 404</p>
          <h1 className="h-1">Parece que esse sinal se perdeu.</h1>
          <p className="lead">A página que você está procurando não existe, foi movida ou está temporariamente indisponível.</p>
          <div className="btn-row btn-row--stack" style={{ justifyContent: "center", marginTop: 32 }}>
            <Link href="/" className="btn btn--primary btn--lg">
              <ArrowLeft size={18} aria-hidden="true" /> Voltar para o início
            </Link>
            <Link href="/suporte" className="btn btn--secondary btn--lg">
              <Headphones size={18} aria-hidden="true" /> Falar com suporte
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
