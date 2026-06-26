"use client";

import { Quote, Star } from "lucide-react";
import { Section, SectionHeading } from "./ui/Section";
import { RevealGroup, RevealItem } from "./ui/Reveal";

/**
 * TODO: substituir por depoimentos REAIS e AUTORIZADOS antes de publicar.
 * Os textos abaixo sao placeholders ILUSTRATIVOS — nao representam
 * pessoas reais e nao devem ir ao ar sem autorizacao do cliente.
 */
const DEPOIMENTOS = [
  {
    texto: "Resolveu meu problema na hora. Caiu via PIX no mesmo dia.",
    autor: "Cliente",
    local: "Batalha/AL",
  },
  {
    texto: "Atendimento de primeira e sem aquela burocracia de banco.",
    autor: "Cliente",
    local: "Sertão de Alagoas",
  },
  {
    texto:
      "Estava negativado e mesmo assim consegui meu crédito. Recomendo.",
    autor: "Cliente",
    local: "Batalha/AL",
  },
];

export function Depoimentos() {
  return (
    <Section tone="light">
      <SectionHeading
        eyebrow="Depoimentos"
        title="Quem já confiou na gente"
        subtitle="Histórias de quem precisava de crédito e foi bem atendido."
      />

      <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
        {DEPOIMENTOS.map((d, i) => (
          <RevealItem key={i}>
            <figure className="flex h-full flex-col rounded-3xl border border-mist bg-white p-7 shadow-card">
              <Quote
                className="h-9 w-9 text-roxo-500/30"
                aria-hidden
                fill="currentColor"
              />
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-ink/80">
                “{d.texto}”
              </blockquote>
              <div className="mt-5 flex gap-0.5" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 text-gold-500"
                    fill="currentColor"
                    aria-hidden
                  />
                ))}
              </div>
              <figcaption className="mt-4 border-t border-mist pt-4 text-sm">
                <span className="font-semibold text-ink">{d.autor}</span>
                <span className="text-ink/50"> · {d.local}</span>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Aviso de conformidade visivel discretamente. */}
      <p className="mt-8 text-center text-xs text-ink/40">
        Depoimentos ilustrativos. Serão substituídos por relatos reais e
        autorizados de clientes.
      </p>
    </Section>
  );
}
