'use client';

import { useEffect, useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import Logo from './Logo';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { navLinks, contact, buildWhatsAppLink } from '@/lib/site-config';

/**
 * Header fixo com leve transparência sobre o hero que se solidifica no scroll.
 * Inclui menu hambúrguer responsivo, telefone clicável e CTA de orçamento.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detecta o scroll para alternar o estilo do header (transparente → sólido)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trava o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // O header é "claro" (texto escuro) quando solidificado OU com o menu aberto
  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-white/95 shadow-soft backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="container flex items-center justify-between py-3"
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <a
          href="#inicio"
          className="flex items-center"
          aria-label="Ir para o início"
          onClick={() => setMenuOpen(false)}
        >
          <Logo
            variant={solid ? 'dark' : 'light'}
            className="h-10 w-auto sm:h-11"
          />
        </a>

        {/* Links de navegação (desktop) */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`font-heading text-sm font-semibold transition-colors hover:text-gold ${
                  solid ? 'text-ink' : 'text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Ações (desktop) */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${contact.phoneTel}`}
            className={`flex items-center gap-2 font-heading text-sm font-bold transition-colors hover:text-gold ${
              solid ? 'text-navy' : 'text-white'
            }`}
            aria-label={`Ligar para ${contact.phoneDisplay}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {contact.phoneDisplay}
          </a>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !px-5 !py-2.5 text-sm"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Solicitar Orçamento
          </a>
        </div>

        {/* Botão do menu mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors lg:hidden ${
            solid ? 'text-navy hover:bg-navy/5' : 'text-white hover:bg-white/10'
          }`}
        >
          {menuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Menu mobile (painel deslizante) */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-silver/40 bg-white transition-[max-height] duration-300 ease-in-out lg:hidden ${
          menuOpen ? 'max-h-[26rem]' : 'max-h-0'
        }`}
      >
        <ul className="container flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-3 font-heading text-base font-semibold text-ink transition-colors hover:bg-light hover:text-gold-dark"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2 flex flex-col gap-3 px-3">
            <a
              href={`tel:${contact.phoneTel}`}
              className="flex items-center gap-2 font-heading text-base font-bold text-navy"
              aria-label={`Ligar para ${contact.phoneDisplay}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {contact.phoneDisplay}
            </a>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Solicitar Orçamento
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
