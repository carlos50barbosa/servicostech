"use client";

import { MessageCircle, Quote } from "lucide-react";
import Reveal from "./Reveal";
import { whatsappLink } from "@/lib/config";

export default function FraseImpacto() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      {/* Fundo: gradiente laranja + textura.
          TODO (opcional): trocar por uma foto de treino escurecida como background.
          Ex.: adicionar <Image fill className="object-cover opacity-30" .../> antes do overlay. */}
      <div className="absolute inset-0 bg-brand-gradient" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_100%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />

      <div className="container-site relative text-center">
        <Reveal>
          <Quote
            className="mx-auto mb-6 h-10 w-10 text-white/80"
            aria-hidden="true"
          />
          <blockquote className="mx-auto max-w-4xl">
            <p className="headline text-2xl text-white sm:text-3xl lg:text-4xl">
              &ldquo;Nenhum objetivo é inatingível quando se tem metas, planos e
              força de vontade.&rdquo;
            </p>
          </blockquote>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href={whatsappLink(
              "Olá Luiz! Vamos traçar o meu plano? Quero alcançar meus objetivos."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-cloud shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-black"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Vamos traçar o seu plano
          </a>
        </Reveal>
      </div>
    </section>
  );
}
