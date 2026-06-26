"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";
import { Section, SectionHeading } from "./ui/Section";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { WA } from "@/lib/config";
import { cn } from "@/lib/cn";

const PERGUNTAS = [
  {
    q: "Preciso de comprovação de renda?",
    a: "Não. Trabalhamos com o limite do seu cartão de crédito ou débito, sem exigir comprovação de renda.",
  },
  {
    q: "Vocês consultam SPC ou Serasa?",
    a: "Não fazemos consulta ao SPC nem ao Serasa. Estar negativado não impede sua liberação.",
  },
  {
    q: "Em quanto tempo eu recebo?",
    a: "Após a aprovação, o valor é liberado via PIX no mesmo dia.",
  },
  {
    q: "Em quantas vezes posso parcelar?",
    a: "Em até 18x, com condições que cabem no seu bolso.",
  },
  {
    q: "Quais cartões são aceitos?",
    a: "Aceitamos todos os tipos de cartão de crédito e débito com limite disponível.",
  },
  {
    q: "A simulação tem algum custo?",
    a: "Não. A simulação é gratuita e sem compromisso.",
  },
];

export function FAQ() {
  // Accordion acessivel: um item aberto por vez.
  const [aberto, setAberto] = useState<number | null>(0);

  return (
    <Section id="faq" tone="white">
      <SectionHeading
        eyebrow="Dúvidas"
        title="Perguntas frequentes"
        subtitle="Tirou a dúvida? Chama no WhatsApp e dá o próximo passo."
      />

      <Reveal className="mx-auto mt-12 max-w-3xl">
        <ul className="space-y-3">
          {PERGUNTAS.map((item, i) => {
            const isOpen = aberto === i;
            const painelId = `faq-painel-${i}`;
            const botaoId = `faq-botao-${i}`;
            return (
              <li
                key={item.q}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-white transition-colors",
                  isOpen ? "border-roxo-500/40 shadow-soft" : "border-mist"
                )}
              >
                <h3>
                  <button
                    id={botaoId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={painelId}
                    onClick={() => setAberto(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="font-display text-base font-bold text-ink sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isOpen
                          ? "rotate-45 bg-gradient-roxo text-white"
                          : "bg-mist text-roxo-700"
                      )}
                    >
                      <Plus className="h-5 w-5" aria-hidden />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={painelId}
                      role="region"
                      aria-labelledby={botaoId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 leading-relaxed text-ink/65 sm:px-6">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl bg-cloud p-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-medium text-ink/75">
            Ainda com dúvidas? A gente responde rapidinho.
          </p>
          <ButtonLink href={WA.geral()} variant="roxo" size="md">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Falar no WhatsApp
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
