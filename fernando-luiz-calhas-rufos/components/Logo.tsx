import { business } from '@/lib/site-config';

/**
 * Logo da marca (placeholder em SVG inline, para adaptar a cor ao fundo).
 *
 * TROCAR: ao receber o logo oficial do cliente, você pode:
 *   - substituir este componente por um <Image src="/logo.svg" ... />, ou
 *   - manter este SVG e apenas ajustar cores/forma.
 *
 * Prop `variant`:
 *   - 'dark'  → texto escuro (para usar sobre fundos claros)
 *   - 'light' → texto claro (para usar sobre fundos escuros, ex.: hero/footer)
 */
type LogoProps = {
  variant?: 'dark' | 'light';
  className?: string;
};

export default function Logo({ variant = 'dark', className }: LogoProps) {
  const isLight = variant === 'light';
  const textColor = isLight ? '#F8FAFC' : '#0B1E3F';
  const iconBg = isLight ? '#13294B' : '#0B1E3F';

  return (
    <svg
      viewBox="0 0 320 72"
      className={className}
      role="img"
      aria-label={`${business.fullName} — logotipo`}
    >
      {/* Ícone: calha estilizada com gota dourada */}
      <rect x="6" y="8" width="56" height="56" rx="14" fill={iconBg} />
      <rect
        x="6.75"
        y="8.75"
        width="54.5"
        height="54.5"
        rx="13.25"
        stroke="#F2A900"
        strokeOpacity={isLight ? 0.55 : 0.35}
        strokeWidth="1.5"
      />
      <path
        d="M18 24 H50 V30 C50 41 42 48 34 48 C26 48 18 41 18 30 Z"
        fill="none"
        stroke="#C9D1D9"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M16 24 H52" stroke="#C9D1D9" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M34 30 C34 30 40 38 40 43 C40 46.3 37.3 49 34 49 C30.7 49 28 46.3 28 43 C28 38 34 30 34 30 Z"
        fill="#F2A900"
      />

      {/* Texto da marca */}
      <text
        x="76"
        y="34"
        fontFamily="var(--font-montserrat), sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="0.5"
        fill={textColor}
      >
        FERNANDO LUIZ
      </text>
      <text
        x="76"
        y="54"
        fontFamily="var(--font-montserrat), sans-serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="3.5"
        fill="#F2A900"
      >
        CALHAS E RUFOS
      </text>
    </svg>
  );
}
