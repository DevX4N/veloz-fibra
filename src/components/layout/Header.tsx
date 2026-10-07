"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, UserRound, X, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { mainNav, type NavItem } from "@/config/navigation";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { NetworkPill } from "./NetworkPill";
import { startingPrice } from "@/data/plans";
import { formatPrice } from "@/utils/format";

const DARK_HERO_ROUTES = ["/empresas"];

function NavLink({ item, onNavigate, className }: { item: NavItem; onNavigate?: () => void; className: string }) {
  const content = (
    <>
      {item.icon && (
        <span className="icon-tile icon-tile--sm icon-tile--neutral">
          <Icon name={item.icon} size={18} />
        </span>
      )}
      <span className="nav-link__text">
        <span className="nav-link__label">
          {item.label}
          {item.external && <ArrowUpRight size={14} aria-hidden="true" />}
        </span>
        {item.description && <span className="nav-link__desc">{item.description}</span>}
      </span>
    </>
  );
  if (item.href === "whatsapp")
    return (
      <a
        className={className}
        href={whatsappLink(waMessages.default)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent("click_whatsapp", { location: "header_menu" });
          onNavigate?.();
        }}
      >
        {content}
      </a>
    );
  return (
    <Link className={className} href={item.href} onClick={onNavigate}>
      {content}
    </Link>
  );
}

export function Header({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fecha menus ao navegar
  useEffect(() => {
    setOpenGroup(null);
    setDrawer(false);
  }, [pathname]);

  // clique fora / Esc
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenGroup(null);
        if (drawer) {
          setDrawer(false);
          burgerRef.current?.focus();
        }
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", drawer);
    if (drawer) drawerRef.current?.querySelector<HTMLElement>("button, a")?.focus();
  }, [drawer]);

  const enter = useCallback((i: number) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenGroup(i), 60);
  }, []);
  const leave = useCallback(() => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenGroup(null), 160);
  }, []);

  const solid = scrolled || !overlay || drawer;
  // páginas com hero escuro: header claro sobre o fundo até rolar
  const onDark = !solid && DARK_HERO_ROUTES.includes(pathname);

  return (
    <>
    <header className={`site-header ${solid ? "is-solid" : ""} ${scrolled ? "is-scrolled" : ""} ${onDark ? "is-on-dark" : ""}`}>
      <div className="container site-header__inner">
        <Logo tone={onDark ? "light" : "dark"} />

        <nav ref={navRef} className="main-nav" aria-label="Principal">
          <ul className="main-nav__list">
            {mainNav.map((group, i) => (
              <li key={group.label} className="main-nav__item" onMouseEnter={() => enter(i)} onMouseLeave={leave}>
                <button
                  type="button"
                  className="main-nav__trigger"
                  aria-expanded={openGroup === i}
                  aria-controls={`menu-${i}`}
                  onClick={() => setOpenGroup(openGroup === i ? null : i)}
                >
                  {group.label}
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                <div id={`menu-${i}`} className="dropdown" data-open={openGroup === i} hidden={openGroup !== i}>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <NavLink item={item} className="nav-link" onNavigate={() => setOpenGroup(null)} />
                      </li>
                    ))}
                  </ul>
                  {i === 0 && (
                    <Link href="/planos" className="dropdown__foot" onClick={() => setOpenGroup(null)}>
                      <span>Planos a partir de <strong>{formatPrice(startingPrice)}/mês</strong></span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <NetworkPill />
          <NetworkPill compact />
          <Link href="/area-do-cliente" className="btn btn--ghost btn--sm header-account">
            <UserRound size={18} aria-hidden="true" />
            <span>Área do Cliente</span>
          </Link>
          <Link href="/assine" className="btn btn--primary btn--sm header-cta" onClick={() => trackEvent("click_signup", { location: "header" })}>
            Assine agora
          </Link>
          <button
            ref={burgerRef}
            type="button"
            className="icon-btn burger"
            aria-label={drawer ? "Fechar menu" : "Abrir menu"}
            aria-expanded={drawer}
            aria-controls="mobile-drawer"
            onClick={() => setDrawer((d) => !d)}
          >
            {drawer ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>

      {/* menu mobile — fora do <header>: o backdrop-filter dele prenderia o position:fixed */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className="drawer"
        data-open={drawer}
        aria-hidden={!drawer}
        inert={!drawer}
      >
        <div className="drawer__inner">
          <NetworkPill />
          <nav aria-label="Menu mobile" className="drawer__nav">
            {mainNav.map((group, i) => (
              <div key={group.label} className="drawer__group">
                <button
                  type="button"
                  className="drawer__trigger"
                  aria-expanded={drawerGroup === i}
                  onClick={() => setDrawerGroup(drawerGroup === i ? null : i)}
                >
                  {group.label}
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
                <div className="accordion__panel" data-open={drawerGroup === i}>
                  <div>
                    <ul className="drawer__links">
                      {group.items.map((item) => (
                        <li key={item.label}>
                          <NavLink item={item} className="nav-link nav-link--drawer" onNavigate={() => setDrawer(false)} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </nav>
          <div className="drawer__actions">
            <Link href="/assine" className="btn btn--primary btn--lg btn--block" onClick={() => trackEvent("click_signup", { location: "drawer" })}>
              Assine agora
            </Link>
            <Link href="/area-do-cliente" className="btn btn--secondary btn--lg btn--block">
              <UserRound size={18} aria-hidden="true" /> Área do Cliente
            </Link>
            <p className="drawer__note">Planos a partir de {formatPrice(startingPrice)}/mês</p>
          </div>
        </div>
      </div>
      <div className="drawer-scrim" data-open={drawer} onClick={() => setDrawer(false)} aria-hidden="true" />
    </>
  );
}
