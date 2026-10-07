/**
 * Configuração central da marca.
 *
 * Para adaptar a plataforma a um provedor real, comece por aqui:
 * nome, contatos, horários, redes sociais e integrações de analytics.
 * Nenhum componente deve ter esses valores escritos diretamente.
 */

export const company = {
  name: "Veloz Fibra",
  shortName: "Veloz",
  legalName: "Veloz Fibra Telecomunicações Ltda.",
  cnpj: "00.000.000/0001-00",
  slogan: "Internet para conectar tudo que importa.",
  foundedYear: 2014,

  // ▼▼▼ SUBSTITUA PELO WHATSAPP REAL — apenas dígitos: DDI (55) + DDD + número ▼▼▼
  whatsapp: "5500000000000",
  whatsappDisplay: "(00) 00000-0000",
  // ▲▲▲ ------------------------------------------------------------------- ▲▲▲

  phone: "(00) 0000-0000",
  phoneHref: "+550000000000",
  email: "contato@velozfibra.com.br",
  commercialEmail: "empresas@velozfibra.com.br",
  privacyEmail: "privacidade@velozfibra.com.br",
  careersEmail: "talentos@velozfibra.com.br",
  address: {
    street: "Av. das Nações, 1200",
    district: "Centro",
    city: "Santa Aurora",
  },
  hours: [
    { days: "Segunda a sexta", time: "08:00 às 18:00" },
    { days: "Sábado", time: "08:00 às 12:00" },
  ],
  supportNote: "Monitoramento da rede 24 horas, todos os dias.",
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
  },
} as const;

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3016",
  indexable: process.env.SITE_INDEXABLE === "true",
  title: "Veloz Fibra | Internet Fibra Óptica de Alta Velocidade",
  description:
    "Internet fibra óptica rápida e estável para sua casa ou empresa. Conheça os planos da Veloz Fibra e consulte a cobertura na sua região.",
  locale: "pt_BR",
};

/**
 * Integrações de marketing. Todas desligadas por padrão (null).
 * Os scripts só carregam com ID preenchido E consentimento do visitante.
 */
export const analytics = {
  googleAnalyticsId: null as string | null, // ex.: "G-XXXXXXXXXX"
  googleTagManagerId: null as string | null, // ex.: "GTM-XXXXXXX"
  metaPixelId: null as string | null, // ex.: "000000000000000"
  googleAdsId: null as string | null, // ex.: "AW-000000000"
};

/** Avisos comerciais exibidos discretamente pela interface. */
export const disclaimers = {
  availability: "Planos sujeitos à disponibilidade técnica.",
  region: "Consulte disponibilidade na sua região.",
  equipment: "Equipamentos fornecidos em comodato.",
  commercial: "Condições comerciais sujeitas a alteração.",
  speed:
    "Velocidades podem variar conforme condições técnicas, equipamentos e tecnologia utilizada.",
  terms: "Consulte os termos completos do serviço.",
  demo: "Projeto demonstrativo — dados e consultas simulados.",
};
