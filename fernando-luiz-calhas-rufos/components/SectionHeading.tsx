import Reveal from './Reveal';

/**
 * Cabeçalho padrão de seção: "eyebrow" (cápsula dourada) + título + subtítulo.
 * Usado em quase todas as seções para manter a hierarquia visual consistente.
 *
 * Prop `theme`:
 *   - 'light' → para seções de fundo claro (texto escuro) — padrão
 *   - 'dark'  → para seções de fundo escuro (texto claro)
 */
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  theme?: 'light' | 'dark';
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  theme = 'light',
}: SectionHeadingProps) {
  const isDark = theme === 'dark';

  return (
    <Reveal
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={`mt-4 font-heading text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl ${
          isDark ? 'text-white' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            isDark ? 'text-silver' : 'text-muted'
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
