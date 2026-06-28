'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from './ui/Logo'
import { WaButton } from './ui/WaButton'
import { NAV_LINKS, WA_MESSAGES } from '@/lib/site'
import { cn } from '@/lib/cn'

/** Header fixo: transparente no topo, preto translúcido ao rolar. */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Trava o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open
          ? 'border-b border-white/10 bg-base/90 backdrop-blur'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#top" aria-label="Academia Romanos — ir para o topo" className="shrink-0">
          <Logo />
        </a>

        {/* Navegação desktop */}
        <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <WaButton message={WA_MESSAGES.enroll}>Matricule-se</WaButton>
        </div>

        {/* Toggle mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="grid h-11 w-11 place-items-center rounded text-white md:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Menu mobile — entrada via CSS (animate-rise), sem framer-motion */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Navegação principal (mobile)"
          className="animate-rise overflow-hidden border-t border-white/10 bg-base/95 backdrop-blur md:hidden"
        >
          <div className="container-x flex flex-col gap-1 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded px-2 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <WaButton
              message={WA_MESSAGES.enroll}
              className="mt-2 w-full"
              size="lg"
            >
              Matricule-se
            </WaButton>
          </div>
        </nav>
      )}
    </header>
  )
}
