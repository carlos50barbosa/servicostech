import { cn } from "@/lib/cn";

/** Card base com cantos generosos e sombra suave em camadas. */
export function Card({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-mist bg-white p-6 shadow-card sm:p-7",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
