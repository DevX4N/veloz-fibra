import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { InvoiceLookup } from "@/components/billing/InvoiceLookup";
import { FAQSection } from "@/components/shared/FAQSection";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: "Segunda via de fatura",
  description: "Emita a segunda via da sua fatura Veloz Fibra com PIX, código de barras ou boleto. Consulte também o histórico de pagamentos.",
  alternates: { canonical: "/segunda-via" },
};

export default function SegundaViaPage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Segunda via", href: "/segunda-via" }]}
        title="Segunda via de fatura"
        text="Informe o CPF ou CNPJ do titular para ver a fatura em aberto, copiar o código PIX ou baixar o boleto."
      />
      <section className="section section--tight" aria-label="Consulta de faturas">
        <div className="container container--narrow">
          <InvoiceLookup />
        </div>
      </section>
      <FAQSection items={faqs.billing} white title="Dúvidas sobre pagamento" />
    </>
  );
}
