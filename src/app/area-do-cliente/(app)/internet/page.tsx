"use client";

import Link from "next/link";
import { Power, Router, Wifi, Cable, Activity, ArrowRight, Gauge } from "lucide-react";
import { useState } from "react";
import { DashHeader } from "@/components/account/DashboardShell";
import { useCustomer } from "@/components/account/CustomerProvider";
import { getPlan } from "@/data/plans";
import { formatDate } from "@/utils/format";
import { simulateLatency } from "@/services/core";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/providers/ToastProvider";

export default function InternetPage() {
  const { customer } = useCustomer();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [rebooting, setRebooting] = useState(false);
  const c = customer!;
  const plan = getPlan(c.planId)!;
  const ssid = `VELOZ_${c.name.split(" ")[0].toUpperCase()}`;

  async function reboot() {
    setConfirm(false);
    setRebooting(true);
    await simulateLatency(2200, 2800);
    setRebooting(false);
    toast("Equipamento reiniciado. A conexão volta em cerca de 2 minutos.");
  }

  return (
    <>
      <DashHeader
        title="Minha internet"
        text={`Contrato ${c.contract} · cliente desde ${formatDate(new Date(c.customerSince + "T12:00:00"))}`}
        action={<Link href="/area-do-cliente/plano" className="btn btn--primary">Alterar plano</Link>}
      />

      <div className="dash-grid dash-grid--2">
        <section className="dcard dcard--internet" aria-labelledby="i-plan">
          <div className="dcard__head">
            <h2 id="i-plan" className="dcard__title">Plano contratado</h2>
            <span className="badge badge--green"><span className="dot" aria-hidden="true" /> Online</span>
          </div>
          <p className="dcard__big">Veloz {plan.name}</p>
          <dl className="spec">
            <div><dt>Download</dt><dd className="mono">{plan.speed} Mbps</dd></div>
            <div><dt>Upload</dt><dd className="mono">{plan.upload} Mbps</dd></div>
            <div><dt>Tecnologia</dt><dd>Fibra óptica (FTTH)</dd></div>
            <div><dt>Endereço</dt><dd>{c.address.street}, {c.address.number} · {c.address.district}</dd></div>
          </dl>
        </section>

        <section className="dcard" aria-labelledby="i-conn">
          <div className="dcard__head">
            <h2 id="i-conn" className="dcard__title">Conexão agora</h2>
            <Activity size={18} className="muted" aria-hidden="true" />
          </div>
          <dl className="spec">
            <div><dt>Sinal óptico</dt><dd><span className="mono">-18,4 dBm</span> <span className="badge badge--green">Ótimo</span></dd></div>
            <div><dt>Tempo conectado</dt><dd className="mono">12 dias, 4 h</dd></div>
            <div><dt>Último teste</dt><dd className="mono">687 / 352 Mbps</dd></div>
            <div><dt>Ping médio</dt><dd className="mono">4 ms</dd></div>
          </dl>
          <div className="dcard__actions">
            <Link href="/area-do-cliente/teste-de-velocidade" className="btn btn--secondary btn--sm"><Gauge size={16} aria-hidden="true" /> Testar velocidade</Link>
          </div>
        </section>

        <section className="dcard" aria-labelledby="i-equip">
          <div className="dcard__head">
            <h2 id="i-equip" className="dcard__title">Equipamentos</h2>
            <span className="badge">Comodato</span>
          </div>
          <ul className="equip">
            <li><Router size={22} aria-hidden="true" /><span><strong>{c.equipment.router}</strong><small className="mono">S/N {c.equipment.serial}</small></span></li>
            <li><Cable size={22} aria-hidden="true" /><span><strong>{c.equipment.ont}</strong><small>Instalado em {formatDate(new Date(c.equipment.installedAt + "T12:00:00"))}</small></span></li>
          </ul>
          <div className="dcard__actions">
            <Button variant="secondary" size="sm" loading={rebooting} loadingText="Reiniciando..." iconLeft={<Power size={16} aria-hidden="true" />} onClick={() => setConfirm(true)}>
              Reiniciar remotamente
            </Button>
          </div>
        </section>

        <section className="dcard" aria-labelledby="i-wifi">
          <div className="dcard__head">
            <h2 id="i-wifi" className="dcard__title">Redes Wi-Fi</h2>
            <Wifi size={18} className="muted" aria-hidden="true" />
          </div>
          <ul className="equip">
            <li><Wifi size={22} aria-hidden="true" /><span><strong className="mono">{ssid}_5G</strong><small>5 GHz · 9 dispositivos</small></span></li>
            <li><Wifi size={22} aria-hidden="true" /><span><strong className="mono">{ssid}</strong><small>2.4 GHz · 4 dispositivos</small></span></li>
          </ul>
          <div className="dcard__actions">
            <Link href="/area-do-cliente/servicos" className="link">Trocar nome ou senha <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </section>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        title="Reiniciar equipamento?"
        description="Sua conexão ficará indisponível por cerca de 2 minutos enquanto o roteador reinicia."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>Cancelar</Button>
            <Button onClick={reboot}>Reiniciar agora</Button>
          </>
        }
      />
    </>
  );
}
