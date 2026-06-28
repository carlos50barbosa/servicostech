import {
  Trophy,
  Wallet,
  ParkingSquare,
  HeartHandshake,
  GraduationCap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from './ui/Reveal'

type Diferencial = {
  icon: LucideIcon
  title: string
  description: string
}

const diferenciais: Diferencial[] = [
  {
    icon: Trophy,
    title: '20 anos no bairro',
    description:
      'Duas décadas fazendo parte da história da COHAB 2 e COHAB 5. A gente conhece a vizinhança pelo nome.',
  },
  {
    icon: HeartHandshake,
    title: 'Acolhimento ao iniciante',
    description:
      'Sem julgamento e sem pressa. Aqui você aprende do zero, no seu ritmo, com gente que torce por você.',
  },
  {
    icon: Wallet,
    title: 'Planos acessíveis',
    description:
      'Preço de bairro, que cabe no orçamento. Cuidar da saúde não pode ser privilégio.',
  },
  {
    icon: ParkingSquare,
    title: 'Estacionamento',
    description:
      'Vagas na avenida e na própria academia. Você chega, treina e vai embora com tranquilidade.',
  },
  {
    icon: GraduationCap,
    title: 'Profissionais experientes',
    description:
      'Equipe que acompanha de perto, corrige com cuidado e respeita as suas limitações de saúde.',
  },
]

export function Diferenciais() {
  return (
    <section id="diferenciais" className="bg-base py-20 md:py-28">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="kicker mb-4">Por que a Romanos</p>
          <h2 className="display text-4xl text-white sm:text-5xl md:text-6xl">
            Perto de você. <span className="text-brand">Do seu lado</span>.
          </h2>
          <p className="mt-5 text-base text-muted">
            Mais do que aparelhos, uma academia de bairro que cuida de gente de verdade —
            há 20 anos esperando exatamente você.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {diferenciais.map((d, i) => {
            const Icon = d.icon
            return (
              <Reveal
                key={d.title}
                delay={i * 0.07}
                className="flex gap-4 rounded-lg border border-white/10 bg-surface p-6"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-brand/15 text-brand">
                  <Icon size={24} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl uppercase tracking-tight text-white">
                    {d.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {d.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
