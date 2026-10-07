import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerLogin } from "@/components/account/CustomerLogin";

export const metadata: Metadata = {
  title: "Área do Cliente",
  description: "Acesse a Área do Cliente Veloz Fibra: faturas, PIX, teste de velocidade, upgrade de plano e suporte.",
  alternates: { canonical: "/area-do-cliente" },
};

export default function LoginPage() {
  return (
    <Suspense>
      <CustomerLogin />
    </Suspense>
  );
}
