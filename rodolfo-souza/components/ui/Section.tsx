import { cn } from "@/lib/cn";
import { Container } from "./Container";

/**
 * Bloco de secao com espacamento vertical consistente.
 * `tone` controla o fundo (claro / escuro / branco).
 */
export function Section({
  id,
  children,
  className,
  tone = "light",
  container = true,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark" | "white" | "transparent";
  container?: boolean;
}) {
  const tones: Record<string, string> = {
    light: "bg-cloud text-ink",
    white: "bg-white text-ink",
    dark: "bg-navy-900 text-white",
    transparent: "",
  };

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-24 lg:py-28",
        tones[tone],
        className
      )}
    >
      {container ? <Container>{children}</Container> : children}
    </section>
  );
}

/** Cabecalho de secao padrao: eyebrow + titulo + subtitulo, centralizado. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: "light" | "dark";
  align?: "center" | "left";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-3 inline-block text-sm font-semibold uppercase tracking-wider",
            isDark ? "text-gold-400" : "text-roxo-500"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]",
          isDark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            isDark ? "text-white/70" : "text-ink/65"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
