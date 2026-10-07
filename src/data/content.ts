/**
 * Conteúdo editorial (benefícios, depoimentos, FAQ, etapas, institucional).
 * Separado dos componentes para permitir edição via CMS/painel no futuro.
 */

import type { IconName } from "@/components/ui/Icon";
import { coverageTotals } from "./coverage";

export const stats = [
  { value: 8000, prefix: "+", suffix: "", decimals: 0, label: "Clientes conectados" },
  { value: 4.9, prefix: "", suffix: "/5", decimals: 1, label: "Avaliação dos clientes" },
  { value: 99.9, prefix: "", suffix: "%", decimals: 1, label: "Disponibilidade da rede" },
  { value: 24, prefix: "", suffix: "h", decimals: 0, label: "Monitoramento, todos os dias" },
];

export const heroHighlights = ["Instalação rápida", "Wi-Fi de alta performance", "Suporte especializado"];

export const benefits: { icon: IconName; title: string; text: string }[] = [
  { icon: "cable", title: "100% Fibra Óptica", text: "Fibra até dentro da residência, sem trechos de cabo metálico no caminho." },
  { icon: "router", title: "Wi-Fi de alta performance", text: "Roteadores Wi-Fi 6 configurados pela nossa equipe para cobrir a casa toda." },
  { icon: "gamepad", title: "Internet para jogar", text: "Baixa latência e rotas otimizadas para os principais servidores de jogos." },
  { icon: "film", title: "Streaming sem travamentos", text: "Filmes e séries em 4K em várias telas ao mesmo tempo." },
  { icon: "headphones", title: "Suporte que resolve", text: "Atendimento técnico próprio, que conhece a rede da sua rua." },
  { icon: "wrench", title: "Instalação rápida", text: "Agendamento online e técnico com horário marcado." },
];

export const businessBenefits: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield-check", title: "Alta estabilidade", text: "Rede com redundância e monitoramento ativo para manter sua operação online." },
  { icon: "headphones", title: "Suporte especializado", text: "Canal empresarial com técnicos dedicados e atendimento prioritário." },
  { icon: "settings", title: "Soluções personalizadas", text: "Projetos sob medida para matriz, filiais e operações críticas." },
  { icon: "server", title: "IP fixo", text: "Endereço público fixo para servidores, câmeras, VPN e sistemas de gestão." },
  { icon: "network", title: "Link dedicado", text: "Banda simétrica e garantida, com contrato de nível de serviço (SLA)." },
  { icon: "activity", title: "Monitoramento", text: "Acompanhamento 24h do link e abertura proativa de chamados." },
  { icon: "upload", title: "Alta capacidade de upload", text: "Envio rápido de arquivos, backups em nuvem e videoconferências." },
  { icon: "wifi", title: "Wi-Fi empresarial", text: "Redes separadas para equipe e visitantes, com gestão centralizada." },
];

export const gamerIndicators: { icon: IconName; label: string; detail: string }[] = [
  { icon: "timer", label: "Baixo ping", detail: "Latência média de 4 ms até nosso núcleo" },
  { icon: "activity", label: "Alta estabilidade", detail: "Jitter próximo de zero em horário de pico" },
  { icon: "cable", label: "Fibra óptica", detail: "Do servidor até o seu roteador" },
  { icon: "download", label: "Download ultrarrápido", detail: "Jogos de 100 GB em poucos minutos" },
];

export const connectedUses = ["Streaming 4K", "Home Office", "Games", "Videochamadas", "Casa conectada"];

export const connectedDevices: { icon: IconName; label: string; usage: string }[] = [
  { icon: "tv", label: "Smart TV", usage: "Streaming 4K" },
  { icon: "laptop", label: "Notebook", usage: "Videochamada" },
  { icon: "smartphone", label: "Smartphone", usage: "Redes sociais" },
  { icon: "gamepad", label: "Console", usage: "Partida online" },
  { icon: "tablet", label: "Tablet", usage: "Aulas online" },
  { icon: "speaker", label: "Smart devices", usage: "Casa conectada" },
];

export const howItWorks = [
  { title: "Consulte a cobertura", text: "Informe sua localização e confirme a disponibilidade na hora." },
  { title: "Escolha seu plano", text: "Compare as velocidades e escolha a ideal para sua rotina." },
  { title: "Agende a instalação", text: "Escolha o melhor dia e período para receber o técnico." },
  { title: "Pronto", text: "Aproveite sua nova conexão com Wi-Fi já configurado." },
];

