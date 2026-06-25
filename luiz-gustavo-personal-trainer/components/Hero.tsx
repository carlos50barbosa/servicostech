"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, ArrowDown, ShieldCheck, MapPin, Award } from "lucide-react";
import { WHATSAPP, whatsappLink } from "@/lib/config";
import { withBasePath } from "@/lib/base-path";

const badges = [
  { icon: Award, label: "Licenciado e Bacharel em Educação Física" },
  { icon: ShieldCheck, label: "CREF 003920-G/AL" },
  { icon: MapPin, label: "Atendimento Presencial e Online" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-hero-fade pt-28 md:pt-36"
    >
      {/* Camadas de fundo: grade sutil + brilho laranja */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-site relative grid items-center gap-12 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28">
        {/* Coluna de texto */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-health" />
            Treinar é sobre saúde
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="headline text-4xl text-cloud sm:text-5xl lg:text-6xl"
          >
            Treinar não é só sobre{" "}
            <span className="text-gradient">estética</span>.
            <br />É sobre <span className="text-gradient">saúde</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Acompanhamento profissional e individualizado para você alcançar seus
            objetivos com segurança, técnica e resultados que duram. Presencial em
            Batalha-AL ou online, onde você estiver.
          </motion.p>

          {/* Botões */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href={whatsappLink(
                "Olá Luiz! Quero começar agora. Pode me contar como funciona o acompanhamento?"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Quero começar agora
            </a>
            <a href="#sobre" className="btn-secondary">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
              Conheça meu trabalho
            </a>
          </motion.div>

          {/* Selos de credibilidade */}
          <motion.ul
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {badges.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-cloud backdrop-blur"
              >
                <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Coluna da imagem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink shadow-card">
            {/* Foto profissional do Luiz. Para trocar, substitua o arquivo
                /public/perfil-luiz-gustavo.png (proporção 4:5, ex.: 800x1000px). */}
            <Image
              src={withBasePath("/perfil-luiz-gustavo.png")}
              alt="Luiz Gustavo, personal trainer"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="scale-[1.04] object-cover object-center brightness-[0.97] contrast-[1.06] saturate-[1.08]"
            />
            {/* Tratamento de cor: vinheta escura nas bordas (some as laterais claras) */}
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_38%,transparent_42%,rgba(11,11,13,0.72)_100%)]"
              aria-hidden="true"
            />
            {/* Degradê inferior: integra a foto ao fundo escuro da página */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent"
              aria-hidden="true"
            />
            {/* Brilho sutil da marca + borda interna */}
            <div
              className="pointer-events-none absolute inset-0 bg-brand/5 mix-blend-overlay"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
          </div>

          {/* Cartão flutuante de destaque */}
          <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-ink/90 px-5 py-4 shadow-card backdrop-blur sm:block">
            <p className="text-2xl font-extrabold text-cloud">100%</p>
            <p className="text-xs text-muted">Treino individualizado</p>
          </div>
        </motion.div>
      </div>

      {/* CTA flutuante secundário só no mobile */}
      <a href={WHATSAPP} className="sr-only">
        Falar no WhatsApp
      </a>
    </section>
  );
}
