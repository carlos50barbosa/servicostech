"use client";

import { MapPin, Laptop, Goal, Salad, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/config";

const servicos = [
  {
    icon: MapPin,
    title: "Personal Training Presencial",
    badge: "Batalha-AL",
    desc: "Acompanhamento individual e próximo, com correção em tempo real e ajustes de carga a cada sessão.",
    msg: "Olá Luiz! Tenho interesse no Personal Training Presencial em Batalha-AL.",
    featured: false,
  },
  {
    icon: Laptop,
    title: "Consultoria Online",
    badge: "Onde você estiver",
    desc: "Treino montado para o seu objetivo, com acompanhamento à distância, onde quer que você esteja.",
    msg: "Olá Luiz! Quero saber mais sobre a Consultoria Online.",
    featured: true,
  },
  {
    icon: Goal,
    title: "Treino para objetivo específico",
    badge: "Sob medida",
    desc: "Emagrecimento, hipertrofia ou reabilitação, com um plano sob medida para a sua meta.",
    msg: "Olá Luiz! Quero um treino para um objetivo específico (emagrecimento/hipertrofia/reabilitação).",
    featured: false,
  },
  {
    icon: Salad,
    title: "Acompanhamento integrado",
    badge: "Hábitos + nutrição",
    desc: "Orientação de hábitos e descanso, com parceria de nutricionistas quando necessário.",
    msg: "Olá Luiz! Quero saber sobre o acompanhamento integrado (hábitos e nutrição).",
    featured: false,
  },
];

export default function Servicos() {
  return (
    <section id="servicos" className="relative bg-ink-soft py-20 md:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mb-4">Serviços</span>
          <h2 className="headline text-3xl text-cloud sm:text-4xl">
            Como posso <span className="text-gradient">te ajudar</span>
          </h2>
          <p className="mt-4 text-muted">
            Escolha o formato que combina com a sua rotina — todos com a mesma
            atenção aos detalhes.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {servicos.map(({ icon: Icon, title, badge, desc, msg, featured }, i) => (
            <Reveal key={title} delay={(i % 2) * 0.1} as="article">
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-7 shadow-card transition-all duration-300 ${
                  featured
                    ? "border-brand/50 bg-gradient-to-br from-ink to-ink-soft hover:shadow-glow"
                    : "border-white/5 bg-ink hover:border-brand/30"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-glow-sm">
                    Diferencial
                  </span>
                )}

                <div className="mb-5 flex items-center gap-4">
                  <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-brand/10">
                    <Icon className="h-7 w-7 text-brand" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {badge}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-cloud">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {desc}
                </p>

                <a
                  href={whatsappLink(msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:text-brand-light"
                >
                  Saber mais
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
