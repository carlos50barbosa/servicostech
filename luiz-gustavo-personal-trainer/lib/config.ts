/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL — edite aqui antes de publicar
 * ============================================================================
 *
 *  Este arquivo concentra TODOS os dados editáveis do site (WhatsApp, Instagram,
 *  textos principais, dados do negócio). Não é preciso mexer nos componentes.
 */

/* ----------------------------------------------------------------------------
 * ⚠️ WHATSAPP — CONFIRME O NÚMERO ANTES DE PUBLICAR
 * ----------------------------------------------------------------------------
 * O link do perfil aparece como "wa.me/551182998350306", mas esse número tem
 * dígitos a mais (Batalha-AL usa DDD 82). O formato provável correto é:
 *
 *      55  (Brasil)  +  82 (DDD Alagoas)  +  9 9835 0306  ->  5582998350306
 *
 * Confira o número real do Luiz e ajuste a constante abaixo.
 * Formato esperado: apenas dígitos, com código do país (55) + DDD + número.
 */
export const WHATSAPP_NUMBER = "5582998350306"; // ⚠️ CONFIRMAR/SUBSTITUIR

/** Mensagem pré-preenchida ao abrir o WhatsApp. */
export const WHATSAPP_MESSAGE =
  "Olá Luiz! Vim pela sua landing page e quero saber mais sobre o acompanhamento.";

/** Monta um link de WhatsApp com mensagem pré-preenchida (opcionalmente personalizada). */
export function whatsappLink(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Link padrão de WhatsApp (usado na maioria dos CTAs). */
export const WHATSAPP = whatsappLink();

/* ----------------------------------------------------------------------------
 * Redes sociais e contato
 * -------------------------------------------------------------------------- */
export const INSTAGRAM_HANDLE = "personaltrainer_luizgustavo";
export const INSTAGRAM = `https://instagram.com/${INSTAGRAM_HANDLE}`;

/* ----------------------------------------------------------------------------
 * Dados do negócio (usados em textos, footer e JSON-LD para SEO)
 * -------------------------------------------------------------------------- */
export const BUSINESS = {
  name: "Luiz Gustavo",
  role: "Personal Trainer",
  tagline: "Personal Trainer",
  cref: "003920-G/AL",
  formacao: "Licenciado e Bacharel em Educação Física",
  city: "Batalha",
  state: "AL",
  cityFull: "Batalha-AL",
  serviceArea: "Batalha-AL e região",
  attendance: "Atendimento presencial e online",
  // URL final do site em produção (ajuste após o deploy na Vercel).
  siteUrl: "https://luizgustavo-personal.vercel.app",
} as const;

/* ----------------------------------------------------------------------------
 * Itens de navegação (header e footer) — âncoras com scroll suave
 * -------------------------------------------------------------------------- */
export const NAV_LINKS = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
] as const;
