# Veloz Fibra — plataforma digital para provedor regional

Projeto de portfólio: site comercial + atendimento + Área do Cliente de um provedor de internet **fictício**.
Todas as consultas, logins e pedidos são **simulados** — nenhuma integração real, nenhum pagamento.

```bash
npm install
npm run dev        # http://localhost:3016
npm run build      # build de produção (34 páginas estáticas)
npm run typecheck
```

Stack: Next.js 15 (App Router) · React 19 · TypeScript · CSS próprio (tokens em `src/styles/base.css`) ·
ícones Lucide · fontes Manrope / Inter / JetBrains Mono via `next/font`.

## Roteiro de demonstração (5 min)

| O que mostrar | Onde | Dica |
|---|---|---|
| Consulta de cobertura (3 resultados + erro) | Home › Cobertura ou `/cobertura` | CEPs de demo: `12900-100` cobre · `12950-300` expansão · `12980-900` sem cobertura · `00000-000` erro de serviço |
| Contratação em 5 etapas | **Assine agora** ou `/assine?plano=1000` | CEP `12900-100` preenche o endereço sozinho |
| Segunda via | `/segunda-via` | `123.456.789-09` fatura em aberto · `987.654.321-00` tudo em dia · outro CPF válido = não encontrado |
| Área do Cliente | `/area-do-cliente` | mesmos CPFs, qualquer senha com 4+ caracteres |
| Upgrade de plano, chamados, notificações | dentro da Área do Cliente | sino no topo, `Alterar plano`, `Suporte` |
| Status da rede ao vivo | `/status` | **Simular cenário** muda o status em todo o site (header, atalhos, dashboard) |
| Speed test | `/teste-de-velocidade` | resultado final fixo (687/352 Mbps, 4 ms) |

As datas (vencimentos, manutenções, agenda de instalação, chamados) são calculadas a partir do dia atual,
então a demo nunca parece desatualizada.

## Arquitetura

```
src/
  app/
    (site)/              páginas públicas (Header + Footer + WhatsApp)
      internet-fibra/[cidade]   SEO local, gerado a partir de data/coverage.ts
    area-do-cliente/
      page.tsx           login
      (app)/             dashboard (sidebar no desktop, tab bar + "Mais" no mobile)
    not-found.tsx · sitemap.ts · robots.ts · icon.svg
  config/      site.ts (marca, contatos, WhatsApp, analytics) · navigation.ts (menus)
  data/        planos, cidades/bairros, clientes/faturas, rede, conteúdo, conta — fonte única dos mocks
  services/    camada que a interface consome (troque o corpo por chamadas reais)
  components/  ui/ · layout/ · home/ · plans/ · coverage/ · billing/ · speedtest/ · status/ · account/ ...
  hooks/ · utils/ (máscaras, validação de CPF/CNPJ/CEP, formatação) · lib/ (analytics, whatsapp)
  styles/      base (tokens) · components · layout · sections · pages · dashboard
tools/         scripts de revisão com puppeteer (capturas, fluxos ponta a ponta, links)
```

**Regra do projeto:** componentes nunca têm preço, plano, cidade ou telefone escritos dentro deles.
Tudo vem de `config/` e `data/`, e chega à interface pelos `services/`.

## Como adaptar para um provedor real

1. **Marca** — `src/config/site.ts` (nome, contatos, horários, redes) e as variáveis de cor em
   `src/styles/base.css` (`--blue`, `--cyan`, `--navy`...). Logo em `components/brand/Logo.tsx` e `app/icon.svg`.
2. **WhatsApp** — `company.whatsapp` em `src/config/site.ts` (marcado com ▼▼▼). Mensagens pré-preenchidas em `src/lib/whatsapp.ts`.
3. **Planos** — `src/data/plans.ts` (velocidade, preço, destaque, benefícios). Cards, comparativo, contratação,
   páginas de cidade e upgrade usam a mesma lista.
4. **Cidades e bairros** — `src/data/coverage.ts`. As páginas `/internet-fibra/<cidade>`, o mapa e os selects se ajustam sozinhos.
5. **Integrações** — cada função em `src/services/*` tem um comentário `Futuro:` com o endpoint esperado:

| Serviço | Integra com |
|---|---|
| `coverageService` | API de viabilidade / ViaCEP / cadastro de caixas ópticas |
| `customerService` | autenticação e cadastro do ERP (IXC, SGP, MK, Voalle, Hubsoft...), helpdesk |
| `invoiceService` | sistema financeiro / gateway de boletos e PIX |
| `networkService` | NOC / monitoramento (Zabbix, PRTG, LibreNMS) e agenda de manutenções |
| `speedTestService` | Ookla Custom, LibreSpeed ou servidor próprio (mesmo contrato de eventos) |
| `leadService` | CRM comercial (RD Station, HubSpot, Pipedrive) e pedidos de instalação |

   `services/core.ts` já tem `apiFetch()` lendo `NEXT_PUBLIC_API_URL`.
6. **Analytics** — preencha os IDs em `analytics` (`config/site.ts`). Os scripts só carregam com ID **e**
   consentimento do banner de cookies. Eventos (`click_whatsapp`, `coverage_search`, `plan_selected`,
   `contract_completed`, `invoice_search`, `speed_test_completed`, `customer_login`...) estão em `lib/analytics.ts`;
   dados pessoais são filtrados antes do envio.
7. **SEO** — com domínio próprio, defina `NEXT_PUBLIC_SITE_URL` e `SITE_INDEXABLE=true`. Até lá o projeto
   envia `noindex` (header + meta + robots.txt). Cada página tem title/description próprios, breadcrumb e
   JSON-LD (Organization, FAQPage, BreadcrumbList, Service por cidade).
8. **Jurídico** — Política de Privacidade e Termos são estruturas demonstrativas com trechos `[...]` para
   preencher; precisam de revisão jurídica antes de ir ao ar.

## Sistema visual

- Tokens em `src/styles/base.css`: escala de espaçamento (`--s-1`…`--s-9`), escala tipográfica (`--fs-*`), raios, sombras.
- Títulos sem rótulo/kicker acima; um `h1` por página; seções alinhadas à esquerda.
- Plano recomendado em superfície escura (navy), demais em branco; barra de velocidade na mesma escala nos três cards.
- Páginas-ferramenta (status, teste, suporte, segunda via, contratação) usam `PageHero compact` para a ferramenta aparecer na primeira dobra.
- Assinatura da marca: a "rota da fibra" (hero, cabeçalho das páginas, mapa, linha do tempo e rota da conexão no painel).

## Qualidade verificada

- 34 rotas estáticas no build; nenhum erro de console nas páginas e fluxos.
- Sem rolagem horizontal em 320, 375, 390, 768, 1024, 1440 e 1920 px (site e dashboard).
- 12 fluxos ponta a ponta automatizados (`node tools/flows.mjs 1440` e `390`).
- 60 links internos e âncoras checados (`node tools/links.mjs`).
- Um único `<h1>` por página, foco visível, navegação por teclado nos menus/abas, `prefers-reduced-motion` respeitado,
  estados não dependem só de cor (ícone + texto).

Os scripts em `tools/` usam `puppeteer-core` com o Chrome instalado e o servidor rodando na porta 3016.
