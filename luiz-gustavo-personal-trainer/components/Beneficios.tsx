"use client";

import {
  Target,
  ShieldPlus,
  Activity,
  Flame,
  UserCog,
  HeartPulse,
} from "lucide-react";
import Reveal from "./Reveal";

const beneficios = [
  {
    icon: Target,
    title: "Resultados maximizados",
    desc: "Plano individual focado no seu objetivo, sem perder tempo com treinos genéricos.",
  },
  {
    icon: ShieldPlus,
    title: "Segurança e prevenção de lesões",
    desc: "Execução técnica correta dos movimentos, especialmente para iniciantes e pessoas com limitações.",
  },
  {
    icon: Activity,
    title: "Correção de postura e carga",
    desc: "Ajustes em tempo real para você treinar do jeito certo, do primeiro ao último movimento.",
  },
  {
    icon: Flame,
    title: "Motivação e disciplina",
    desc: "Constância e foco para você não desistir no meio do caminho.",
  },
  {
    icon: UserCog,
    title: "Treino 100% individualizado",
    desc: "Respeita suas necessidades, limitações e rotina — feito sob medida para você.",
  },
  {
    icon: HeartPulse,
    title: "Estilo de vida saudável",
    desc: "Orientação sobre hábitos, descanso e integração com nutrição.",
  },
];

export default function Beneficios() {
  return (
    <section className="relative bg-ink-soft py-20 md:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mb-4">Por que ter um personal</span>
          <h2 className="headline text-3xl text-cloud sm:text-4xl">
            Por que treinar com{" "}
            <span className="text-gradient">acompanhamento profissional?</span>
          </h2>
          <p className="mt-4 text-muted">
            Cada detalhe do acompanhamento existe para te levar mais longe — com
            segurança e resultados que se mantêm.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {beneficios.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08} as="article">
              <div className="card-dark h-full">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10">
                  <Icon className="h-6 w-6 text-brand" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-cloud">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
