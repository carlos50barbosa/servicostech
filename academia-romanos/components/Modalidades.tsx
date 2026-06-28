import { Dumbbell, Activity, Flower2, Swords, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from './ui/Reveal'
import { wa, WA_MESSAGES } from '@/lib/site'

type Modalidade = {
  icon: LucideIcon
  title: string
  description: string
}

const modalidades: Modalidade[] = [
  {
    icon: Dumbbell,
    title: 'Musculação',
    description:
      'Força, saúde e preservação de massa muscular — com acompanhamento para iniciantes e quem está voltando a treinar.',
  },
  {
    icon: Activity,
    title: 'Funcional',
    description:
      'Condicionamento e mobilidade para o dia a dia: subir escada, brincar com os filhos e se mover sem dor.',
  },
  {
    icon: Flower2,
    title: 'Pilates',
    description:
      'Postura, fortalecimento do core e bem-estar. Ideal para dores nas costas e baixo impacto.',
  },
  {
    icon: Swords,
    title: 'Jiu-Jitsu',
    description:
      'Disciplina, defesa pessoal e condicionamento — para adultos e também para a turma mais jovem.',
  },
]

export function Modalidades() {
  return (
    <section id="modalidades" className="bg-base py-20 md:py-28">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="kicker mb-4">O que você vai encontrar</p>
          <h2 className="display text-4xl text-white sm:text-5xl md:text-6xl">
            Quatro caminhos, <span className="text-brand">um só objetivo</span>: a sua saúde.
          </h2>
          <p className="mt-5 text-base text-muted">
            Escolha por onde começar — e mude quando quiser. Todas as modalidades são
            pensadas para receber bem quem está dando o primeiro passo.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modalidades.map((m, i) => {
            const Icon = m.icon
            return (
              <Reveal key={m.title} delay={i * 0.08} className="h-full">
                <a
                  href={wa(WA_MESSAGES.modality(m.title))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col rounded-lg border border-white/10 bg-surface p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand focus-visible:border-brand"
                >
                  <span className="grid h-12 w-12 place-items-center rounded bg-brand/15 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <Icon size={24} aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-2xl uppercase tracking-tight text-white">
                    {m.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {m.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white/70 transition-colors group-hover:text-brand">
                    Quero saber mais
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
