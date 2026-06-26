"use client";

import { ShieldCheck, Handshake, TrendingDown, MapPin } from "lucide-react";
import { Section } from "./ui/Section";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { ENDERECO } from "@/lib/config";

const PILARES = [
  { icon: ShieldCheck, label: "Seguro e transparente" },
  { icon: TrendingDown, label: "Uma das menores taxas" },
  { icon: Handshake, label: "Atendimento humano" },
  { icon: MapPin, label: `${ENDERECO.cidade} e região` },
];

export function Sobre() {
  return (
    <Section tone="dark" className="overflow-hidden">
      {/* Fundo decorativo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-roxo-500/20 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-gold-500/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-gold-400">
            Sobre nós
          </span>
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            Crédito com quem entende do assunto
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            A Rodolfo Souza Crédito atua em {ENDERECO.cidade} e região do{" "}
            {ENDERECO.regiao} oferecendo crédito facilitado de forma rápida,
            segura e transparente. Somos credenciados e autorizados, e nosso
            compromisso é simples: liberar seu crédito sem burocracia, com
            atendimento humano e uma das menores taxas do mercado.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PILARES.map(({ icon: Icon, label }) => (
            <RevealItem key={label}>
              <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-navy-900">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="text-sm font-medium text-white/85">
                  {label}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