export const aboutPillars: { icon: IconName; title: string; text: string }[] = [
  { icon: "server", title: "Infraestrutura moderna", text: "Núcleo de rede redundante e equipamentos GPON de última geração." },
  { icon: "users", title: "Equipe especializada", text: "Técnicos próprios, treinados e identificados." },
  { icon: "cable", title: "Fibra óptica", text: "Rede 100% óptica da central até a casa do cliente." },
  { icon: "heart", title: "Atendimento próximo", text: "Gente da região, que conhece cada bairro atendido." },
  { icon: "cpu", title: "Tecnologia", text: "Monitoramento em tempo real e diagnóstico remoto." },
  { icon: "trending", title: "Expansão constante", text: `${coverageTotals.neighborhoods} bairros conectados e novas regiões a cada trimestre.` },
];

export const milestones = [
  { year: "2014", text: "Primeiros clientes conectados no Centro de Santa Aurora." },
  { year: "2017", text: "Migração completa da rede para fibra óptica (FTTH)." },
  { year: "2020", text: "Chegada a Vale Serrano e abertura do núcleo de monitoramento 24h." },
  { year: "2023", text: "Wi-Fi 6 em todos os planos a partir de 700 Mega." },
  { year: "2026", text: "Expansão para Porto Ipê e obras em Monte Alvo." },
];

export const testimonials = [
  {
    name: "Mariana Oliveira",
    role: "Designer · Home office",
    city: "Santa Aurora",
    rating: 5,
    text: "A internet é muito estável. Trabalho de casa e melhorou bastante minha rotina.",
  },
  {
    name: "Lucas Martins",
    role: "Jogador competitivo",
    city: "Vale Serrano",
    rating: 5,
    text: "Uso principalmente para jogar e o ping ficou excelente. Atendimento muito bom também.",
  },
  {
    name: "Fernanda Souza",
    role: "Cliente desde 2024",
    city: "Porto Ipê",
    rating: 5,
    text: "Instalaram rápido e até agora não tive nenhum problema. Recomendo.",
  },
];

export type FAQ = { q: string; a: string };

export const faqs: Record<"general" | "coverage" | "speedtest" | "billing" | "business" | "plans", FAQ[]> = {
  general: [
    { q: "A internet é realmente fibra óptica?", a: "Sim. Nossa conexão utiliza tecnologia de fibra óptica para oferecer maior estabilidade e desempenho." },
    { q: "O roteador está incluso?", a: "Os planos elegíveis incluem equipamento Wi-Fi em comodato. Nos planos de 700 Mega e 1 Giga o roteador é Wi-Fi 6." },
    { q: "Quanto tempo demora a instalação?", a: "O prazo depende da disponibilidade da equipe técnica na região. Na contratação online você já escolhe o dia e o período." },
    { q: "Posso aumentar meu plano depois?", a: "Sim. Entre em contato com nossa equipe ou solicite o upgrade direto pela Área do Cliente." },
    { q: "A Veloz Fibra atende minha região?", a: "Utilize nossa consulta de cobertura: basta informar cidade e bairro ou o CEP do endereço." },
    { q: "Como entro em contato com o suporte?", a: "Nossa equipe está disponível pelo WhatsApp, telefone e Área do Cliente, nos horários informados na página de contato." },
  ],
  plans: [
    { q: "Existe fidelidade?", a: "As condições de permanência variam conforme a oferta vigente e são apresentadas antes da contratação." },
    { q: "Qual plano é ideal para minha casa?", a: "Para até 5 dispositivos, o 500 Mega atende bem. Famílias com streaming 4K e jogos costumam preferir 700 Mega ou 1 Giga." },
    { q: "A velocidade é a mesma no Wi-Fi?", a: "A velocidade contratada é entregue no equipamento. No Wi-Fi ela pode variar conforme distância, paredes e o aparelho utilizado." },
  ],
  coverage: [
    { q: "Minha rua ainda não possui cobertura. O que faço?", a: "Cadastre seu interesse no resultado da consulta. Usamos esses cadastros para priorizar as próximas expansões e avisamos assim que a fibra chegar." },
    { q: "Vocês atendem área rural?", a: "Algumas áreas rurais próximas à rede podem ser atendidas mediante estudo de viabilidade técnica. Fale com a equipe comercial." },
    { q: "Como funciona a expansão da rede?", a: "Planejamos novas regiões considerando a demanda cadastrada, a infraestrutura existente e as licenças junto aos órgãos municipais." },
  ],
  speedtest: [
    { q: "Por que minha velocidade pode variar?", a: "Fatores como Wi-Fi, distância do roteador, capacidade do aparelho, outros dispositivos em uso e o servidor de destino influenciam o resultado." },
    { q: "Devo testar pelo Wi-Fi ou cabo?", a: "Para medir a velocidade real da conexão, prefira um computador ligado ao roteador por cabo de rede e feche outros aplicativos." },
    { q: "O que significa ping?", a: "Ping é o tempo, em milissegundos, que um pacote leva para ir e voltar a um servidor. Quanto menor, mais rápida é a resposta — essencial para jogos e chamadas." },
  ],
  billing: [
    { q: "Posso pagar por PIX?", a: "Sim. Todas as faturas possuem código PIX copia e cola, além do boleto com código de barras." },
    { q: "Quando o pagamento é identificado?", a: "Pagamentos via PIX costumam ser identificados em poucos minutos. Boletos podem levar até 3 dias úteis." },
    { q: "Como alterar a data de vencimento?", a: "Solicite pela Área do Cliente, em Serviços, ou pelo WhatsApp. A alteração é aplicada a partir da próxima fatura." },
  ],
  business: [
    { q: "O que é IP fixo?", a: "É um endereço público que não muda. Ele permite acessar remotamente servidores, câmeras, VPNs e sistemas hospedados na sua empresa." },
    { q: "O que é link dedicado?", a: "É uma conexão exclusiva, com banda simétrica e garantida, sem compartilhamento com outros clientes, ideal para operações críticas." },
    { q: "Existe SLA?", a: "Sim. Os links dedicados contam com contrato de nível de serviço que define disponibilidade e prazos de atendimento." },
    { q: "Vocês atendem empresas fora da cidade?", a: "Atendemos as cidades da nossa rede e avaliamos projetos em outras localidades mediante estudo de viabilidade." },
  ],
};

