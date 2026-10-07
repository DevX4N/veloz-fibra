import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";
import { disclaimers } from "@/config/site";

export const metadata: Metadata = {
  title: "Termos de Uso e Contrato",
  description: "Termos de uso do site e estrutura do contrato de prestação de serviço da Veloz Fibra.",
  alternates: { canonical: "/termos-de-uso" },
};

export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      crumb="Termos de Uso"
      href="/termos-de-uso"
      updated="outubro de 2026"
      intro="Regras de uso deste site e a estrutura do contrato de prestação do serviço de internet."
      sections={[
        {
          id: "uso",
          title: "Uso do site",
          body: (
            <p>
              Este site oferece informações comerciais, consulta de cobertura, contratação online, segunda via e acesso à
              Área do Cliente. O uso deve respeitar a legislação e não pode comprometer a segurança da plataforma.
            </p>
          ),
        },
        {
          id: "ofertas",
          title: "Ofertas e disponibilidade",
          body: (
            <ul>
              <li>{disclaimers.availability}</li>
              <li>{disclaimers.commercial}</li>
              <li>{disclaimers.speed}</li>
              <li>{disclaimers.equipment}</li>
            </ul>
          ),
        },
        {
          id: "contrato",
          title: "Contrato de prestação de serviço",
          body: (
            <>
              <p>A contratação é formalizada por contrato que deve conter, no mínimo:</p>
              <ul>
                <li>Identificação das partes, plano contratado e endereço de instalação.</li>
                <li>Preço, forma de pagamento, vencimento e regras de reajuste.</li>
                <li>Condições de comodato dos equipamentos.</li>
                <li>Prazo de permanência, se houver, e condições de cancelamento.</li>
                <li>Canais de atendimento e prazos de reparo.</li>
              </ul>
              <p>[Anexar a minuta oficial do contrato do provedor.]</p>
            </>
          ),
        },
        {
          id: "responsabilidades",
          title: "Responsabilidades",
          body: <p>[Descrever responsabilidades do provedor e do assinante, conforme a regulamentação aplicável.]</p>,
        },
        {
          id: "alteracoes",
          title: "Alterações destes termos",
          body: <p>Estes termos podem ser atualizados. A data da última atualização fica indicada no topo da página.</p>,
        },
      ]}
    />
  );
}
