"use client";

import {
  Search,
  Zap,
  CreditCard,
  FileX,
  BadgeCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "./ui/Section";
import { RevealGroup, RevealItem } from "./ui/Reveal";

type Diferencial = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const ITENS: Diferencial[] = [
  {
    icon: Search,
    title: "Sem consulta ao SPC e Serasa",
    desc: "Nome restrito não é problema aqui. Sua liberação não depende do seu score.",
  },
  {
    icon: Zap,
    title: "Liberação via PIX",
    desc: "Aprovação rápida e dinheiro na sua conta no mesmo dia, sem fila e sem espera.",
  },
  {
    icon: CreditCard,
    title: "Parcele em até 18x",
    desc: "Condições flexíveis que cabem no seu orçamento, com uma das menores taxas do mercado.",
  },
  {
    icon: FileX,
    title: "Sem comprovação de renda",
    desc: "Use o limite do seu cartão de crédito ou débito — simples assim, sem papelada.",
  },
  {
    icon: BadgeCheck,
    title: "Credenciado e autorizado",
    desc: "Atendimento seguro, transparente e feito por quem entende do assunto.",
  },
  {
    icon: Wallet,
    title: "Aceitamos todos os cartões",
    desc: "Crédito ou débito, qualquer bandeira com limite disponível é bem-vinda.",
  },
];

export function Diferenciais() {
  return (
    <Section id="diferenciais" tone="light">
      <SectionHeading
        eyebrow="Diferenciais"
        title="Por que escolher a Rodolfo Souza Crédito"
        subtitle="Crédito de verdade, sem as barreiras do banco tradicional. Veja o que torna o nosso atendimento diferente."
      />

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITENS.map(({ icon: Icon, title, desc }) => (
          <RevealItem key={title}>
            <article className="group h-full rounded-3xl border border-mist bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-roxo-500/30 hover:shadow-soft-lg">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-roxo-700/8 text-roxo-700 transition-colors group-hover:bg-gradient-roxo group-hover:text-white">
                <Icon className="h-7 w-7" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink/65">{desc}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
