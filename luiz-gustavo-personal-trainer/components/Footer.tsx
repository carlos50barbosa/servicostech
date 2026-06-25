import Image from "next/image";
import { Instagram, MessageCircle, MapPin } from "lucide-react";
import {
  NAV_LINKS,
  WHATSAPP,
  INSTAGRAM,
  INSTAGRAM_HANDLE,
  BUSINESS,
} from "@/lib/config";
import { withBasePath } from "@/lib/base-path";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-soft">
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Marca */}
          <div>
            <Image
              src={withBasePath("/logo-luiz-gustavo.png")}
              alt={`${BUSINESS.name} — Personal Trainer`}
              width={1324}
              height={1006}
              className="h-20 w-auto"
            />
            <p className="mt-4 text-sm text-muted">
              Personal Trainer · CREF {BUSINESS.cref}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
              {BUSINESS.cityFull} · {BUSINESS.attendance}
            </p>
          </div>

          {/* Navegação */}
          <nav aria-label="Navegação do rodapé">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Navegação
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-cloud"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato / redes */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Vamos conversar
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-health"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <MessageCircle className="h-4 w-4 text-health" aria-hidden="true" />
                </span>
                WhatsApp
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-brand"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                  <Instagram className="h-4 w-4 text-brand" aria-hidden="true" />
                </span>
                @{INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-muted">
            © {new Date().getFullYear()} {BUSINESS.name} · Personal Trainer. Todos
            os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
