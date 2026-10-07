import type { IconName } from "@/components/ui/Icon";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: IconName;
  external?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const mainNav: NavGroup[] = [
  {
    label: "Para sua casa",
    items: [
      { label: "Planos", href: "/planos", description: "De 500 Mega a 1 Giga", icon: "wifi" },
      { label: "Benefícios", href: "/planos#beneficios", description: "Wi-Fi 6, suporte e instalação", icon: "sparkles" },
      { label: "Cobertura", href: "/cobertura", description: "Consulte seu endereço", icon: "map-pin" },
      { label: "Teste de velocidade", href: "/teste-de-velocidade", description: "Meça sua conexão agora", icon: "gauge" },
    ],
  },
  {
    label: "Para sua empresa",
    items: [
      { label: "Internet empresarial", href: "/empresas", description: "Planos para negócios", icon: "building" },
      { label: "Link dedicado", href: "/empresas#link-dedicado", description: "Banda garantida e SLA", icon: "network" },
      { label: "IP fixo", href: "/empresas#ip-fixo", description: "Servidores, câmeras e VPN", icon: "server" },
      { label: "Solicitar proposta", href: "/empresas#proposta", description: "Resposta em até 1 dia útil", icon: "file-text" },
    ],
  },
  {
    label: "Atendimento",
    items: [
      { label: "Central de ajuda", href: "/suporte", description: "Respostas e diagnóstico", icon: "life-buoy" },
      { label: "Segunda via", href: "/segunda-via", description: "PIX, boleto e histórico", icon: "receipt" },
      { label: "Status da rede", href: "/status", description: "Serviços e manutenções", icon: "activity" },
      { label: "WhatsApp", href: "whatsapp", description: "Fale com a equipe", icon: "message", external: true },
    ],
  },
  {
    label: "Institucional",
    items: [
      { label: "Sobre nós", href: "/sobre", description: "Nossa história", icon: "info" },
      { label: "Cidades atendidas", href: "/internet-fibra", description: "Onde a fibra já chegou", icon: "map" },
      { label: "Contato", href: "/contato", description: "Canais e horários", icon: "phone" },
    ],
  },
];

export const footerNav: NavGroup[] = [
  {
    label: "Para sua casa",
    items: [
      { label: "Planos", href: "/planos" },
      { label: "Cobertura", href: "/cobertura" },
      { label: "Teste de velocidade", href: "/teste-de-velocidade" },
    ],
  },
  {
    label: "Para sua empresa",
    items: [
      { label: "Internet empresarial", href: "/empresas" },
      { label: "Link dedicado", href: "/empresas#link-dedicado" },
      { label: "IP fixo", href: "/empresas#ip-fixo" },
    ],
  },
  {
    label: "Atendimento",
    items: [
      { label: "Segunda via", href: "/segunda-via" },
      { label: "Suporte", href: "/suporte" },
      { label: "Status da rede", href: "/status" },
      { label: "Área do cliente", href: "/area-do-cliente" },
    ],
  },
  {
    label: "Institucional",
    items: [
      { label: "Sobre nós", href: "/sobre" },
      { label: "Cidades atendidas", href: "/internet-fibra" },
      { label: "Trabalhe conosco", href: "/trabalhe-conosco" },
      { label: "Contato", href: "/contato" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Política de Privacidade", href: "/politica-de-privacidade" },
      { label: "Termos de Uso", href: "/termos-de-uso" },
      { label: "Contrato", href: "/termos-de-uso#contrato" },
      { label: "LGPD", href: "/politica-de-privacidade#lgpd" },
    ],
  },
];

export const customerNav: NavItem[] = [
  { label: "Visão geral", href: "/area-do-cliente/painel", icon: "layout" },
  { label: "Minha internet", href: "/area-do-cliente/internet", icon: "wifi" },
  { label: "Faturas", href: "/area-do-cliente/faturas", icon: "receipt" },
  { label: "Serviços", href: "/area-do-cliente/servicos", icon: "grid" },
  { label: "Teste de velocidade", href: "/area-do-cliente/teste-de-velocidade", icon: "gauge" },
  { label: "Suporte", href: "/area-do-cliente/suporte", icon: "headphones" },
  { label: "Dados cadastrais", href: "/area-do-cliente/dados", icon: "user" },
];
