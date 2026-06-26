import { MessageCircle, Instagram, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "./ui/Container";
import {
  CONTATO,
  ENDERECO,
  LEGAL,
  NAV_LINKS,
  SITE,
  WA,
} from "@/lib/config";

// Ano calculado no servidor (Server Component) — sem layout shift.
const ANO = new Date().getFullYear();

export function Footer() {
  return (
    <footer id="contato" className="bg-navy-900 text-white">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-1">
            <Logo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Crédito facilitado, rápido e transparente em {ENDERECO.cidade} e
              região do {ENDERECO.regiao}.
            </p>
            <a
              href={WA.geral()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Falar no WhatsApp
            </a>
          </div>

          {/* Links rapidos */}
          <nav aria-label="Rodapé">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              Navegação
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              Contato
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>
                <a
                  href={WA.geral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 text-green-500" aria-hidden />
                  {CONTATO.telefone}
                </a>
              </li>
              <li>
                <a
                  href={CONTATO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Instagram className="h-4 w-4 text-roxo-500" aria-hidden />
                  {CONTATO.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          {/* Endereco */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              Endereço
            </h2>
            <address className="mt-4 flex items-start gap-3 text-sm not-italic text-white/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
              <span>
                {ENDERECO.logradouro}
                <br />
                {ENDERECO.cidade} — {ENDERECO.estado}, {ENDERECO.cep}
              </span>
            </address>
          </div>
        </div>

        {/* Disclaimer legal */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-white/40">
            {LEGAL.disclaimer} CNPJ: {LEGAL.cnpj}. {LEGAL.registro}
          </p>
          <p className="mt-4 text-xs text-white/40">
            © {ANO} {SITE.nome}. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
