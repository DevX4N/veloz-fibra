import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { company } from "@/config/site";
import { whatsappLink, waMessages } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Veloz Fibra pelo WhatsApp, telefone ou e-mail. Veja os horários de atendimento.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: "Contato", href: "/contato" }]}
        title="Fale com a Veloz Fibra"
        text="Escolha o canal mais prático para você. Para suporte técnico, o WhatsApp é o caminho mais rápido."
      />
      <section className="section section--tight" aria-label="Canais e formulário">
        <div className="container contact">
          <ul className="contact__channels">
            <li>
              <a href={whatsappLink(waMessages.default)} target="_blank" rel="noopener noreferrer" className="contact__channel card card--hover">
                <span className="icon-tile icon-tile--green"><MessageCircle size={22} aria-hidden="true" /></span>
                <span>
                  <span className="contact__label">WhatsApp</span>
                  <strong>{company.whatsappDisplay}</strong>
                </span>
              </a>
            </li>
            <li>
              <a href={`tel:${company.phoneHref}`} className="contact__channel card card--hover">
                <span className="icon-tile"><Phone size={22} aria-hidden="true" /></span>
                <span>
                  <span className="contact__label">Telefone</span>
                  <strong>{company.phone}</strong>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="contact__channel card card--hover">
                <span className="icon-tile icon-tile--neutral"><Mail size={22} aria-hidden="true" /></span>
                <span>
                  <span className="contact__label">E-mail</span>
                  <strong>{company.email}</strong>
                </span>
              </a>
            </li>
            <li className="contact__channel contact__channel--static card">
              <span className="icon-tile icon-tile--neutral"><Clock size={22} aria-hidden="true" /></span>
              <span>
                <span className="contact__label">Atendimento</span>
                {company.hours.map((h) => (
                  <span key={h.days} className="contact__hours">
                    <strong>{h.days}</strong> {h.time}
                  </span>
                ))}
              </span>
            </li>
            <li className="contact__channel contact__channel--static card">
              <span className="icon-tile icon-tile--neutral"><MapPin size={22} aria-hidden="true" /></span>
              <span>
                <span className="contact__label">Loja e escritório</span>
                <strong>{company.address.street}</strong>
                <span className="contact__hours">{company.address.district} · {company.address.city}</span>
              </span>
            </li>
          </ul>
          <div className="card card--pad contact__form">
            <h2 className="h-3">Envie uma mensagem</h2>
            <p className="muted" style={{ margin: "6px 0 24px" }}>Respondemos em até 1 dia útil.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
