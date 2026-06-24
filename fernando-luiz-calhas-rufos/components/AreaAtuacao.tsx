import { MapPin } from 'lucide-react';
import Reveal from './Reveal';
import { areaAtuacao, buildWhatsAppLink } from '@/lib/site-config';
import WhatsAppIcon from './icons/WhatsAppIcon';

/**
 * Área de atuação — texto + chips das cidades atendidas.
 * Edite a lista de cidades em `areaAtuacao.cities` (lib/site-config.ts).
 */
export default function AreaAtuacao() {
  return (
    <section id="area" className="bg-white py-16 sm:py-20">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-gradient px-6 py-12 text-white shadow-soft-lg sm:px-12">
            {/* Detalhe decorativo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
            />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-gold">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Onde atendemos
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">
                  {areaAtuacao.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-silver">
                  {areaAtuacao.text} Não encontrou sua cidade na lista? Fale com a
                  gente — provavelmente atendemos você também.
                </p>
                <a
                  href={buildWhatsAppLink(
                    'Olá! Vim pelo site. Vocês atendem na minha cidade?',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold mt-7"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Consultar minha cidade
                </a>
              </div>

              {/* Chips das cidades */}
              <ul className="flex flex-wrap gap-2.5">
                {areaAtuacao.cities.map((city) => (
                  <li
                    key={city}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-heading text-sm font-semibold text-white/90 backdrop-blur-sm"
                  >
                    <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
