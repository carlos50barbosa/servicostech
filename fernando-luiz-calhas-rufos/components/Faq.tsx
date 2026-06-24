'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { faq } from '@/lib/site-config';

/**
 * FAQ — acordeão acessível.
 * Cada item é um botão (<button>) que controla a visibilidade da resposta,
 * com os atributos aria-expanded / aria-controls para leitores de tela.
 * Edite as perguntas/respostas no array `faq` em lib/site-config.ts.
 */
export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <section id="faq" className="bg-light py-16 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Dúvidas frequentes"
          title="Perguntas e respostas"
          subtitle="Reunimos as dúvidas mais comuns. Se a sua não estiver aqui, é só chamar no WhatsApp."
        />

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <Reveal key={item.question} delay={index * 0.05}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                    isOpen ? 'border-gold/50 shadow-soft' : 'border-silver/40'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-heading text-base font-bold text-navy transition-colors hover:text-gold-dark sm:text-lg"
                    >
                      <span>{item.question}</span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                      >
                        <Plus className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={
                          reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }
                        }
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : { height: 'auto', opacity: 1 }
                        }
                        exit={
                          reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-base leading-relaxed text-muted">
                          {item.answer}
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
