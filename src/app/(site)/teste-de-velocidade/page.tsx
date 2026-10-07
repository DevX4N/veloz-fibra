import type { Metadata } from "next";
import Link from "next/link";
import { Cable, Wifi, MonitorSmartphone, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SpeedTest } from "@/components/speedtest/SpeedTest";
import { FAQSection } from "@/components/shared/FAQSection";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: "Teste de velocidade",
  description: "Meça download, upload, ping e jitter da sua conexão com o teste de velocidade da Veloz Fibra.",
  alternates: { canonical: "/teste-de-velocidade" },
};

export default function SpeedTestPage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Teste de velocidade", href: "/teste-de-velocidade" }]}
        title="Teste sua conexão"
        text="Descubra agora a velocidade da sua internet."
      />
      <section className="section section--tight speedtest-section" aria-label="Medidor de velocidade">
        <div className="container container--narrow">
          <div className="card speedtest-card">
            <SpeedTest />
          </div>
        </div>
      </section>

      <section className="section section--white section--line" aria-labelledby="tips-title">
        <div className="container">
          <div className="section-head">
            <h2 id="tips-title" className="h-2">
              Para um resultado mais preciso
            </h2>
          </div>
          <ul className="tips">
            <li>
              <Cable size={22} aria-hidden="true" />
              <h3 className="h-4">Prefira o cabo</h3>
              <p>Conecte o computador ao roteador com cabo de rede para medir a velocidade real que chega na sua casa.</p>
            </li>
            <li>
              <MonitorSmartphone size={22} aria-hidden="true" />
              <h3 className="h-4">Pause outros dispositivos</h3>
              <p>Downloads, atualizações e streaming em outros aparelhos dividem a banda durante o teste.</p>
            </li>
            <li>
              <Wifi size={22} aria-hidden="true" />
              <h3 className="h-4">No Wi-Fi, use 5 GHz</h3>
              <p>Fique perto do roteador e conecte-se à rede 5 GHz, que é mais rápida e sofre menos interferência.</p>
            </li>
          </ul>
          <p className="tips__cta">
            Resultado abaixo do esperado? <Link href="/suporte" className="link">Veja o diagnóstico rápido <ArrowRight size={16} aria-hidden="true" /></Link>
          </p>
        </div>
      </section>

      <FAQSection items={faqs.speedtest} title="Dúvidas sobre velocidade" />
    </>
  );
}
