"use client";

import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { NAV_LINKS, WA } from "@/lib/config";
import { cn } from "@/lib/cn";

/**
 * Header sticky: transparente sobre o hero escuro e solido (claro)
 * apos rolar. Menu mobile acessivel via teclado.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do body quando o menu mobile esta aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-mist bg-white/90 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      )}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <a href="#inicio" aria-label="Início" className="shrink-0">
          <Logo tone={solid ? "light" : "dark"} />
        </a>

        {/* Navegacao desktop */}
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    solid
                      ? "text-ink/70 hover:bg-mist hover:text-roxo-700"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={WA.simular()}
            variant="gold"
            size="md"
            className="hidden sm:inline-flex"
            aria-label="Simular agora pelo WhatsApp"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Simular agora
          </ButtonLink>

          {/* Botao do menu mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden",
              solid ? "text-ink hover:bg-mist" : "text-white hover:bg-white/10"
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Painel mobile */}
      <div
        id="menu-mobile"
        className={cn(
          "overflow-hidden border-t border-mist bg-white lg:hidden",
          "transition-[max-height] duration-300 ease-in-out",
          open ? "max-h-[80vh]" : "max-h-0 border-t-0"
        )}
      >
        <Container className="py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-ink/80 hover:bg-mist hover:text-roxo-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={WA.simular()}
            variant="gold"
            size="lg"
            className="mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            Simular agora no WhatsApp
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
