import { ArrowUpRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { servicos, buildWhatsAppLink } from '@/lib/site-config';

/**
 * Serviços — grid de cards (ícone + título + descrição).
 * Cada card tem um link "Solicitar" que abre o WhatsApp já com o serviço citado.
 */
export default function Servicos() {
  return (
    <section id="servicos" className="bg-white py-16 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="O que fazemos"
          title="Nossos serviços"
          subtitle="Soluções completas em calhas e rufos para residências e comércios em Campinas e região."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico, index) => {
            const Icon = servico.icon;
            // Mensagem pré-preenchida específica para cada serviço
            const link = buildWhatsAppLink(
              `Olá! Vim pelo site e gostaria de um orçamento para: ${servico.title}.`,
            );

            return (
              <Reveal key={servico.title} delay={(index % 3) * 0.08}>
                <article className="group flex h-full flex-col rounded-2xl border border-silver/40 bg-light p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft-lg">
                  <span className="icon-circle transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-extrabold uppercase tracking-tight text-navy">
                    {servico.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {servico.description}
                  </p>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-gold-dark transition-colors hover:text-navy"
                    aria-label={`Solicitar orçamento para ${servico.title}`}
                  >
                    Solicitar orçamento
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
