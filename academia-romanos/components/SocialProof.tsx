'use client'

import { Calendar, Dumbbell, ParkingSquare, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Counter } from './ui/Counter'
import { Reveal } from './ui/Reveal'

type Stat = {
  icon: LucideIcon
  value: React.ReactNode
  label: string
}

const stats: Stat[] = [
  {
    icon: Calendar,
    value: <Counter to={20} suffix=" anos" />,
    label: 'de história no seu bairro',
  },
  {
    icon: Users,
    // [CONFIRMAR número real de alunos atendidos]
    value: <Counter to={4} prefix="+" suffix=" mil" />,
    label: 'alunos já atendidos',
  },
  {
    icon: Dumbbell,
    value: <Counter to={4} />,
    label: 'modalidades para você',
  },
  {
    icon: ParkingSquare,
    value: 'Próprio',
    label: 'estacionamento na academia',
  },
]

export function SocialProof() {
  return (
    <section aria-label="Nossos números" className="border-y border-white/10 bg-surface">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-8 py-12 md:grid-cols-4 md:py-14">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <Reveal key={s.label} delay={i * 0.08} className="flex flex-col items-center text-center">
              <Icon className="mb-3 text-brand" size={28} aria-hidden />
              <div className="display text-4xl text-white md:text-5xl">{s.value}</div>
              <div className="mt-1.5 text-sm text-muted">{s.label}</div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
