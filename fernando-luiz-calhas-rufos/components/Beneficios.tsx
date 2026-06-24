import Image from 'next/image';
import { Check, ShieldCheck } from 'lucide-react';
import Reveal from './Reveal';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { beneficios, buildWhatsAppLink } from '@/lib/site-config';
import { withBasePath } from '@/lib/base-path';

/**
 * Benefícios — "Por que cuidar das suas calhas?".
 * Bloco persuasivo com imagem + lista de benefícios + CTA.
 */
export default function Beneficios() {
  return (
    <section className="bg-navy-gradient py-16 text-white sm:py-24">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        {/* Imagem */}
        <Reveal direction="right" className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-soft-lg">
            {/* TROCAR: imagem real do cliente (casa protegida / calha em uso) */}
            <Image
              src={withBasePath('/images/beneficios.svg')}
              alt="Casa protegida por sistema de calhas em dia de chuva"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        {/* Texto + lista */}
        <Reveal direction="left" className="order-1 lg:order-2">
          <span className="eyebrow">Proteção que vale a pena</span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">
            {beneficios.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-silver">
            {beneficios.intro}
          </p>

          <ul className="mt-8 space-y-4">
            {beneficios.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-base leading-relaxed text-white/90">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <a
              href={buildWhatsAppLink(
                'Olá! Vim pelo site e quero proteger meu imóvel. Pode me passar um orçamento sem compromisso?',
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {beneficios.ctaLabel}
            </a>
            <p className="mt-3 flex items-center gap-2 text-sm text-silver">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              Atendimento rápido e sem compromisso.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
