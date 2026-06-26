"use client";

import { createElement, useEffect, useRef, type CSSProperties } from "react";

/**
 * Scroll-reveal (fade + slide-up) SEM framer-motion: só IntersectionObserver +
 * CSS (ver app/globals.css). O estado oculto é aplicado por CSS apenas quando
 * há `.js` no <html>, então sem JS / com JS lento o conteúdo aparece normal.
 * Respeita prefers-reduced-motion via CSS.
 */

// Observa o elemento e adiciona `.is-visible` ao entrar na viewport (uma vez).
function useRevealRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.classList.contains("is-visible")) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible"); // fallback: revela na hora
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const ref = useRevealRef<HTMLElement>();
  const style: CSSProperties = {};
  if (delay) (style as Record<string, string>)["--reveal-delay"] = `${delay * 1000}ms`;
  if (y !== 24) (style as Record<string, string>)["--reveal-y"] = `${y}px`;

  return createElement(
    as,
    { ref, "data-reveal": "", className, style },
    children
  );
}

/**
 * Container com stagger: os filhos <RevealItem> animam em sequência quando o
 * grupo entra na viewport.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRevealRef<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-reveal-group=""
      className={className}
      style={{ ["--reveal-stagger" as string]: `${stagger * 1000}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Item para usar dentro de <RevealGroup>. */
export function RevealItem({
  children,
  className,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const style: CSSProperties = {};
  if (y !== 24) (style as Record<string, string>)["--reveal-y"] = `${y}px`;
  return (
    <div data-reveal-item="" className={className} style={style}>
      {children}
    </div>
  );
}
