import { cn } from '@/lib/cn'

/**
 * Logo placeholder da Academia Romanos (emblema "R" + wordmark).
 * [CONFIRMAR] Substituir pelo arquivo oficial (PNG/SVG) do elmo de gladiador.
 * Quando tiver o SVG oficial, troque o emblema abaixo por:
 *   <Image src="/logo.svg" alt="Academia Romanos" width={160} height={40} priority />
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      {/* Emblema */}
      <span
        aria-hidden
        className="relative grid h-10 w-10 shrink-0 place-items-center rounded bg-brand"
      >
        {/* crista/penacho do elmo */}
        <svg
          className="absolute -top-[7px] left-1/2 -translate-x-1/2"
          width="22"
          height="9"
          viewBox="0 0 22 9"
          fill="none"
        >
          <path d="M11 0 L7 8 L15 8 Z" fill="#E10600" />
        </svg>
        <span className="font-display text-2xl leading-none text-white">R</span>
      </span>

      {/* Wordmark */}
      <span className="leading-none">
        <span className="block font-display text-xl tracking-tight text-white">
          ROMANOS
        </span>
        <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.25em] text-muted">
          Academia
        </span>
      </span>
    </span>
  )
}
