const projects = [
  {
    slug: "site-para-clinica",
    name: "Clínica Vida Plena",
    category: "Clínica premium",
    description:
      "Site institucional para clínica com apresentação das especialidades, autoridade médica e captação direta pelo WhatsApp.",
    objective:
      "Criar uma presença digital confiável para transformar visitantes em pacientes interessados, com navegação simples e mensagens claras de atendimento.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=85",
    features: [
      "Páginas de especialidades",
      "Agendamento via WhatsApp",
      "SEO local para buscas regionais",
      "Apresentação de equipe e estrutura",
      "Depoimentos e prova social"
    ],
    technologies: ["HTML semântico", "CSS responsivo", "SEO on-page", "Schema LocalBusiness", "Integração WhatsApp"],
    differentials: [
      "Visual limpo e confiável para área da saúde",
      "Hierarquia de conteúdo pensada para conversão",
      "Experiência otimizada para celular"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1581091870622-1e7e19f08eba?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    slug: "landing-page-profissional",
    name: "Studio Bella",
    category: "Landing page profissional",
    description:
      "Landing page elegante para serviços de beleza, com oferta clara, prova social e CTA direto para reservas pelo WhatsApp.",
    objective:
      "Aumentar a procura por serviços do estúdio e facilitar reservas rápidas por meio de uma página visualmente premium.",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1400&q=85",
    features: [
      "Seção de serviços e preços",
      "Destaque para promoções",
      "Depoimentos de clientes",
      "CTA de reserva sempre visível",
      "Layout otimizado para campanhas"
    ],
    technologies: ["HTML", "CSS moderno", "Design responsivo", "Performance web", "WhatsApp CTA"],
    differentials: [
      "Design visual forte para campanhas de tráfego pago",
      "Seções curtas e persuasivas",
      "Apresentação premium dos serviços"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    slug: "site-para-advogado",
    name: "Prime Advocacia",
    category: "Site para advogado",
    description:
      "Site institucional sóbrio para escritório de advocacia, com áreas de atuação, perfil profissional e contato qualificado.",
    objective:
      "Transmitir autoridade, segurança e clareza para potenciais clientes que procuram atendimento jurídico especializado.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
    features: [
      "Áreas de atuação organizadas",
      "Perfil profissional do advogado",
      "Formulário de triagem",
      "Botões de contato rápido",
      "Estrutura preparada para SEO"
    ],
    technologies: ["HTML semântico", "CSS responsivo", "SEO jurídico", "Open Graph", "Schema ProfessionalService"],
    differentials: [
      "Tom visual institucional e premium",
      "Conteúdo estruturado para tomada de decisão",
      "CTA consultivo sem aparência agressiva"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85"
    ]
  },
  {
    slug: "sistema-de-agendamentos",
    name: "AgendaPro Serviços",
    category: "Sistema de agendamentos",
    description:
      "Página de apresentação para sistema de agendamentos online com fluxo de reserva, lembretes e gestão de horários.",
    objective:
      "Demonstrar uma solução prática para negócios que precisam receber agendamentos, reduzir faltas e organizar atendimentos.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=85",
    features: [
      "Agenda online responsiva",
      "Integração com WhatsApp",
      "Confirmação de horários",
      "Painel administrativo",
      "Apresentação de planos e benefícios"
    ],
    technologies: ["Node.js", "HTML", "CSS", "Integração WhatsApp", "Design system responsivo"],
    differentials: [
      "Fluxo claro para serviços recorrentes",
      "Página preparada para explicar software e conversão",
      "Boa leitura em desktop e celular"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=85"
    ]
  }
];

function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

module.exports = {
  projects,
  getProjectBySlug
};
