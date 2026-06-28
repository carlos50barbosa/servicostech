import { ArrowRight, MessageCircle } from 'lucide-react'
import { WaButton } from './ui/WaButton'
import { WA_MESSAGES } from '@/lib/site'
import { withBasePath } from '@/lib/base-path'

// Server component, sem framer-motion: o texto do hero é renderizado visível no
// primeiro paint (nada espera hidratar; sem opacity:0 no HTML estático).
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-base"
    >
      {/* Fundo: foto escura de treino (placeholder da marca) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${withBasePath('/images/hero.svg')}')` }}
      />
      {/* Overlays para legibilidade do texto */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-base via-base/80 to-base/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-base/40"
      />

      <div className="container-x relative z-10 py-28 md:py-32">
        {/* Selo */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            20 anos · COHAB 2 e COHAB 5
          </span>
        </div>

        {/* Headline */}
        <h1 className="display max-w-4xl text-5xl text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Começar é o <span className="text-brand">remédio</span> que faltava.
        </h1>

        {/* Subtítulo */}
        <p className="mt-6 max-w-2xl text-lg text-muted md:text-xl">
          Academia de bairro há <strong className="font-semibold text-white">20 anos</strong> em
          Carapicuíba. Musculação, funcional, pilates e jiu-jitsu — para quem quer começar
          a cuidar da saúde com quem está pertinho de você.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <WaButton message={WA_MESSAGES.trial} size="lg" className="w-full sm:w-auto">
            <MessageCircle size={20} />
            Quero começar agora
          </WaButton>
          <a
            href="#modalidades"
            className="inline-flex w-full items-center justify-center gap-2 rounded border border-white/25 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-brand hover:text-brand sm:w-auto"
          >
            Ver modalidades
            <ArrowRight size={18} />
          </a>
        </div>

        {/* Microcopy de reforço */}
        <p className="mt-6 text-sm text-white/55">
          Não precisa estar pronto. Não precisa ter experiência. Só precisa começar.
        </p>
      </div>
    </section>
  )
}
