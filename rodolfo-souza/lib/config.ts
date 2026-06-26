/**
 * CONFIG CENTRAL DO NEGOCIO
 * -------------------------------------------------------------
 * Edite TODOS os dados do negocio aqui. Os componentes consomem
 * deste arquivo, entao manutencao = mexer apenas neste lugar.
 *
 * IMPORTANTE (conformidade):
 *  - CNPJ, registro e "credenciado e autorizado" sao PLACEHOLDERS.
 *    O responsavel deve preencher/validar com dados reais antes de publicar.
 *  - A taxa do simulador e ILUSTRATIVA. O valor real e definido na
 *    simulacao oficial via WhatsApp.
 */

export const SITE = {
  nome: "Rodolfo Souza Crédito",
  marca: "Rodolfo Souza",
  iniciais: "RS",
  tagline: "Crédito facilitado com as melhores taxas do mercado.",
  url: "https://rodolfosouzacredito.com.br", // TODO: trocar pela URL real de producao
} as const;

export const CONTATO = {
  // Numero internacional (somente digitos) usado nos links wa.me
  whatsappNumero: "5582999918912",
  // Exibicao formatada
  telefone: "(82) 99991-8912",
  instagramHandle: "@rodolfo_souza_tn2",
  instagramUrl: "https://instagram.com/rodolfo_souza_tn2",
} as const;

export const ENDERECO = {
  logradouro: "Av. Afrânio Lages",
  cidade: "Batalha",
  estado: "AL",
  estadoExtenso: "Alagoas",
  cep: "57420-000",
  regiao: "Sertão de Alagoas",
  // Coordenadas aproximadas de Batalha/AL (ajuste se necessario para o JSON-LD).
  geo: { lat: -9.6747, lng: -37.1267 },
} as const;

/**
 * DADOS LEGAIS — PLACEHOLDERS.
 * Preencher com os dados reais validados pelo responsavel.
 */
export const LEGAL = {
  cnpj: "[PREENCHER CNPJ]",
  registro: "[Texto legal/registro a ser revisado pelo responsável]",
  disclaimer:
    "Crédito sujeito a análise e aprovação. As condições, taxas e prazos podem variar conforme a operação.",
} as const;

/**
 * PARAMETROS DO SIMULADOR (ilustrativos).
 * TAXA_MENSAL_PADRAO so existe para a estimativa do site.
 * A taxa real e definida na simulacao oficial (WhatsApp).
 */
export const SIMULADOR = {
  TAXA_MENSAL_PADRAO: 0.0449, // 4,49% a.m. — APENAS ILUSTRATIVO
  valorMin: 300,
  valorMax: 20000,
  valorPasso: 100,
  valorInicial: 3000,
  parcelaMax: 18,
  parcelaInicial: 12,
} as const;

/* ------------------------------------------------------------------ */
/* Helpers de WhatsApp — centralize aqui todas as mensagens pre-preenchidas */
/* ------------------------------------------------------------------ */

/** Monta uma URL wa.me com mensagem opcional (encodada). */
export function waLink(mensagem?: string): string {
  const base = `https://wa.me/${CONTATO.whatsappNumero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

/** Mensagens padrao usadas pelos CTAs do site. */
export const MENSAGENS = {
  geral: "Olá! Vim pelo site e quero simular um crédito sem compromisso.",
  simularAgora:
    "Olá! Quero fazer uma simulação de crédito agora, sem compromisso.",
  comoFunciona: "Olá! Quero entender como funciona o crédito de vocês.",
  /** Mensagem do simulador, com valor e parcelas escolhidos pelo usuario. */
  simulacao: (valorFormatado: string, parcelas: number) =>
    `Olá! Quero simular um crédito de ${valorFormatado} em ${parcelas}x.`,
} as const;

/* Atalhos de link prontos para uso direto nos componentes. */
export const WA = {
  geral: () => waLink(MENSAGENS.geral),
  simular: () => waLink(MENSAGENS.simularAgora),
  comoFunciona: () => waLink(MENSAGENS.comoFunciona),
} as const;

/* ------------------------------------------------------------------ */
/* Formatadores                                                        */
/* ------------------------------------------------------------------ */

export const formatBRL = (valor: number): string =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export const formatBRLCentavos = (valor: number): string =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* Itens de navegacao reaproveitados no Header e Footer. */
export const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Simulador", href: "#simulador" },
  { label: "Dúvidas", href: "#faq" },
  { label: "Contato", href: "#contato" },
] as const;
