"use client";

import Link from "next/link";
import { Bell, Receipt, Rocket, Wrench, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCustomer } from "./CustomerProvider";
import { EmptyState } from "@/components/ui/EmptyState";

const kindIcon = {
  billing: <Receipt size={18} aria-hidden="true" />,
  upgrade: <Rocket size={18} aria-hidden="true" />,
  maintenance: <Wrench size={18} aria-hidden="true" />,
};

export function NotificationBell() {
  const { notifications, markAllRead } = useCustomer();
  const [open, setOpen] = useState(false);
  const [cleared, setCleared] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => n.unread).length;
  const list = cleared ? [] : notifications;

  useEffect(() => {
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="bell" ref={ref}>
      <button
        type="button"
        className="icon-btn bell__btn"
        aria-label={unread ? `Notificações, ${unread} não lidas` : "Notificações"}
        aria-expanded={open}
        aria-controls="bell-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell size={20} />
        {unread > 0 && !cleared && <span className="bell__count" aria-hidden="true">{unread}</span>}
      </button>
      {open && (
        <div id="bell-panel" className="bell__panel" role="region" aria-label="Notificações recentes">
          <div className="bell__head">
            <strong>Notificações</strong>
            {list.length > 0 && (
              <button type="button" className="text-btn" onClick={() => { markAllRead(); }}>
                <CheckCheck size={15} aria-hidden="true" /> Marcar como lidas
              </button>
            )}
          </div>
          {list.length === 0 ? (
            <EmptyState icon="bell" title="Tudo tranquilo por aqui" text="Você não possui novas notificações." />
          ) : (
            <ul className="bell__list">
              {list.map((n) => (
                <li key={n.id} className={`notif notif--${n.kind} ${n.unread ? "is-unread" : ""}`}>
                  <span className="notif__icon">{kindIcon[n.kind]}</span>
                  <div className="notif__body">
                    <strong>{n.title}</strong>
                    <p>{n.text}</p>
                    <Link href={n.href} className="link" onClick={() => setOpen(false)}>
                      {n.cta}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {list.length > 0 && (
            <button type="button" className="bell__clear" onClick={() => setCleared(true)}>
              Limpar notificações
            </button>
          )}
        </div>
      )}
    </div>
  );
}
