"use client";

import { DashHeader } from "@/components/account/DashboardShell";
import { SpeedTest } from "@/components/speedtest/SpeedTest";
import { useCustomer } from "@/components/account/CustomerProvider";
import { getPlan } from "@/data/plans";

export default function DashSpeedTestPage() {
  const { customer } = useCustomer();
  const plan = getPlan(customer?.planId);
  return (
    <>
      <DashHeader title="Teste de velocidade" text={`Seu plano: ${plan?.name} (${plan?.speed} Mbps). Para medir a velocidade real, prefira um computador conectado por cabo.`} />
      <div className="card speedtest-card">
        <SpeedTest compact />
      </div>
    </>
  );
}
