/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL DO SITE — Fernando Luiz, Calhas e Rufos
 * ============================================================================
 *
 *  👉 ESTE É O ÚNICO ARQUIVO QUE VOCÊ (CLIENTE) PRECISA EDITAR para alterar
 *     telefone, links, textos, lista de serviços, depoimentos, FAQ e cidades.
 *
 *  Todos os componentes da página leem os dados daqui. Basta trocar os valores
 *  abaixo e salvar — o site é atualizado automaticamente.
 * ============================================================================
 */

import {
  Award,
  ShieldCheck,
  Clock,
  Building2,
  Wrench,
  Droplets,
  Sparkles,
  Hammer,
  ShieldHalf,
  Store,
  type LucideIcon,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  DADOS DO NEGÓCIO                                                            */
/* -------------------------------------------------------------------------- */

export const business = {
  name: 'Fernando Luiz',
  fullName: 'Fernando Luiz — Calhas e Rufos',
  segment: 'Calhas e Rufos',
  slogan: 'Qualidade que protege, serviço que dura.',
  promise: 'Proteja sua casa com quem entende do assunto.',
  city: 'Campinas',
  region: 'Campinas e região',
  state: 'SP',
} as const;

/* -------------------------------------------------------------------------- */
/*  CONTATO  (TROCAR: caso mude o número, atualize phone E whatsapp.number)     */
/* -------------------------------------------------------------------------- */

export const contact = {
  // Telefone exibido para o usuário
  phoneDisplay: '(19) 99806-8683',
  // Formato para o link "tel:" (somente dígitos com DDI)
  phoneTel: '+5519998068683',
  whatsapp: {
    // Número no formato internacional, somente dígitos (55 + DDD + número)
    number: '5519998068683',
    // Mensagem que já vem preenchida ao abrir o WhatsApp
    defaultMessage:
      'Olá! Vim pelo site e gostaria de solicitar um orçamento para calhas e rufos.',
  },
  instagram: {
    handle: '@fernando_luizdiniz',
    url: 'https://www.instagram.com/fernando_luizdiniz/',
  },
  // E-mail é opcional — deixe vazio ('') para ocultar.
  email: '',
} as const;

/**
 * Monta um link wa.me com mensagem opcional já codificada para URL.
 * Use em qualquer botão de WhatsApp do site.
 */
export function buildWhatsAppLink(message: string = contact.whatsapp.defaultMessage): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${contact.whatsapp.number}?text=${text}`;
}

/* -------------------------------------------------------------------------- */
/*  NAVEGAÇÃO (âncoras do menu)                                                 */
/* -------------------------------------------------------------------------- */

export const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
] as const;

/* -------------------------------------------------------------------------- */
/*  HERO                                                                        */
/* -------------------------------------------------------------------------- */

export const hero = {
  headline: 'Proteja sua casa com quem entende do assunto',
  subheadline:
    'Calhas e rufos com qualidade garantida em Campinas e região. Evite infiltrações, vazamentos e prejuízos no seu imóvel.',
  proofPoints: ['Qualidade Garantida', 'Pontualidade', 'Residências e Comércios'],
} as const;

/* -------------------------------------------------------------------------- */
/*  DIFERENCIAIS                                                                */
/* -------------------------------------------------------------------------- */

export type Diferencial = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const diferenciais: Diferencial[] = [
  {
    icon: Award,
    title: 'Qualidade Garantida',
    description: 'Materiais e acabamento de primeira em cada serviço.',
  },
  {
    icon: ShieldCheck,
    title: 'Serviço Profissional',
    description: 'Equipe experiente e atenta aos detalhes.',
  },
  {
    icon: Clock,
    title: 'Pontualidade e Compromisso',
    description: 'Cumprimos prazos e combinados com você.',
  },
  {
    icon: Building2,
    title: 'Residências e Comércios',
    description: 'Atendimento para todos os tipos de imóvel.',
  },
];

/* -------------------------------------------------------------------------- */
/*  SERVIÇOS                                                                    */
/* -------------------------------------------------------------------------- */

export type Servico = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const servicos: Servico[] = [
  {
    icon: Wrench,
    title: 'Instalação de Calhas e Rufos',
    description:
      'Instalação completa para captação correta da água da chuva e proteção da estrutura.',
  },
  {
    icon: Sparkles,
    title: 'Limpeza de Calhas',
    description:
      'Serviços gerais de limpeza para evitar entupimentos e transbordamentos.',
  },
  {
    icon: Hammer,
    title: 'Manutenção',
    description:
      'Reparos e manutenção preventiva que prolongam a vida útil da sua cobertura.',
  },
  {
    icon: Droplets,
    title: 'Impermeabilização',
    description:
      'Impermeabilização interna e externa de calhas contra infiltrações.',
  },
  {
    icon: ShieldHalf,
    title: 'Vedações',
    description: 'Vedação profissional para eliminar pontos de vazamento.',
  },
  {
    icon: Store,
    title: 'Atendimento a Comércios',
    description: 'Soluções para empresas, galpões e estabelecimentos.',
  },
];

/* -------------------------------------------------------------------------- */
/*  BENEFÍCIOS ("Por que cuidar das suas calhas?")                              */
/* -------------------------------------------------------------------------- */

export const beneficios = {
  title: 'Por que cuidar das suas calhas?',
  intro:
    'Calhas e rufos bem cuidados são a primeira linha de defesa do seu imóvel contra a água da chuva. Veja o que você ganha:',
  items: [
    'Evita infiltrações, vazamentos e prejuízos no imóvel',
    'Aumenta a durabilidade da cobertura',
    'Protege seu patrimônio e valoriza o imóvel',
    'Evita reformas caras no futuro',
  ],
  ctaLabel: 'Solicite seu orçamento sem compromisso',
} as const;

/* -------------------------------------------------------------------------- */
/*  SOBRE                                                                       */
/* -------------------------------------------------------------------------- */

export const sobre = {
  title: 'Sobre o Fernando Luiz',
  paragraphs: [
    'Fernando Luiz é um profissional dedicado a calhas e rufos em Campinas e região, com foco em qualidade, pontualidade e atendimento próximo ao cliente.',
    'Cada serviço é tratado com atenção aos detalhes — do diagnóstico à instalação ou reparo — para que sua casa ou comércio fique protegido de verdade contra infiltrações e vazamentos.',
  ],
  highlights: [
    'Atendimento próximo e transparente',
    'Orçamento sem compromisso',
    'Foco em qualidade e durabilidade',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  GALERIA  (TROCAR: substitua pelos arquivos reais em /public/images)         */
/* -------------------------------------------------------------------------- */

export type GaleriaItem = {
  src: string;
  alt: string;
};

export const galeria: GaleriaItem[] = [
  { src: '/images/galeria-1.svg', alt: 'Calha instalada na borda do telhado de uma residência' },
  { src: '/images/galeria-2.svg', alt: 'Rufo metálico em acabamento de parede e cobertura' },
  { src: '/images/galeria-3.svg', alt: 'Limpeza de calha removendo folhas e detritos' },
  { src: '/images/galeria-4.svg', alt: 'Calha em galpão comercial de grande porte' },
  { src: '/images/galeria-5.svg', alt: 'Detalhe de vedação e impermeabilização de calha' },
  { src: '/images/galeria-6.svg', alt: 'Sistema de calhas e condutores em telhado residencial' },
];

/* -------------------------------------------------------------------------- */
/*  DEPOIMENTOS  (placeholders — troque por avaliações reais quando tiver)      */
/* -------------------------------------------------------------------------- */

export type Depoimento = {
  name: string;
  role: string;
  rating: number; // de 1 a 5
  text: string;
};

export const depoimentos: Depoimento[] = [
  {
    name: 'Marcos A.',
    role: 'Cliente residencial — Campinas',
    rating: 5,
    text: 'Serviço impecável! A calha estava transbordando toda chuva e o Fernando resolveu rápido e com capricho. Recomendo demais.',
  },
  {
    name: 'Patrícia S.',
    role: 'Comércio — Valinhos',
    rating: 5,
    text: 'Pontual, educado e muito profissional. Fez a manutenção das calhas do nosso galpão e o problema de infiltração acabou.',
  },
  {
    name: 'Roberto M.',
    role: 'Cliente residencial — Sumaré',
    rating: 5,
    text: 'Orçamento justo e trabalho bem feito. Explicou tudo com clareza e cumpriu o prazo combinado. Virou meu contato de confiança.',
  },
];

/* -------------------------------------------------------------------------- */
/*  ÁREA DE ATUAÇÃO                                                             */
/* -------------------------------------------------------------------------- */

export const areaAtuacao = {
  title: 'Área de atuação',
  text: 'Atendemos Campinas e região.',
  cities: [
    'Campinas',
    'Valinhos',
    'Vinhedo',
    'Sumaré',
    'Hortolândia',
    'Paulínia',
    'Nova Odessa',
    'Indaiatuba',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export type FaqItem = {
  question: string;
  answer: string;
};

export const faq: FaqItem[] = [
  {
    question: 'Vocês atendem residências e comércios?',
    answer:
      'Sim! Atendemos tanto residências quanto comércios, galpões e estabelecimentos. Cada projeto recebe a solução adequada ao tipo de imóvel.',
  },
  {
    question: 'O orçamento é gratuito?',
    answer:
      'Sim, o orçamento é totalmente gratuito e sem compromisso. Basta entrar em contato pelo WhatsApp que avaliamos a sua necessidade.',
  },
  {
    question: 'Quais regiões vocês atendem?',
    answer:
      'Atendemos Campinas e toda a região, incluindo cidades como Valinhos, Vinhedo, Sumaré, Hortolândia e Paulínia. Em caso de dúvida sobre a sua cidade, é só perguntar.',
  },
  {
    question: 'Com que frequência devo limpar as calhas?',
    answer:
      'O ideal é limpar as calhas pelo menos uma vez por ano, de preferência antes do período de chuvas. Em locais com muitas árvores ao redor, a limpeza pode ser necessária com mais frequência.',
  },
  {
    question: 'Vocês fazem manutenção preventiva?',
    answer:
      'Sim. A manutenção preventiva evita problemas maiores, prolonga a vida útil da cobertura e protege o seu imóvel contra infiltrações. Podemos orientar a melhor periodicidade para o seu caso.',
  },
];

/* -------------------------------------------------------------------------- */
/*  FORMULÁRIO DE CONTATO — opções do campo "Tipo de serviço"                   */
/* -------------------------------------------------------------------------- */

export const tiposDeServico = [
  'Instalação de Calhas e Rufos',
  'Limpeza de Calhas',
  'Manutenção',
  'Impermeabilização',
  'Vedações',
  'Atendimento a Comércios',
  'Outro / Não sei ainda',
] as const;

/* -------------------------------------------------------------------------- */
/*  SEO / METADADOS                                                             */
/* -------------------------------------------------------------------------- */

export const seo = {
  // TROCAR: ao publicar, coloque aqui a URL final do site (sem barra no fim).
  siteUrl: 'https://fernandoluizcalhas.com.br',
  title:
    'Calhas e Rufos em Campinas | Fernando Luiz — Instalação, Limpeza e Impermeabilização',
  description:
    'Instalação, manutenção, limpeza e impermeabilização de calhas e rufos em Campinas e região. Qualidade garantida. Solicite seu orçamento: (19) 99806-8683.',
  keywords: [
    'calhas Campinas',
    'rufos Campinas',
    'instalação de calhas',
    'limpeza de calhas',
    'impermeabilização de calhas',
    'manutenção de calhas',
    'calhas e rufos região de Campinas',
  ],
  ogImage: '/images/og-image.svg',
} as const;
