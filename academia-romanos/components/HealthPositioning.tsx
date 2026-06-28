import Image from 'next/image'
import { Check, HeartPulse, MessageCircle } from 'lucide-react'
import { WaButton } from './ui/WaButton'
import { Reveal } from './ui/Reveal'
import { WA_MESSAGES } from '@/lib/site'
import { withBasePath } from '@/lib/base-path'

const benefits = [
  'Ajuda no controle da glicemia e do diabetes',
  'Contribui para regular a pressão arterial',
  'Apoia a queda do colesterol e do peso',
  'Devolve disposição, força e qualidade de sono',
  'Preserva massa muscular para envelhecer com autonomia',
]

export function HealthPositioning() {
  return (
    <section id="saude" className="relative bg-base py-20 md:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Texto */}
        <Reveal>
          <p className="kicker mb-4">
            <HeartPulse size={16} aria-hidden /> Por que treinar
          </p>

          <h2 className="display text-4xl text-white sm:text-5xl md:text-6xl">
            Seu <span className="text-brand">corpo</span> já está te{' '}
            <span className="text-brand">avisando</span>.
          </h2>

          <p className="mt-6 text-lg font-semibold text-white">
            O treino não é luxo. É remédio.
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Diabetes, colesterol, pressão alta, sobrepeso, aquele cansaço que não passa.
            Quase sempre o corpo avisa antes — e o movimento é um dos cuidados mais
            poderosos que existem. Aqui você não precisa estar pronto nem ter experiência:
            a gente te acolhe no seu ritmo, do primeiro passo em diante.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-white/90">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/15">
                  <Check size={13} className="text-brand" aria-hidden />
                </span>
                <span className="text-sm md:text-base">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <WaButton message={WA_MESSAGES.team} size="lg">
              <MessageCircle size={20} />
              Falar com a equipe
            </WaButton>
          </div>
        </Reveal>

        {/* Imagem */}
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-white/10">
            <Image
              src={withBasePath('/images/saude.svg')}
              alt="Pessoa treinando na Academia Romanos como forma de cuidar da saúde"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              // unoptimized: placeholder é SVG. Remover ao usar a foto real.
              unoptimized
              className="object-cover"
            />
            {/* Selo flutuante */}
            <div className="absolute bottom-5 left-5 right-5 rounded-md border border-white/10 bg-base/85 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white">
                &ldquo;Não precisa estar pronto. Só precisa começar.&rdquo;
              </p>
              <p className="mt-1 text-xs text-muted">
                Acolhimento ao iniciante há 20 anos.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
