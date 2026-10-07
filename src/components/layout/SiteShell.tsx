import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header overlay />
      <main id="conteudo" className="site-main">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
