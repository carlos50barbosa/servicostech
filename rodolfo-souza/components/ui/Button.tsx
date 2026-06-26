import { cn } from "@/lib/cn";

type Variant = "gold" | "roxo" | "outline" | "outlineLight" | "green";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Dourado — CTA principal. Uso comedido.
  gold: "bg-gradient-gold text-navy-900 shadow-gold hover:shadow-soft-lg hover:-translate-y-0.5 active:translate-y-0",
  roxo: "bg-gradient-roxo text-white shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 active:translate-y-0",
  // Outline para fundos claros
  outline:
    "border-2 border-roxo-700/20 text-roxo-700 hover:border-roxo-700/40 hover:bg-roxo-700/5",
  // Outline para fundos escuros (hero)
  outlineLight:
    "border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/10",
  green:
    "bg-green-500 text-white shadow-soft hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Botao baseado em <a> (a maioria dos CTAs aponta para o WhatsApp).
 * Links externos ganham target/rel automaticamente.
 */
export function ButtonLink({
  variant = "gold",
  size = "md",
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const external = typeof href === "string" && href.startsWith("http");
  return (
    <a
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Versao <button> para acoes internas (ex.: toggles). */
export function Button({
  variant = "gold",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
