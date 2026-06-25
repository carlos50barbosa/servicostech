"use client";

import { ClipboardList, PencilRuler, TrendingUp, Trophy } from "lucide-react";
import Reveal from "./Reveal";

const passos = [
  {
    icon: ClipboardList,
    title: "Avaliação inicial",
    desc: "Conversamos sobre seu histórico, objetivos e limitações (anamnese) para entender o seu ponto de partida.",
  },
  {
    icon: PencilRuler,
    title: "Plano individualizado",
    desc: "Monto um treino sob medida para a sua realidade, rotina e metas — nada de plano genérico.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhamento e ajustes",
    desc: "Correção de execução, evolução de cargas e ajustes contínuos para você evoluir com segurança.",
  },
  {
    icon: Trophy,
    title: "Resultados que duram",
    desc: "Você cria uma rotina saudável e sustentável, com resultados consistentes a longo prazo.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="relative bg-ink py-20 md:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mb-4">Metodologia</span>
          <h2 className="headline text-3xl text-cloud sm:text-4xl">
            Como funciona o{" "}
            <span className="text-gradient">acompanhamento</span>
          </h2>
          <p className="mt-4 text-muted">
            Um processo simples e estruturado, do primeiro contato aos resultados
            duradouros.
          </p>
        </Reveal>

        <ol className="relative mt-16 grid gap-8 md:grid-cols-4 md:gap-6">
          {/* Linha conectora (desktop) */}
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent md:block"
            aria-hidden="true"
          />
          {passos.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1} as="li">
              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/30 bg-ink shadow-glow-sm">
                  <Icon className="h-6 w-6 text-brand" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient text-xs font-extrabold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-cloud">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
