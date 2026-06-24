import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { diferenciais } from '@/lib/site-config';

/**
 * Diferenciais — 4 cards com ícone em círculo dourado.
 * Fica logo abaixo do hero, em fundo claro.
 */
export default function Diferenciais() {
  return (
    <section id="diferenciais" className="bg-light py-16 sm:py-20">
      <div className="container">
        <SectionHeading
          eyebrow="Por que escolher a gente"
          title="Nossos diferenciais"
          subtitle="Mais do que instalar calhas: entregamos tranquilidade e proteção para o seu imóvel."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {diferenciais.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <article className="group h-full rounded-2xl border border-silver/40 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-soft-lg">
                  <span className="icon-circle transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-extrabold uppercase tracking-tight text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
