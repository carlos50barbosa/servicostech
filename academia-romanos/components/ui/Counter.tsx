'use client'

import { useEffect, useRef, useState } from 'react'

type CounterProps = {
  to: number
  durationMs?: number
  prefix?: string
  suffix?: string
  className?: string
}

/**
 * Número que anima de 0 até `to` quando entra na viewport — SEM framer-motion:
 * IntersectionObserver + requestAnimationFrame. Respeita prefers-reduced-motion
 * (mostra o valor final direto).
 */
export function Counter({
  to,
  durationMs = 1600,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const run = () => {
      if (reduce || typeof requestAnimationFrame === 'undefined') {
        setValue(to)
        return
      }
      let start: number | null = null
      const tick = (t: number) => {
        if (start === null) start = t
        const progress = Math.min((t - start) / durationMs, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
        setValue(Math.round(eased * to))
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    if (typeof IntersectionObserver === 'undefined') {
      run()
      return
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
            obs.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -60px 0px' }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [to, durationMs])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString('pt-BR')}
      {suffix}
    </span>
  )
}
