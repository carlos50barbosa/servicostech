"use client";

import {
  Scale,
  Dumbbell,
  Stethoscope,
  Sprout,
  Accessibility,
  Sun,
} from "lucide-react";
import Reveal from "./Reveal";

const publicos = [
  {
    icon: Scale,
    title: "Quem quer emagrecer",
    desc: "Perder peso com saúde e constância, sem dietas malucas nem soluções mágicas.",
  },
  {
    icon: Dumbbell,
    title: "Ganho de massa muscular",
    desc: "Hipertrofia e definição treinando do jeito certo, com técnica e progressão.",
  },
  {
    icon: Stethoscope,
    title: "Reabilitação",
    desc: "Treino para condições específicas, respeitando seus limites e a sua recuperação.",
  },
  {
    icon: Sprout,
    title: "Iniciantes",
    desc: "Quem quer começar do jeito certo, sem medo de errar e com acompanhamento próximo.",
  },
  {
    icon: Accessibility,
    title: "Terceira idade",
    desc: "Mais força, mobilidade e qualidade de vida para o dia a dia.",
  },
  {
    icon: Sun,
    title: "Mais saúde e bem-estar",
    desc: "Quem busca energia, disposição e bem-estar no dia a dia.",
  },
];

export default function ParaQuem() {
  return (
    <section className="relative bg-ink py-20 md:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mb-4">Para quem é</span>
          <h2 className="headline text-3xl text-cloud sm:text-4xl">
            Para quem é o <span className="text-gradient">meu trabalho?</span>
          </h2>
          <p className="mt-4 text-muted">
            Independente do seu ponto de partida, existe um plano certo para você.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publicos.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08} as="article">
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/5 bg-ink-soft p-5 transition-all duration-300 hover:border-health/40">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-health/10 transition-colors group-hover:bg-health/20">
                  <Icon className="h-6 w-6 text-health" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wide text-cloud">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
