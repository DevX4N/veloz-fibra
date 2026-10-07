# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Público que precisa ser convencido:** donos e gestores de provedores regionais de internet (ISPs de fibra). Eles avaliam a plataforma como vitrine, para decidir se contratam o autor e adaptam a base ao próprio provedor. Querem ver três coisas: que o assinante consegue resolver sozinho o que hoje vira ligação ou WhatsApp, que o site vende, e que tudo conecta com a operação deles (ERP, financeiro, NOC, CRM).

**Usuário dentro da ficção:** o assinante, atual ou futuro, de um provedor regional. Quase sempre está no celular e chega com uma tarefa: saber se tem cobertura no endereço, comparar e contratar um plano, tirar a segunda via ou copiar o PIX, testar a velocidade, ver se a rede caiu ou abrir um chamado. O cliente empresarial (pequenas e médias empresas) aparece como público secundário, com link dedicado, SLA e atendimento comercial.

## Product Purpose

Plataforma digital completa para um provedor regional fictício, **Veloz Fibra** ("Internet para conectar tudo que importa."). Inclui site comercial, contratação online em 5 etapas, autoatendimento (segunda via, teste de velocidade, status da rede, suporte) e Área do Cliente (faturas, plano, chamados, notificações, dados).

O sucesso tem duas medidas:
- **Na demonstração:** um dono de provedor percorre o roteiro do README em cerca de 5 minutos, reconhece a própria operação e enxerga como adaptar.
- **Na ficção:** cada tarefa do assinante se resolve sem falar com atendente.

## Positioning

É uma **base adaptável**, não uma peça única nem um SaaS. Marca, contatos, planos, cidades e bairros ficam em `src/config` e `src/data`. A interface só consome esses dados pela camada `src/services`, e cada serviço documenta o endpoint real que vai substituí-lo (ERPs como IXC, SGP, MK, Voalle, Hubsoft; gateways de boleto/PIX; Zabbix/PRTG; CRMs). Nenhum componente tem preço, plano, cidade ou telefone escrito dentro dele.

O diferencial é ser um produto de operação de provedor (cobertura, status de rede, faturas, chamados), não um template de landing page com tema de internet.

## Operating Context

- **Demonstração:** roteiro com dados de demo, descrito no README. CEPs `12900-100` (tem cobertura), `12950-300` (em expansão), `12980-900` (sem cobertura) e `00000-000` (erro de serviço). CPFs `123.456.789-09` (fatura em aberto) e `987.654.321-00` (em dia). O seletor "Simular cenário" em `/status` muda o estado da rede em todo o site.
- **Datas:** vencimentos, manutenções, agenda de instalação e chamados são calculados a partir do dia atual, então a demo nunca fica desatualizada.
- **Assinante:** usa o celular, muitas vezes em momento de problema (internet lenta, fatura vencendo).
- **Adaptação:** um provedor real recebe a base com marca, WhatsApp (`company.whatsapp`), planos e cidades trocados, analytics ligados por ID e consentimento, e `SITE_INDEXABLE=true` com domínio próprio.

## Capabilities and Constraints

- **Stack:** Next.js 15 (App Router, geração estática, 34 rotas), React 19, TypeScript estrito, CSS próprio com tokens em `src/styles/base.css` e ícones lucide-react. Dev na porta 3016.
- **Tudo é simulado:** login, consultas, pedidos, pagamentos e speed test. Não há autenticação real, cobrança real nem IDs reais de analytics.
- **Analytics:** os eventos (`click_whatsapp`, `coverage_search`, `plan_selected`, `contract_completed`...) removem dados pessoais antes do envio, e os scripts só carregam com ID configurado e consentimento.
- **Indexação:** `noindex` por padrão (header, meta e robots.txt) até haver domínio próprio.
- **Textos jurídicos:** Privacidade e Termos são estruturas demonstrativas com trechos `[...]` e exigem revisão jurídica.
- **Placeholders:** o número de WhatsApp e os perfis sociais ainda são fictícios.
- **Terminologia da interface:** "Área do Cliente", "segunda via", "Assine agora", "status da rede", "protocolo", e os status de chamado Aberto / Em análise / Aguardando cliente / Resolvido / Encerrado.
- **Verificação:** scripts em `tools/` (puppeteer-core) cobrem capturas, 12 fluxos ponta a ponta e checagem de links.

## Brand Commitments

Definidos pelo briefing e mantidos como obrigatórios:
- Nome **Veloz Fibra** e slogan "Internet para conectar tudo que importa."
- Paleta: azul `#2563EB`, ciano `#06B6D4`, navy `#0F172A`, `#F8FAFC`, `#E2E8F0`, `#64748B`. Cores semânticas: verde `#22C55E`, âmbar `#F59E0B`, vermelho `#EF4444`.
- Fontes: Manrope (títulos) e Inter (texto). JetBrains Mono entra só em números e dados.
- Símbolo da marca: três fibras convergindo num ponto de luz.
- Tom de voz: português do Brasil, direto e acolhedor, sem jargão técnico desnecessário.

## Evidence on Hand

- **Toda a evidência é fictícia e deve continuar assim:**
  - cidades Santa Aurora, Vale Serrano, Porto Ipê e Monte Alvo, com 25 bairros conectados (`src/data/coverage.ts`);
  - planos, clientes, faturas, depoimentos, marcos e números da empresa (`src/data/*`);
  - CNPJ `00.000.000/0001-00`.
- **Não existem e não devem ser inventados como reais:** clientes ou provedores que usam a plataforma, depoimentos verdadeiros, métricas de desempenho de produção, prêmios, preços de licenciamento.
- **Sem fotografia:** todo o visual atual é SVG e CSS.

## Product Principles

1. **O assinante resolve sozinho.** Cada fluxo termina em resultado concreto (protocolo, código PIX, data de instalação, diagnóstico), nunca em "entre em contato".
2. **Configurável antes de bonito.** Qualquer conteúdo que muda de provedor para provedor vem de `config`/`data`/`services`. Recurso visual que exige conteúdo escrito dentro do componente não entra.
3. **Demo convincente e honesta.** Dados fictícios plausíveis e coerentes entre páginas, sempre identificados como demonstração. Nada se passa por cliente ou número real.
4. **Celular é a referência.** O assinante de provedor regional usa principalmente o celular. Layout, toque e desempenho são decididos primeiro para telas a partir de 320 px.
5. **Estado sempre explícito.** Carregando, vazio, erro, sem cobertura, rede instável: todo estado tem tela própria e caminho de saída.

## Accessibility & Inclusion

- Nível exigido: **WCAG 2.2 AA**.
- Contraste AA em textos e componentes.
- Navegação completa por teclado, com foco visível.
- Um único `<h1>` por página.
- Estados comunicados por ícone e texto, nunca só por cor.
- `prefers-reduced-motion` respeitado.
- Áreas de toque adequadas no celular.
- Sem rolagem horizontal de 320 a 1920 px.
