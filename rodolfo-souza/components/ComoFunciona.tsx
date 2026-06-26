"use client";

import { MessageSquare, FileText, CheckCircle2, Banknote } from "lucide-react";
import { Section, SectionHeading } from "./ui/Section";
import { ButtonLink } from "./ui/Button";
import { RevealGroup, RevealItem } from "./ui/Reveal";
import { WA } from "@/lib/config";

const PASSOS = [
  {
    icon: MessageSquare,
    title: "Simule sem compromisso",
    desc: "Fale com a gente no WhatsApp e descubra suas condições em minutos. Sem custo.",
  },
  {
    icon: FileText,
    title: "Envie seus dados",
    desc: "Processo rápido, simples e seguro. Sem burocracia e sem comprovação de renda.",
  },
  {
    icon: CheckCircle2,
    title: "Aprovação na hora",
    desc: "Análise ágil, sem consulta ao SPC ou Serasa.",
  },
  {
    icon: Banknote,
    title: "Receba via PIX",
    desc: "Dinheiro liberado direto na sua conta. Pronto pra usar.",
  },
];

export function ComoFunciona() {
  return (
    <Section id="como-funciona" tone="white">
      <SectionHeading
        eyebrow="Como funciona"
        title="Do contato ao PIX em 4 passos simples"
        subtitle="Sem fila de banco, sem papelada e sem complicação. Veja como é fácil."
      />

      <div className="relative mt-16">
        {/* Linha conectora (desktop) */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-roxo-500/30 to-transparent lg:block"
        />

        <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PASSOS.map(({ icon: Icon, title, desc }, i) => (
            <RevealItem key={title} className="relative">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-roxo text-white shadow-soft">
                  <Icon className="h-7 w-7" aria-hidden />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-gold text-sm font-bold text-navy-900 shadow-gold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink/65">{desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <div className="mt-14 flex justify-center">
        <ButtonLink href={WA.comoFunciona()} variant="roxo" size="lg">
          Começar minha simulação
        </ButtonLink>
      </div>
    </Section>
  );
}
