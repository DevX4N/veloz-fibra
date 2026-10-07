import { company } from "@/config/site";

/** Link do WhatsApp com mensagem pré-preenchida. O número vem de config/site.ts. */
export function whatsappLink(message = `Olá! Vim pelo site da ${company.name}.`) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  default: `Olá! Vim pelo site da ${company.name} e gostaria de atendimento.`,
  sales: "Olá! Quero contratar a internet da Veloz Fibra. Pode me ajudar?",
  support: "Olá! Sou cliente Veloz Fibra e preciso de suporte técnico.",
  billing: "Olá! Sou cliente Veloz Fibra e preciso de ajuda com minha fatura.",
  business: "Olá! Quero falar com o time comercial empresarial da Veloz Fibra.",
  plan: (plan: string, city?: string) =>
    `Olá! Quero contratar o plano ${plan} da Veloz Fibra${city ? ` em ${city}` : ""}.`,
};
