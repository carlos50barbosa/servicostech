"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Preciso ter experiência para começar?",
    a: "Não. O treino é adaptado para iniciantes, com foco em segurança e na execução correta dos movimentos. Você começa no seu ritmo, com acompanhamento próximo.",
  },
  {
    q: "Você atende online?",
    a: "Sim. Ofereço consultoria online com treino individualizado e acompanhamento à distância, onde quer que você esteja.",
  },
  {
    q: "Em quanto tempo vejo resultados?",
    a: "Depende dos seus objetivos e da sua constância, mas o acompanhamento foca em resultados consistentes e duradouros, não em soluções mágicas.",
  },
  {
    q: "Você trabalha com idosos ou pessoas com limitações?",
    a: "Sim. O treino respeita as limitações de cada pessoa e é montado de forma individualizada, sempre priorizando a segurança.",
  },
  {
    q: "Você trabalha junto com nutricionista?",
    a: "Quando necessário, atuo em conjunto com nutricionistas para otimizar os seus resultados e construir um estilo de vida saudável.",
  },
  {
    q: "Como faço para começar?",
    a: "É só chamar no WhatsApp para conversarmos sobre os seus objetivos. A partir daí montamos juntos o plano ideal para você.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-ink py-20 md:py-28">
      <div className="container-site max-w-3xl">
        <Reveal className="text-center">
          <span className="eyebrow mb-4">Dúvidas frequentes</span>
          <h2 className="headline text-3xl text-cloud sm:text-4xl">
            Perguntas <span className="text-gradient">frequentes</span>
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqs.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q} delay={i * 0.05}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/5"
                    >
                      <span className="text-base font-semibold text-cloud">
                        {q}
                      </span>
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand/10 text-brand">
                        {isOpen ? (
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                          {a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
