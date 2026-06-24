import Image from 'next/image';
import { Check } from 'lucide-react';
import Reveal from './Reveal';
import { sobre, business } from '@/lib/site-config';
import { withBasePath } from '@/lib/base-path';

/**
 * Sobre — apresentação curta e humana do Fernando Luiz.
 * Imagem do profissional + texto + destaques.
 */
export default function Sobre() {
  return (
    <section id="sobre" className="bg-light py-16 sm:py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        {/* Imagem */}
        <Reveal direction="right">
          <div className="relative mx-auto aspect-[9/10] w-full max-w-md overflow-hidden rounded-3xl shadow-soft-lg">
            {/* TROCAR: foto real do Fernando Luiz / equipe em ação */}
            <Image
              src={withBasePath('/images/sobre.svg')}
              alt="Fernando Luiz, profissional de calhas e rufos"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Faixa dourada de marca sobre a imagem */}
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gold-gradient" />
          </div>
        </Reveal>

        {/* Texto */}
        <Reveal direction="left">
          <span className="eyebrow">Quem somos</span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight text-navy sm:text-4xl">
            {sobre.title}
          </h2>

          <div className="mt-5 space-y-4">
            {sobre.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {sobre.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-center gap-3 rounded-2xl border border-silver/40 bg-white p-4 shadow-soft"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-navy">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-sm font-semibold text-navy">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 border-l-4 border-gold pl-4 font-heading text-xl font-bold italic text-navy">
            “{business.slogan}”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
