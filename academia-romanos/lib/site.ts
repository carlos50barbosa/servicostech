/**
 * Dados centrais da Academia Romanos.
 * Trechos marcados com [CONFIRMAR] devem ser validados com o cliente.
 */
export const SITE = {
  name: 'Academia Romanos',
  legalName: 'Academia Romanos',
  tagline: 'Há 20 anos no seu bairro, esperando exatamente você.',
  years: 20,
  city: 'Carapicuíba',
  state: 'SP',
  region: 'COHAB 2 e COHAB 5',

  // URL pública do site (usada em metadata/OG/JSON-LD). Ajustar no deploy.
  url: 'https://academiaromanos.com.br', // [CONFIRMAR domínio]

  // Contato
  whatsapp: '5511960176395',
  whatsappDisplay: '(11) 96017-6395',
  instagram: 'https://instagram.com/academiaromanos',
  instagramHandle: '@academiaromanos',

  // Endereço — [CONFIRMAR endereço completo, CEP e geolocalização]
  address: {
    street: 'Av. [CONFIRMAR endereço]',
    district: 'COHAB 2',
    city: 'Carapicuíba',
    state: 'SP',
    postalCode: '06326-000', // [CONFIRMAR CEP]
    full: 'COHAB 2 / COHAB 5 — Carapicuíba/SP',
  },
  geo: {
    // [CONFIRMAR coordenadas reais da academia]
    lat: -23.5236,
    lng: -46.8358,
  },
  // Consulta usada no mapa incorporado (Google Maps embed, sem chave de API).
  mapsQuery: 'Academia Romanos COHAB 2 Carapicuíba SP',

  stats: {
    students: 4000, // [CONFIRMAR número real de alunos atendidos]
    modalities: 4,
  },
} as const

/** Gera link de WhatsApp com mensagem pré-preenchida. */
export function wa(message: string = WA_MESSAGES.default): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}

/** Mensagens pré-preenchidas por contexto (cada CTA puxa para a conversa certa). */
export const WA_MESSAGES = {
  default: 'Olá! Vim pelo site e quero saber mais sobre os planos da Academia Romanos.',
  enroll:
    'Olá! Vim pelo site e quero me matricular na Academia Romanos. Pode me passar os planos e valores?',
  trial:
    'Olá! Vim pelo site e quero agendar uma aula experimental na Academia Romanos.',
  team: 'Olá! Vim pelo site e gostaria de falar com a equipe da Academia Romanos sobre começar a treinar.',
  schedule:
    'Olá! Vim pelo site e quero saber os horários e o funcionamento da musculação na Academia Romanos.',
  modality: (nome: string) =>
    `Olá! Vim pelo site e tenho interesse na modalidade ${nome} na Academia Romanos.`,
} as const

/** Itens de navegação (âncoras das seções). */
export const NAV_LINKS = [
  { label: 'Modalidades', href: '#modalidades' },
  { label: 'Horários', href: '#horarios' },
  { label: 'Sobre', href: '#diferenciais' },
  { label: 'Contato', href: '#contato' },
] as const
