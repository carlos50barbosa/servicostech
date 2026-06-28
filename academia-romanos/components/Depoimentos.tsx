'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Reveal } from './ui/Reveal'
import { cn } from '@/lib/cn'

type Depoimento = {
  nome: string
  tempo: string
  texto: string
}

// [CONFIRMAR] Substituir pelos depoimentos reais de alunos (com autorização).
const depoimentos: Depoimento[] = [
  {
    nome: 'Maria de Lourdes',
    tempo: 'Aluna há 3 anos',
    texto:
      'Cheguei com medo, nunca tinha treinado na vida. Fui acolhida desde o primeiro dia. Hoje minha pressão está controlada e subo a escada de casa sem cansar.',
  },
  {
    nome: 'Antônio Ferreira',
    tempo: 'Aluno há 2 anos',
    texto:
      'Meu médico pediu pra eu me mexer por causa do diabetes. Achei paciência e gente que entende. Virou parte da minha rotina e da minha saúde.',
  },
  {
    nome: 'Cláudia Souza',
    tempo: 'Aluna há 1 ano',
    texto:
      'O pilates salvou a minha coluna. Saio das aulas leve, sem dor e dormindo muito melhor. Queria ter começado antes.',
  },
  {
    nome: 'Roberto Lima',
    tempo: 'Aluno há 8 anos',
    texto:
      'Vinte anos no bairro dizem tudo. É como treinar em família — todo mundo te conhece pelo nome e torce por você.',
  },
  {
    nome: 'Juliana Alves',
    tempo: 'Aluna há 4 anos',
    texto:
      'Meu filho faz jiu-jitsu e eu faço funcional. A academia virou ponto de encontro da nossa família.',
  },
]

function initials(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function Depoimentos() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = depoimentos.length

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total]
  )

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6000)
    return () => clearInterval(id)
  }, [paused, total])

  const atual = depoimentos[index]

  return (
    <section
      id="depoimentos"
      aria-label="Depoimentos de alunos"
      className="bg-base py-20 md:py-28"
    >
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="kicker mb-4">Quem treina, recomenda</p>
          <h2 className="display text-4xl text-white sm:text-5xl md:text-6xl">
            Histórias de quem <span className="text-brand">começou</span>.
          </h2>
        </Reveal>

        <div
          className="relative mx-auto mt-12 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-surface p-8 md:p-12">
            <Quote
              className="absolute right-6 top-6 text-brand/20"
              size={64}
              aria-hidden
            />

            <div aria-live="polite" className="min-h-[180px]">
              {/* key={index} faz o React remontar a figura → replay do animate-rise (fade/slide). */}
              <figure key={index} className="animate-rise">
                <div className="mb-4 flex gap-1 text-brand" aria-label="5 de 5 estrelas">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" aria-hidden />
                  ))}
                </div>

                <blockquote className="text-lg leading-relaxed text-white md:text-xl">
                  &ldquo;{atual.texto}&rdquo;
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand font-display text-lg text-white">
                    {initials(atual.nome)}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">
                      {atual.nome}
                    </span>
                    <span className="block text-sm text-muted">{atual.tempo}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Controles */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Selecionar depoimento">
              {depoimentos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Depoimento ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === index ? 'w-6 bg-brand' : 'w-2 bg-white/25 hover:bg-white/40'
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Depoimento anterior"
                className="grid h-11 w-11 place-items-center rounded border border-white/15 text-white transition-colors hover:border-brand hover:text-brand"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próximo depoimento"
                className="grid h-11 w-11 place-items-center rounded border border-white/15 text-white transition-colors hover:border-brand hover:text-brand"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
