import { Star, Quote } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { depoimentos } from '@/lib/site-config';

/**
 * Depoimentos — 3 cards com nota em estrelas e nome do cliente.
 * Os dados ficam no array `depoimentos` em lib/site-config.ts (fácil de editar).
 */
export default function Depoimentos() {
  return (
    <section id="depoimentos" className="bg-light py-16 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Quem confia, recomenda"
          title="O que dizem nossos clientes"
          subtitle="A satisfação de quem já protegeu o imóvel com a gente."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {depoimentos.map((depoimento, index) => (
            <Reveal key={depoimento.name} delay={index * 0.1}>
              <article className="flex h-full flex-col rounded-2xl border border-silver/40 bg-white p-7 shadow-soft">
                <Quote
                  className="h-9 w-9 text-gold/40"
                  aria-hidden="true"
                />

                {/* Estrelas */}
                <div
                  className="mt-4 flex gap-0.5"
                  role="img"
                  aria-label={`Avaliação: ${depoimento.rating} de 5 estrelas`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < depoimento.rating
                          ? 'fill-gold text-gold'
                          : 'fill-silver/40 text-silver/40'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="mt-4 flex-1 text-base leading-relaxed text-ink">
                  “{depoimento.text}”
                </p>

                {/* Autor */}
                <div className="mt-6 flex items-center gap-3 border-t border-silver/40 pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-heading text-base font-bold text-gold">
                    {depoimento.name.charAt(0)}
                  </span>
                  <div className="leading-tight">
                    <p className="font-heading text-sm font-bold text-navy">
                      {depoimento.name}
                    </p>
                    <p className="text-xs text-muted">{depoimento.role}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
