'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** atraso em segundos */
  delay?: number
  /** distância do slide-up em px */
  y?: number
  className?: string
}

/**
 * Wrapper de entrada (fade + slide-up) ao entrar na viewport — SEM framer-motion:
 * só IntersectionObserver + CSS (ver app/globals.css). O estado oculto é aplicado
 * por CSS apenas quando há `.js` no <html>; assim, sem JS / com JS lento, o
 * conteúdo aparece normalmente. Respeita prefers-reduced-motion via CSS.
 */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || el.classList.contains('is-visible')) return

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible') // fallback: revela na hora
      return
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -80px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style: CSSProperties = {}
  if (delay) (style as Record<string, string>)['--reveal-delay'] = `${delay * 1000}ms`
  if (y !== 24) (style as Record<string, string>)['--reveal-y'] = `${y}px`

  return (
    <div ref={ref} data-reveal="" className={className} style={style}>
      {children}
    </div>
  )
}