export const supportCategories: { id: string; label: string; icon: IconName }[] = [
  { id: "lenta", label: "Internet lenta", icon: "gauge" },
  { id: "sem-conexao", label: "Sem conexão", icon: "wifi-off" },
  { id: "wifi", label: "Wi-Fi", icon: "wifi" },
  { id: "roteador", label: "Roteador", icon: "router" },
  { id: "faturas", label: "Faturas", icon: "receipt" },
  { id: "cadastro", label: "Cadastro", icon: "user" },
  { id: "plano", label: "Alteração de plano", icon: "trending" },
  { id: "instalacao", label: "Instalação", icon: "wrench" },
  { id: "outros", label: "Outros assuntos", icon: "help" },
];

export const helpArticles: { id: string; category: string; title: string; body: string[] }[] = [
  { id: "a1", category: "lenta", title: "Minha internet está lenta. O que verificar?", body: ["Faça um teste de velocidade com o computador ligado por cabo ao roteador.", "Se o resultado por cabo estiver próximo do plano, a lentidão provavelmente está no Wi-Fi: aproxime-se do roteador ou use a rede 5 GHz.", "Desligue downloads e atualizações automáticas em outros aparelhos e teste novamente."] },
  { id: "a2", category: "lenta", title: "Por que o teste no celular mostra menos velocidade?", body: ["Muitos celulares não conseguem atingir velocidades acima de 300–500 Mbps pelo Wi-Fi.", "Paredes, distância e interferência de outras redes também reduzem a velocidade sem fio."] },
  { id: "a3", category: "sem-conexao", title: "Estou sem internet. Como resolver?", body: ["Confira se o roteador e a ONT estão ligados e com as luzes acesas.", "Verifique se a luz LOS da ONT está vermelha — nesse caso, pode haver rompimento de fibra e é preciso abrir um chamado.", "Desligue os equipamentos da tomada por 30 segundos, ligue novamente e aguarde cerca de 2 minutos."] },
  { id: "a4", category: "sem-conexao", title: "A luz vermelha (LOS) está acesa na ONT", body: ["A luz LOS indica perda de sinal óptico.", "Não dobre nem puxe o cabo de fibra. Abra um atendimento para que um técnico verifique a rede."] },
  { id: "a5", category: "wifi", title: "Como trocar o nome e a senha do Wi-Fi?", body: ["Pela Área do Cliente, em Minha internet > Wi-Fi, você solicita a alteração sem precisar acessar o roteador.", "Se preferir, nossa equipe faz a alteração pelo WhatsApp após confirmar seus dados."] },
  { id: "a6", category: "wifi", title: "Qual a diferença entre as redes 2.4 GHz e 5 GHz?", body: ["A rede 2.4 GHz alcança mais longe, mas é mais lenta e sujeita a interferências.", "A rede 5 GHz é bem mais rápida e ideal para TVs, notebooks e consoles próximos ao roteador."] },
  { id: "a7", category: "roteador", title: "Onde posicionar o roteador?", body: ["Prefira um local central, elevado e aberto, longe de micro-ondas, espelhos e aquários.", "Evite deixá-lo dentro de armários ou atrás da TV."] },
  { id: "a8", category: "faturas", title: "Como emitir a segunda via da fatura?", body: ["Acesse Segunda via, informe o CPF ou CNPJ do titular e copie o código PIX ou de barras.", "Também é possível baixar o boleto ou recebê-lo pelo WhatsApp."] },
  { id: "a9", category: "faturas", title: "Paguei a fatura, mas ainda aparece em aberto", body: ["PIX é identificado em poucos minutos; boleto pode levar até 3 dias úteis.", "Se o prazo já passou, envie o comprovante pelo WhatsApp."] },
  { id: "a10", category: "cadastro", title: "Como atualizar meus dados cadastrais?", body: ["Na Área do Cliente, em Dados cadastrais, você atualiza e-mail e telefone.", "A troca de titularidade exige documentos e é feita com nossa equipe."] },
  { id: "a11", category: "plano", title: "Como fazer upgrade do plano?", body: ["Na Área do Cliente, em Serviços > Alterar plano, veja os planos disponíveis para seu endereço e confirme o upgrade.", "Na maioria dos casos a nova velocidade é aplicada remotamente, sem visita técnica."] },
  { id: "a12", category: "instalacao", title: "Como funciona a instalação?", body: ["O técnico leva a fibra até a sua casa, instala a ONT e o roteador e configura o Wi-Fi com você.", "A visita dura em média 1h30. É necessário ter um responsável maior de idade no local."] },
  { id: "a13", category: "instalacao", title: "Preciso mudar de endereço. E agora?", body: ["Consulte a cobertura do novo endereço e solicite a mudança pela Área do Cliente ou WhatsApp.", "Agendamos a retirada e a nova instalação para reduzir o tempo sem conexão."] },
  { id: "a14", category: "outros", title: "Como cancelar meu contrato?", body: ["O cancelamento pode ser solicitado pelos canais de atendimento.", "Agendamos a retirada dos equipamentos em comodato."] },
];

