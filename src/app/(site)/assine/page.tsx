import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { ContractFlow } from "@/components/contract/ContractFlow";
import { Skeleton } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Assine agora",
  description: "Contrate a internet fibra óptica da Veloz Fibra online: confirme a cobertura, escolha o plano e agende a instalação.",
  alternates: { canonical: "/assine" },
};

export default function AssinePage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Assine agora", href: "/assine" }]}
        title="Sua nova internet em poucos passos"
        text="Confirme a cobertura, escolha o plano e agende a instalação. Leva cerca de 3 minutos."
      />
      <section className="section section--tight contract-section">
        <div className="container">
          <Suspense fallback={<div className="card card--pad"><Skeleton h={320} /></div>}>
            <ContractFlow />
          </Suspense>
        </div>
      </section>
    </>
  );
}
