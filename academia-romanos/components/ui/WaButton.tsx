import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { wa } from '@/lib/site'

type Variant = 'primary' | 'outline' | 'whatsapp'
type Size = 'md' | 'lg'

type WaButtonProps = {
  /** Mensagem pré-preenchida no WhatsApp */
  message: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /** Rótulo acessível extra (quando o conteúdo visual não é descritivo o suficiente) */
  ariaLabel?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded font-semibold leading-none transition-colors duration-200 select-none'

const sizes: Record<Size, string> = {
  md: 'px-6 py-3.5 text-sm',
  lg: 'px-8 py-4 text-base',
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  outline: 'border border-white/25 text-white hover:border-brand hover:text-brand',
  whatsapp: 'bg-whatsapp text-white hover:brightness-95',
}

/** Link de conversão que abre o WhatsApp com mensagem pronta. */
export function WaButton({
  message,
  children,
  variant = 'primary',
  size = 'md',
  className,
  ariaLabel,
}: WaButtonProps) {
  return (
    <a
      href={wa(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </a>
  )
}
