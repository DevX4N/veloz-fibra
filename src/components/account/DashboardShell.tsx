"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MoreHorizontal, X, ExternalLink, MessageCircle } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { customerNav } from "@/config/navigation";
import { getPlan } from "@/data/plans";
import { initials } from "@/utils/format";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { NetworkPill } from "@/components/layout/NetworkPill";
import { CustomerProvider, useCustomer } from "./CustomerProvider";
import { NotificationBell } from "./NotificationBell";
import { LoadingLine } from "@/components/ui/EmptyState";

const mobileMain = ["/area-do-cliente/painel", "/area-do-cliente/faturas", "/area-do-cliente/suporte", "/area-do-cliente/internet"];

function UserBadge({ compact = false }: { compact?: boolean }) {
  const { customer } = useCustomer();
  const plan = getPlan(customer?.planId);
  if (!customer) return <span className="user-badge user-badge--loading" aria-hidden="true" />;
  return (
    <div className={`user-badge ${compact ? "user-badge--compact" : ""}`}>
      <span className="avatar avatar--sm" data-tone="0" aria-hidden="true">{initials(customer.name)}</span>
      <span className="user-badge__text">
        <strong>{customer.name}</strong>
        <span>
          {plan?.name} · <span className="user-badge__status"><span className="dot dot--static" aria-hidden="true" /> Ativo</span>
        </span>
      </span>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { customer, logout } = useCustomer();
  const [more, setMore] = useState(false);

  useEffect(() => setMore(false), [pathname]);

  const isActive = (href: string) => pathname === href || (href !== "/area-do-cliente/painel" && pathname.startsWith(href));

  return (
    <div className="dash">
      <a href="#dash-main" className="skip-link">Pular para o conteúdo</a>
      <aside className="dash__sidebar" aria-label="Menu da Área do Cliente">
        <div className="dash__brand">
          <Logo href="/area-do-cliente/painel" />
        </div>
        <nav className="dash__nav">
          <ul>
            {customerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="dash__link" aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.icon && <Icon name={item.icon} size={19} />}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="dash__side-foot">
          <a href={whatsappLink(waMessages.support)} target="_blank" rel="noopener noreferrer" className="dash__help">
            <MessageCircle size={18} aria-hidden="true" />
            <span><strong>Precisa de ajuda?</strong> Fale no WhatsApp</span>
          </a>
          <Link href="/" className="dash__link dash__link--muted">
            <ExternalLink size={18} aria-hidden="true" /> Voltar ao site
          </Link>
          <button type="button" className="dash__link dash__link--muted" onClick={logout}>
            <LogOut size={18} aria-hidden="true" /> Sair
          </button>
        </div>
      </aside>

      <div className="dash__main-wrap">
        <header className="dash__top">
          <div className="dash__top-brand">
            <Logo href="/area-do-cliente/painel" />
          </div>
          <NetworkPill />
          <div className="dash__top-right">
            <NotificationBell />
            <UserBadge />
          </div>
        </header>

        <main id="dash-main" className="dash__main">
          {customer ? children : (
            <div className="dash__loading">
              <LoadingLine>Carregando sua conta...</LoadingLine>
            </div>
          )}
        </main>
      </div>

      {/* navegação inferior (mobile) */}
      <nav className="tabbar" aria-label="Navegação rápida">
        {customerNav
          .filter((i) => mobileMain.includes(i.href))
          .map((item) => (
            <Link key={item.href} href={item.href} className="tabbar__item" aria-current={isActive(item.href) ? "page" : undefined}>
              {item.icon && <Icon name={item.icon} size={21} />}
              <span>{item.label === "Visão geral" ? "Início" : item.label === "Minha internet" ? "Internet" : item.label}</span>
            </Link>
          ))}
        <button type="button" className="tabbar__item" aria-expanded={more} aria-controls="dash-more" onClick={() => setMore(true)}>
          <MoreHorizontal size={21} aria-hidden="true" />
          <span>Mais</span>
        </button>
      </nav>

      <div id="dash-more" className="sheet" data-open={more} aria-hidden={!more} inert={!more}>
        <div className="sheet__scrim" onClick={() => setMore(false)} />
        <div className="sheet__panel" role="dialog" aria-modal="true" aria-label="Mais opções">
          <div className="sheet__head">
            <UserBadge compact />
            <button type="button" className="icon-btn" onClick={() => setMore(false)} aria-label="Fechar">
              <X size={20} />
            </button>
          </div>
          <ul className="sheet__list">
            {customerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="dash__link" aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.icon && <Icon name={item.icon} size={19} />}
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" className="dash__link dash__link--muted"><ExternalLink size={18} aria-hidden="true" /> Voltar ao site</Link>
            </li>
            <li>
              <button type="button" className="dash__link dash__link--muted" onClick={logout}><LogOut size={18} aria-hidden="true" /> Sair</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <CustomerProvider>
      <Shell>{children}</Shell>
    </CustomerProvider>
  );
}

export function DashHeader({ title, text, action }: { title: ReactNode; text?: ReactNode; action?: ReactNode }) {
  return (
    <div className="dash-head">
      <div>
        <h1 className="h-2">{title}</h1>
        {text && <p className="lead">{text}</p>}
      </div>
      {action}
    </div>
  );
}
