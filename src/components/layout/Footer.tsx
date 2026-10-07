"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SocialIcon, Icon } from "@/components/ui/Icon";
import { company, disclaimers } from "@/config/site";
import { footerNav } from "@/config/navigation";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useConsent } from "@/components/providers/ConsentProvider";
import { NetworkPill } from "./NetworkPill";

export function Footer() {
  const { openSettings } = useConsent();
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo tone="light" />
            <p className="site-footer__slogan">{company.slogan}</p>
            <ul className="site-footer__contacts">
              <li>
                <a href={whatsappLink(waMessages.default)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_whatsapp", { location: "footer" })}>
                  <Icon name="message" size={18} /> WhatsApp {company.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:${company.phoneHref}`}>
                  <Icon name="phone" size={18} /> {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}>
                  <Icon name="mail" size={18} /> {company.email}
                </a>
              </li>
            </ul>
            <NetworkPill />
          </div>

          <div className="site-footer__cols">
            {footerNav.map((group) => (
              <nav key={group.label} aria-label={group.label}>
                <h2 className="site-footer__title">{group.label}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="site-footer__legal">
          <p>
            {disclaimers.availability} {disclaimers.equipment} {disclaimers.commercial} {disclaimers.speed}{" "}
            {disclaimers.terms}
          </p>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 {company.name}. Todos os direitos reservados.</p>
          <p className="site-footer__company">
            {company.legalName} · CNPJ {company.cnpj} · <button type="button" onClick={openSettings}>Preferências de cookies</button>
          </p>
          <ul className="site-footer__social" aria-label="Redes sociais">
            <li>
              <a href={company.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Veloz Fibra">
                <SocialIcon name="instagram" />
              </a>
            </li>
            <li>
              <a href={company.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook da Veloz Fibra">
                <SocialIcon name="facebook" />
              </a>
            </li>
            <li>
              <a href={company.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn da Veloz Fibra">
                <SocialIcon name="linkedin" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
