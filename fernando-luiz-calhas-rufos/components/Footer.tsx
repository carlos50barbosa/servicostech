import { Phone, Instagram, MapPin } from 'lucide-react';
import Logo from './Logo';
import WhatsAppIcon from './icons/WhatsAppIcon';
import {
  business,
  contact,
  navLinks,
  areaAtuacao,
  buildWhatsAppLink,
} from '@/lib/site-config';

/**
 * Footer — nome + slogan, contatos, links âncora, área de atuação e copyright.
 * O ano é calculado automaticamente.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-silver">
      {/* Faixa dourada de marca */}
      <div aria-hidden="true" className="h-1 bg-gold-gradient" />

      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Marca + slogan */}
          <div className="lg:col-span-1">
            <Logo variant="light" className="h-12 w-auto" />
            <p className="mt-4 max-w-xs font-heading text-base font-semibold italic text-gold">
              {business.slogan}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-silver/80">
              Calhas e rufos com qualidade garantida para residências e comércios
              em {business.region}.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Contato
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${contact.phoneTel}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-gold"
                  aria-label={`Ligar para ${contact.phoneDisplay}`}
                >
                  <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-gold"
                  aria-label="Abrir conversa no WhatsApp"
                >
                  <WhatsAppIcon className="h-4 w-4 text-gold" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={contact.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-gold"
                  aria-label={`Instagram ${contact.instagram.handle}`}
                >
                  <Instagram className="h-4 w-4 text-gold" aria-hidden="true" />
                  {contact.instagram.handle}
                </a>
              </li>
            </ul>
          </div>

          {/* Links âncora */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Navegação
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Área de atuação */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Área de atuação
            </h3>
            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                aria-hidden="true"
              />
              <span>{areaAtuacao.cities.join(' · ')}</span>
            </p>
          </div>
        </div>

        {/* Linha de copyright */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-silver/70">
          <p>
            © {year} {business.fullName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
