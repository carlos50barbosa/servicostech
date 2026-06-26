"use client";

import { AnimatedCounter } from "./ui/AnimatedCounter";
import { Container } from "./ui/Container";
import { RevealGroup, RevealItem } from "./ui/Reveal";

// Estatisticas de impacto. `numeric` controla se ha contador animado.
const STATS = [
  { value: 18, suffix: "x", label: "Parcelamento máximo", numeric: true },
  { value: 0, suffix: "", label: "Consultas ao SPC/Serasa", numeric: true },
  { text: "PIX", label: "Liberação na hora", numeric: false },
  { value: 100, suffix: "%", label: "Sem comprovação de renda", numeric: true },
];

export function Stats() {
  return (
    <section className="bg-cloud pb-4">
      <Container>
        <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-mist shadow-soft lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <RevealItem
              key={i}
              className="flex flex-col items-center justify-center bg-white px-4 py-8 text-center sm:py-10"
            >
              <div className="font-display text-4xl font-extrabold text-gradient-roxo sm:text-5xl">
                {stat.numeric ? (
                  <AnimatedCounter to={stat.value!} suffix={stat.suffix} />
                ) : (
                  <span className="text-gradient-gold">{stat.text}</span>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-ink/60">{stat.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
