import type { Metadata } from "next";
import { DashboardShell } from "@/components/account/DashboardShell";

export const metadata: Metadata = {
  title: { template: "%s | Área do Cliente Veloz Fibra", default: "Área do Cliente" },
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
