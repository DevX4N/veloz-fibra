"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

/**
 * Botão flutuante de WhatsApp.
 * O número é configurado em src/config/site.ts → company.whatsapp
 */
export function WhatsAppButton() {
  return (
    <a
      className="wa-float tip"
      href={whatsappLink(waMessages.default)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a gente pelo WhatsApp"
      onClick={() => trackEvent("click_whatsapp", { location: "floating" })}
    >
      <MessageCircle size={26} strokeWidth={2} aria-hidden="true" />
      <span className="tip__bubble" aria-hidden="true">
        Fale com a gente
      </span>
    </a>
  );
}
