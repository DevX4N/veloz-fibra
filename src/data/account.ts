/**
 * Dados da Área do Cliente: chamados, notificações, serviços e agenda de instalação.
 * Datas relativas ao dia atual para manter a demonstração coerente.
 */

import type { IconName } from "@/components/ui/Icon";

export type TicketStatus = "open" | "analysis" | "waiting" | "resolved" | "closed";

export const ticketStatusLabel: Record<TicketStatus, string> = {
  open: "Aberto",
  analysis: "Em análise",
  waiting: "Aguardando cliente",
  resolved: "Resolvido",
  closed: "Encerrado",
};

export type Ticket = {
  protocol: string;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  timeline: { at: Date; text: string }[];
};

export function buildTickets(today = new Date()): Ticket[] {
  const at = (days: number, h = 10, m = 0) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - days, h, m);
  return [
    {
      protocol: "#47915",
      subject: "Wi-Fi",
      description: "Sinal fraco no quarto dos fundos.",
      status: "resolved",
      createdAt: at(12, 9, 14),
      updatedAt: at(11, 16, 2),
      timeline: [
        { at: at(12, 9, 14), text: "Atendimento aberto pela Área do Cliente." },
        { at: at(12, 9, 40), text: "Diagnóstico remoto: canal 5 GHz congestionado." },
        { at: at(11, 16, 2), text: "Canal alterado remotamente. Cliente confirmou melhora." },
      ],
    },
    {
      protocol: "#46220",
      subject: "Financeiro",
      description: "Solicitação de alteração do vencimento para o dia 10.",
      status: "closed",
      createdAt: at(68, 14, 5),
      updatedAt: at(67, 11, 30),
      timeline: [
        { at: at(68, 14, 5), text: "Atendimento aberto pelo WhatsApp." },
        { at: at(67, 11, 30), text: "Vencimento alterado a partir da fatura seguinte." },
      ],
    },
  ];
}

export type Notification = {
  id: string;
  kind: "billing" | "upgrade" | "maintenance";
  title: string;
  text: string;
  cta: string;
  href: string;
  unread: boolean;
};

export const accountServices: { id: string; icon: IconName; title: string; text: string; href?: string }[] = [
  { id: "segunda-via", icon: "receipt", title: "Segunda via", text: "PIX, código de barras e boleto", href: "/area-do-cliente/faturas" },
  { id: "speed", icon: "gauge", title: "Teste de velocidade", text: "Meça sua conexão agora", href: "/area-do-cliente/teste-de-velocidade" },
  { id: "plano", icon: "trending", title: "Alterar plano", text: "Upgrade sem visita técnica", href: "/area-do-cliente/plano" },
  { id: "suporte", icon: "headphones", title: "Suporte técnico", text: "Abrir e acompanhar chamados", href: "/area-do-cliente/suporte" },
  { id: "dados", icon: "user", title: "Dados cadastrais", text: "E-mail, telefone e endereço", href: "/area-do-cliente/dados" },
  { id: "historico", icon: "history", title: "Histórico de faturas", text: "Últimos 6 meses", href: "/area-do-cliente/faturas#historico" },
];

/** Solicitações adicionais (página Serviços) — abrem um pedido simulado. */
export const serviceRequests: { id: string; icon: IconName; title: string; text: string }[] = [
  { id: "vencimento", icon: "calendar", title: "Alterar data de vencimento", text: "Escolha entre os dias 5, 10, 15 ou 20." },
  { id: "wifi-senha", icon: "lock", title: "Trocar nome e senha do Wi-Fi", text: "Alteração remota em poucos minutos." },
  { id: "mudanca", icon: "home", title: "Mudança de endereço", text: "Consultamos a cobertura do novo endereço." },
  { id: "ponto", icon: "router", title: "Ponto adicional / repetidor", text: "Wi-Fi em mesh para casas maiores." },
  { id: "visita", icon: "wrench", title: "Agendar visita técnica", text: "Para reparos e reposicionamento de equipamento." },
  { id: "debito", icon: "card", title: "Débito automático", text: "Cadastre sua conta para pagamento automático." },
];

/** Gera os próximos dias úteis com períodos de instalação. */
export function buildInstallSlots(today = new Date(), count = 5) {
  const out: { date: Date; periods: { id: "manha" | "tarde"; label: string; window: string; available: boolean }[] }[] = [];
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let guard = 0;
  while (out.length < count && guard++ < 20) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd === 0) continue; // domingo sem instalação
    const idx = out.length;
    out.push({
      date: new Date(d),
      periods: [
        { id: "manha", label: "Manhã", window: "08h às 12h", available: wd !== 6 ? idx !== 0 : true },
        { id: "tarde", label: "Tarde", window: "13h às 18h", available: wd !== 6 && idx !== 2 },
      ],
    });
  }
  return out;
}
