import { Monogram } from "./Logo";
import { SITE } from "@/lib/config";

/**
 * Mockup de cartao estilizado em puro CSS/SVG (sem bandeira real).
 * Usado como elemento visual do hero.
 */
export function CreditCard() {
  return (
    <div className="relative w-full max-w-sm [perspective:1200px]">
      <div className="relative aspect-[1.586/1] w-full rounded-3xl bg-gradient-to-br from-roxo-700 via-roxo-900 to-navy-900 p-6 shadow-soft-lg ring-1 ring-white/10">
        {/* Brilho dourado difuso */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-10 h-40 w-40 rounded-full bg-gold-500/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-grid opacity-40"
        />

        <div className="relative flex h-full flex-col justify-between">
          {/* Topo: marca + selo */}
          <div className="flex items-start justify-between">
            <Monogram className="h-10 w-10" />
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold-400">
              Crédito
            </span>
          </div>

          {/* Chip dourado */}
          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-9 w-12 rounded-md bg-gradient-gold shadow-inner">
              <div className="absolute inset-1.5 rounded-sm border border-navy-900/20" />
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-navy-900/20" />
              <div className="absolute bottom-0 top-0 left-1/2 w-px -translate-x-1/2 bg-navy-900/20" />
            </div>
            {/* Ondas de contactless */}
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden>
              <path
                d="M3 5a10 10 0 0 1 0 12M8 3a14 14 0 0 1 0 16"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Numero ilustrativo */}
          <div className="font-display text-lg tracking-[0.18em] text-white/90">
            •••• •••• •••• 8912
          </div>

          {/* Rodape: nome + validade */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-white/50">
                Titular
              </div>
              <div className="text-sm font-semibold tracking-wide text-white">
                {SITE.marca.toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-white/50">
                Liberação
              </div>
              <div className="text-sm font-semibold text-green-500">via PIX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
