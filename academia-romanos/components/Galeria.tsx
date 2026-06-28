'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { Reveal } from './ui/Reveal'
import { withBasePath } from '@/lib/base-path'

type Foto = {
  src: string
  alt: string
  legenda: string
  w: number
  h: number
}

// [CONFIRMAR fotos] Trocar os placeholders pelos arquivos reais (mesma proporção).
// Como usamos next/image, basta substituir `src`, `w` e `h` pela foto real.
const fotos: Foto[] = [
  { src: '/images/g1-musculacao.svg', alt: 'Área de musculação da Academia Romanos', legenda: 'Musculação', w: 800, h: 1000 },
  { src: '/images/g2-funcional.svg', alt: 'Treino funcional na Academia Romanos', legenda: 'Funcional', w: 800, h: 600 },
  { src: '/images/g3-pilates.svg', alt: 'Estúdio de pilates da Academia Romanos', legenda: 'Pilates', w: 800, h: 600 },
  { src: '/images/g4-jiujitsu.svg', alt: 'Tatame de jiu-jitsu da Academia Romanos', legenda: 'Jiu-Jitsu', w: 800, h: 1000 },
  { src: '/images/g5-estrutura.svg', alt: 'Estrutura da Academia Romanos', legenda: 'Estrutura', w: 800, h: 600 },
  { src: '/images/g6-espaco.svg', alt: 'Espaço de convivência da Academia Romanos', legenda: 'Nosso espaço', w: 800, h: 600 },
]

export function Galeria() {
  const [aberta, setAberta] = useState<number | null>(null)

  const fechar = useCallback(() => setAberta(null), [])
  const navegar = useCallback(
    (dir: number) =>
      setAberta((i) => (i === null ? i : (i + dir + fotos.length) % fotos.length)),
    []
  )

  useEffect(() => {
    if (aberta === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
      if (e.key === 'ArrowRight') navegar(1)
      if (e.key === 'ArrowLeft') navegar(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aberta, fechar, navegar])

  return (
    <section id="galeria" aria-label="Galeria de fotos" className="border-t border-white/10 bg-surface py-20 md:py-28">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="kicker mb-4">Conheça por dentro</p>
          <h2 className="display text-4xl text-white sm:text-5xl md:text-6xl">
            O lugar onde você vai <span className="text-brand">treinar</span>.
          </h2>
        </Reveal>

        {/* Grid masonry */}
        <div className="mt-12 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {fotos.map((f, i) => (
            <Reveal key={f.src} delay={(i % 3) * 0.08} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setAberta(i)}
                aria-label={`Ampliar foto: ${f.legenda}`}
                className="group relative block w-full overflow-hidden rounded-lg border border-white/10"
              >
                <Image
                  src={withBasePath(f.src)}
                  alt={f.alt}
                  width={f.w}
                  height={f.h}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  // unoptimized: placeholders são SVG. Remover ao usar fotos reais.
                  unoptimized
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-4 flex items-center gap-2 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Plus size={16} className="text-brand" /> {f.legenda}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox — entrada via CSS (animate-rise), sem framer-motion */}
      {aberta !== null && (
        <div
          className="animate-rise fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur"
          onClick={fechar}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada: ${fotos[aberta].legenda}`}
        >
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navegar(-1)
            }}
            aria-label="Foto anterior"
            className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-6"
          >
            <ChevronLeft size={26} />
          </button>

          <div
            key={aberta}
            className="relative max-h-[85vh] w-auto max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={withBasePath(fotos[aberta].src)}
              alt={fotos[aberta].alt}
              width={fotos[aberta].w}
              height={fotos[aberta].h}
              unoptimized
              className="max-h-[85vh] w-auto rounded-lg object-contain"
              priority
            />
            <p className="mt-3 text-center text-sm text-muted">
              {fotos[aberta].legenda}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navegar(1)
            }}
            aria-label="Próxima foto"
            className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6"
          >
            <ChevronRight size={26} />
          </button>
        </div>
      )}
    </section>
  )
}
