"use client";

import { Check, MessageCircle } from "lucide-react";
import { Section, SectionHeading } from "./ui/Section";
import { ButtonLink } from "./ui/Button";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { CreditCard } from "./CreditCard";
import { WA } from "@/lib/config";

const ITENS = [
  "Está com o nome negativado e precisa de crédito",
  "É autônomo e não tem comprovação de renda formal",
  "Precisa de dinheiro rápido, sem burocracia",
  "Quer transformar o limite do cartão em dinheiro na conta",
  "Cansou de ser barrado por banco tradicional",
];

export function ParaQuemE() {
  return (
    <Section id="para-quem" tone="white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Coluna de texto + checks */}
        <div>
          <SectionHeading
            eyebrow="Para quem é"
            title="Feito pra você que..."
            align="left"
          />
          <RevealGroup className="mt-8 space-y-4">
            {ITENS.map((item) => (
              <RevealItem key={item}>
                <div className="flex items-start gap-4 rounded-2xl border border-mist bg-cloud p-4 transition-colors hover:border-green-500/40">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/12 text-green-500">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="font-medium text-ink/80">{item}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <ButtonLink href={WA.geral()} variant="gold" size="lg" className="mt-8">
            <MessageCircle className="h-5 w-5" aria-hidden />
            Falar com a gente agora
          </ButtonLink>
        </div>

        {/* Coluna visual */}
        <Reveal className="flex justify-center lg:justify-end" y={32}>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[2.5rem] bg-gradient-roxo opacity-10 blur-2xl"
            />
            <div className="relative animate-float">
              <CreditCard />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
