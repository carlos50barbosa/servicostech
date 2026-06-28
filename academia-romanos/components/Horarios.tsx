import { Clock, Dumbbell, Activity, Flower2, Swords, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from './ui/Reveal'
import { WaButton } from './ui/WaButton'
import { WA_MESSAGES } from '@/lib/site'

type Aula = {
  icon: LucideIcon
  nome: string
  dias: string[]
  horario: string
  obs?: string
}

const grade: Aula[] = [
  {
    icon: Flower2,
    nome: 'Pilates',
    dias: ['Seg', 'Qua', 'Sex'],
    horario: '18h30',
  },
  {
    icon: Activity,
    nome: 'Funcional',
    dias: ['Ter', 'Qui'],
    horario: '18h30',
  },
  {
    icon: Swords,
    nome: 'Jiu-Jitsu',
    dias: ['Seg', 'Qua', 'Sex'],
    horario: '20h00',
  },
  {
    icon: Dumbbell,
    nome: 'Musculação',
    dias: ['Seg a Sáb'], // [CONFIRMAR horário de funcionamento]
    horario: 'Horário livre',
    obs: 'Treine no horário que couber na sua rotina — consulte o funcionamento no WhatsApp.',
  },
]

export function Horarios() {
  return (
    <section id="horarios" className="border-y border-white/10 bg-surface py-20 md:py-28">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="kicker mb-4">
            <Clock size={16} aria-hidden /> Grade de horários
          </p>
          <h2 className="display text-4xl text-white sm:text-5xl md:text-6xl">
            Tem um horário <span className="text-brand">que cabe</span> no seu dia.
          </h2>
          <p className="mt-5 text-base text-muted">
            Confira os horários das aulas. A musculação funciona em horário livre — qualquer
            dúvida, é só chamar no WhatsApp que a gente confirma na hora.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {grade.map((a, i) => {
            const Icon = a.icon
            return (
              <Reveal
                key={a.nome}
                delay={i * 0.07}
                className="flex flex-col rounded-lg border border-white/10 bg-base p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded bg-brand/15 text-brand">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="font-display text-xl uppercase tracking-tight text-white">
                    {a.nome}
                  </h3>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {a.dias.map((d, idx) => (
                    <span
                      key={`${a.nome}-${d}-${idx}`}
                      className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/80"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-2xl font-bold text-brand">
                  <Clock size={18} className="text-brand/70" aria-hidden />
                  <span className="font-display tracking-tight">{a.horario}</span>
                </div>

                {a.obs && (
                  <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
                    <Info size={14} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                    {a.obs}
                  </p>
                )}
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            * Horários sujeitos a ajustes. Confirme a aula desejada antes de vir.
          </p>
          <WaButton message={WA_MESSAGES.schedule} variant="outline">
            Confirmar horários no WhatsApp
          </WaButton>
        </Reveal>
      </div>
    </section>
  )
}
