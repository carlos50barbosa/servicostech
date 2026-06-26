"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Zap,
  HeartHandshake,
  MessageCircle,
  ArrowDown,
  Banknote,
} from "lucide-react";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { CreditCard } from "./CreditCard";
import { WA } from "@/lib/config";

const SELOS = [
  { icon: ShieldCheck, label: "Credenciado e autorizado" },
  { icon: Search, label: "Sem consulta SPC/Serasa" },
  { icon: Zap, label: "Liberação via PIX" },
  { icon: HeartHandshake, label: "Atendimento humano" },
];

// Animacao de entrada escalonada do bloco de texto.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-[72px] text-white">
      {/* Camadas decorativas de fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-roxo-500/30 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold-500/20 blur-[130px]" />
      </div>

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-28">
        {/* Coluna de texto */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/85 backdrop-blur-sm"
          >
            <Banknote className="h-4 w-4 text-gold-400" aria-hidden />
            Crédito facilitado em Batalha e região
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Crédito facilitado com as{" "}
            <span className="text-gradient-gold">melhores taxas</span> do mercado
            pra você
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-lg leading-relaxed text-white/75"
          >
            Transforme o limite do seu cartão em dinheiro na sua conta. Liberação
            via PIX, parcelamento em até 18x — sem consulta ao SPC ou Serasa e sem
            comprovação de renda.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href={WA.simular()} variant="gold" size="lg">
              <MessageCircle className="h-5 w-5" aria-hidden />
              Quero simular no WhatsApp
            </ButtonLink>
            <ButtonLink href="#como-funciona" variant="outlineLight" size="lg">
              Como funciona
              <ArrowDown className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </motion.div>

          {/* Selos de confianca */}
          <motion.ul
            variants={item}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          >
            {SELOS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-white/80"
              >
                <Icon className="h-4 w-4 text-green-500" aria-hidden />
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Coluna visual: cartao flutuante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: -4 }}
          transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.3 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="animate-float">
            <CreditCard />
          </div>
        </motion.div>
      </Container>

      {/* Onda de transicao para a secao clara seguinte */}
      <div aria-hidden className="relative -mb-px">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="h-12 w-full sm:h-16"
        >
          <path d="M0 80 L1440 80 L1440 30 C1080 75 360 -10 0 35 Z" fill="#F8F7FB" />
        </svg>
      </div>
    </section>
  );
}