export const diagnosticSteps = [
  { title: "Confira se o roteador está ligado", text: "As luzes de energia e internet devem estar acesas." },
  { title: "Verifique os cabos", text: "Confirme que os cabos de energia, de rede e de fibra estão bem encaixados." },
  { title: "Reinicie o equipamento", text: "Desligue a ONT e o roteador da tomada por 30 segundos e ligue novamente." },
  { title: "Aguarde aproximadamente 2 minutos", text: "É o tempo para os equipamentos sincronizarem com a rede." },
];

export const ticketSubjects = [
  "Sem internet",
  "Internet lenta",
  "Wi-Fi",
  "Roteador",
  "Equipamento",
  "Financeiro",
  "Alteração de plano",
  "Outros",
];

export const businessNeeds = [
  "Internet empresarial",
  "IP fixo",
  "Link dedicado",
  "Wi-Fi empresarial",
  "Solução personalizada",
];

export const employeeRanges = ["1 a 5", "6 a 20", "21 a 50", "51 a 200", "Mais de 200"];

export const contactSubjects = ["Quero contratar", "Suporte técnico", "Financeiro", "Empresas", "Sugestões", "Outros assuntos"];

export const openPositions = [
  { title: "Técnico(a) de Instalação FTTH", place: "Santa Aurora", type: "CLT · Presencial" },
  { title: "Analista de Suporte N1", place: "Santa Aurora", type: "CLT · Presencial" },
  { title: "Consultor(a) Comercial Empresas", place: "Vale Serrano", type: "CLT · Híbrido" },
];
