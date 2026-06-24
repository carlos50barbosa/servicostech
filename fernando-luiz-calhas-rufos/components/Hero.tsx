'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { hero, buildWhatsAppLink } from '@/lib/site-config';
import { withBasePath } from '@/lib/base-path';

/**
 * Hero — primeira dobra. Fundo azul-marinho com headline forte, dois CTAs,
 * faixa de prova rápida e imagem/ilustração de calha em telhado.
 */
export default function Hero() {
  const reduceMotion = useReducedMotion();

  // Animação de entrada escalonada (desativada se o usuário prefere menos movimento)
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.12 },
    },
  };
  const item = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-navy-gradient text-white"
    >
      {/* Detalhes decorativos de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
        {/* Linha metálica dourada de marca */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gold-gradient opacity-70" />
      </div>

      <div className="container relative grid items-center gap-12 pb-16 pt-28 sm:pt-32 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-36">
        {/* Coluna de texto */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-gold"
          >
            Calhas e Rufos · Campinas e região
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 font-heading text-4xl font-extrabold uppercase leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 text-lg leading-relaxed text-silver"
          >
            {hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
            <a href="#servicos" className="btn-outline">
              Ver Serviços
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </motion.div>

          {/* Faixa de prova rápida */}
          <motion.ul
            variants={item}
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3"
          >
            {hero.proofPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 font-heading text-sm font-semibold text-silver"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-navy">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Coluna da imagem */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 shadow-soft-lg">
            {/* TROCAR: imagem real do cliente (calha em telhado) */}
            <Image
              src={withBasePath('/images/hero.svg')}
              alt="Calha metálica recém-instalada na borda de um telhado residencial"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Selo flutuante "Qualidade Garantida" */}
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white p-4 text-navy shadow-soft-lg sm:left-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-gradient">
              <Check className="h-6 w-6 text-navy" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="font-heading text-sm font-extrabold uppercase">
                Qualidade Garantida
              </p>
              <p className="text-xs text-muted">Materiais e acabamento de primeira</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Onda/divisória inferior para transição suave com a próxima seção */}
      <div aria-hidden="true" className="relative">
        <svg
          className="block w-full"
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M0 60 L1440 60 L1440 0 C1080 40 360 40 0 0 Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
}
