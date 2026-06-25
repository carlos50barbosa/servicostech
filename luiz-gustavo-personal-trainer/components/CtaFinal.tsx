"use client";

import { MessageCircle, MapPin, Laptop } from "lucide-react";
import Reveal from "./Reveal";
import { whatsappLink, BUSINESS } from "@/lib/config";

export default function CtaFinal() {
  return (
    <section id="contato" className="relative overflow-hidden bg-ink py-20 md:py-28">
      {/* Brilho de fundo */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[140px]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-ink-soft to-ink p-8 text-center shadow-card sm:p-14">
            <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />

            <div className="relative">
              <span className="eyebrow mb-4 justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-health" />
                Comece hoje
              </span>
              <h2 className="headline mx-auto max-w-3xl text-3xl text-cloud sm:text-4xl lg:text-5xl">
                Pronto para transformar seu corpo e sua{" "}
                <span className="text-gradient">saúde?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted">
                Dê o primeiro passo hoje. Vamos montar juntos o plano ideal para
                você alcançar seus objetivos com segurança e acompanhamento
                profissional.
              </p>

              <div className="mt-9 flex justify-center">
                <a
                  href={whatsappLink(
                    "Olá Luiz! Estou pronto(a) para começar. Vamos montar o meu plano?"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary animate-pulse-glow px-9 py-4 text-base"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Falar no WhatsApp agora
                </a>
              </div>

              {/* Reforço de credibilidade */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                  Presencial em {BUSINESS.cityFull}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-brand" aria-hidden="true" />
                  Consultoria online
                </span>
                <span>CREF {BUSINESS.cref}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
