import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";
import { company } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Veloz Fibra coleta, usa e protege dados pessoais, em linha com a LGPD.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      crumb="Política de Privacidade"
      href="/politica-de-privacidade"
      updated="outubro de 2026"
      intro="Esta política explica, de forma direta, quais dados tratamos, por que tratamos e quais são os seus direitos."
      sections={[
        {
          id: "lgpd",
          title: "LGPD e controlador dos dados",
          body: (
            <p>
              O tratamento de dados pessoais segue a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados). O controlador é a{" "}
              {company.legalName} (CNPJ {company.cnpj}). [Inserir nome e contato do encarregado de dados — DPO.]
            </p>
          ),
        },
        {
          id: "dados",
          title: "Dados coletados",
          body: (
            <>
              <p>Podemos tratar as seguintes categorias de dados, conforme o serviço utilizado:</p>
              <ul>
                <li>Cadastrais: nome, CPF ou CNPJ, data de nascimento, endereço de instalação.</li>
                <li>Contato: telefone, WhatsApp e e-mail.</li>
                <li>Contratuais e financeiros: plano, faturas, histórico de pagamentos.</li>
                <li>Técnicos: identificação do equipamento, registros de conexão exigidos pela regulamentação.</li>
                <li>Navegação: cookies e dados de uso do site, conforme suas preferências.</li>
              </ul>
            </>
          ),
        },
        {
          id: "finalidade",
          title: "Finalidade do tratamento",
          body: (
            <ul>
              <li>Verificar viabilidade técnica e prestar o serviço contratado.</li>
              <li>Emitir cobranças e permitir o pagamento das faturas.</li>
              <li>Prestar suporte técnico e responder solicitações.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
              <li>Enviar comunicações comerciais, quando autorizado.</li>
            </ul>
          ),
        },
        {
          id: "cookies",
          title: "Cookies",
          body: (
            <p>
              Usamos cookies essenciais para o funcionamento do site e, com o seu consentimento, cookies de analytics e
              marketing. Você pode alterar as preferências a qualquer momento pelo link “Preferências de cookies” no rodapé.
            </p>
          ),
        },
        {
          id: "compartilhamento",
          title: "Compartilhamento de informações",
          body: (
            <p>
              Dados podem ser compartilhados com fornecedores que nos ajudam a operar (por exemplo, meios de pagamento e
              plataformas de atendimento), sempre com contrato e na medida necessária, e com autoridades quando houver
              obrigação legal. [Detalhar a lista de operadores.]
            </p>
          ),
        },
        {
          id: "direitos",
          title: "Direitos do titular",
          body: (
            <p>
              Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação de
              dados tratados com consentimento e revogação do consentimento, nos termos do art. 18 da LGPD.
            </p>
          ),
        },
        {
          id: "retencao",
          title: "Retenção",
          body: <p>Os dados são mantidos pelo tempo necessário às finalidades descritas e aos prazos legais aplicáveis. [Definir prazos por categoria.]</p>,
        },
        {
          id: "seguranca",
          title: "Segurança",
          body: <p>Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados e incidentes. [Descrever controles adotados.]</p>,
        },
        {
          id: "contato",
          title: "Canais de contato",
          body: (
            <p>
              Para exercer seus direitos ou tirar dúvidas, escreva para <a href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
