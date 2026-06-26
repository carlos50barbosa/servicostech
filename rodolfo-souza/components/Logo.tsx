import { cn } from "@/lib/cn";
import { SITE } from "@/lib/config";

/**
 * Logo "RS" — monograma elegante em SVG.
 * `tone` adapta as cores para fundos claros ou escuros.
 */
export function Logo({
  className,
  tone = "light",
  showWordmark = true,
}: {
  className?: string;
  tone?: "light" | "dark";
  showWordmark?: boolean;
}) {
  const isDark = tone === "dark";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Monogram />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-base font-extrabold tracking-tight",
              isDark ? "text-white" : "text-ink"
            )}
          >
            {SITE.marca}
          </span>
          <span
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.18em]",
              isDark ? "text-gold-400" : "text-roxo-500"
            )}
          >
            Crédito
          </span>
        </span>
      )}
    </span>
  );
}

/** Marca grafica isolada (quadrado com as iniciais entrelacadas). */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="44"
      height="44"
      role="img"
      aria-label={`Logo ${SITE.iniciais} ${SITE.marca}`}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="rs-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4B1E78" />
          <stop offset="100%" stopColor="#2E0F4F" />
        </linearGradient>
        <linearGradient id="rs-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2B544" />
          <stop offset="100%" stopColor="#E0A02E" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#rs-bg)" />
      {/* Brilho dourado sutil no canto */}
      <circle cx="40" cy="9" r="14" fill="url(#rs-gold)" opacity="0.16" />
      <text
        x="50%"
        y="53%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="'Sora', 'Plus Jakarta Sans', system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-1"
      >
        <tspan fill="#FFFFFF">R</tspan>
        <tspan fill="url(#rs-gold)">S</tspan>
      </text>
    </svg>
  );
}
