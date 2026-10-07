"use client";

import Link from "next/link";
import { MapPin, MessageCircle, Clock } from "lucide-react";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function FinalCTA({
  title = "Pronto para navegar em outra velocidade?",
  text = "Consulte agora a disponibilidade da Veloz Fibra na sua região.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="final-cta-wrap" aria-labelledby="final-cta-title">
      <div className="container">
        <div className="final-cta on-dark">
          <svg className="final-cta__fibers" viewBox="0 0 600 300" preserveAspectRatio="none" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M-20 ${60 + i * 30} C 180 ${40 + i * 34}, 380 ${140 + i * 8}, 640 ${100 + i * 22}`} pathLength={600} style={{ animationDelay: `${i * 0.45}s` }} />
            ))}
          </svg>
          <div className="final-cta__content">
            <h2 id="final-cta-title" className="h-1">
              {title}
            </h2>
            <p className="lead">{text}</p>
            <div className="btn-row btn-row--stack">
              <Link href="/cobertura" className="btn btn--light btn--lg">
                <MapPin size={19} aria-hidden="true" /> Consultar cobertura
              </Link>
              <a
                href={whatsappLink(waMessages.sales)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--success btn--lg"
                onClick={() => trackEvent("click_whatsapp", { location: "final_cta" })}
              >
                <MessageCircle size={19} aria-hidden="true" /> Falar no WhatsApp
              </a>
            </div>
            <p className="final-cta__note">
              <Clock size={15} aria-hidden="true" /> Leva menos de 1 minuto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
