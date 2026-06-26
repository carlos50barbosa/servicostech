"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { Reveal } from "./ui/Reveal";
import { WA } from "@/lib/config";

export function CTAFinal() {
  return (
    <section className="bg-cloud py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-hero px-6 py-14 text-center shadow-soft-lg sm:px-12 sm:py-20">
            {/* Brilhos decorativos */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-grid opacity-40" />
              <div className="absolute -left-10 top-0 h-60 w-60 rounded-full bg-roxo-500/30 blur-[100px]" />
              <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-gold-500/25 blur-[110px]" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-gold-400 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" aria-hidden />
                Resposta rápida, sem compromisso
              </span>
              <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Seu crédito está a uma{" "}
                <span className="text-gradient-gold">mensagem de distância</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/75">
                Simule agora, sem compromisso. Resposta rápida no WhatsApp.
              </p>
              <div className="mt-9 flex justify-center">
                <ButtonLink href={WA.simular()} variant="gold" size="lg">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                  Falar no WhatsApp agora
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
