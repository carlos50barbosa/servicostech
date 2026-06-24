import Image from 'next/image';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { galeria } from '@/lib/site-config';
import { withBasePath } from '@/lib/base-path';

/**
 * Galeria / Antes e Depois — grade de imagens dos trabalhos.
 * Estrutura pronta: o cliente só precisa trocar os arquivos em /public/images
 * (ou editar a lista `galeria` em lib/site-config.ts).
 */
export default function Galeria() {
  return (
    <section id="galeria" className="bg-white py-16 sm:py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Nossos trabalhos"
          title="Galeria de serviços"
          subtitle="Alguns exemplos de calhas e rufos instalados, limpos e reparados pela nossa equipe."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galeria.map((item, index) => (
            <Reveal key={item.src} delay={(index % 3) * 0.08}>
              {/* TROCAR: imagem real do trabalho do cliente */}
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-silver/40 shadow-soft">
                <Image
                  src={withBasePath(item.src)}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Legenda em overlay que aparece no hover */}
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-navy/90 to-transparent p-4 font-heading text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
                  {item.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-center text-sm text-muted">
            {/* Lembrete para o cliente — remova depois de inserir as fotos reais */}
            As imagens acima são ilustrativas. Em breve, fotos reais dos nossos
            trabalhos.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
