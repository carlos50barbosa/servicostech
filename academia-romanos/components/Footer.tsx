import { MessageCircle, MapPin } from 'lucide-react'
import { Logo } from './ui/Logo'
import { InstagramIcon } from './ui/InstagramIcon'
import { NAV_LINKS, SITE, wa, WA_MESSAGES } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        {/* Marca */}
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Academia de bairro há {SITE.years} anos em {SITE.city}. Musculação, funcional,
            pilates e jiu-jitsu para você cuidar da saúde pertinho de casa.
          </p>
          <p className="mt-4 text-sm font-medium text-white/80">
            &ldquo;Há 20 anos no seu bairro, esperando exatamente você.&rdquo;
          </p>
        </div>

        {/* Navegação */}
        <nav aria-label="Rodapé">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-white">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-muted transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contato */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-white">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a
                href={wa(WA_MESSAGES.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <MessageCircle size={16} className="text-brand" />
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <InstagramIcon size={16} className="text-brand" />
                {SITE.instagramHandle}
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-brand" />
              <span>
                {SITE.region}
                <br />
                {SITE.city}/{SITE.state}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            © 2006–2026 {SITE.name}. Todos os direitos reservados.
          </p>
          <p>
            Feito com cuidado para o seu bairro · {SITE.region}
          </p>
        </div>
      </div>
    </footer>
  )
}
