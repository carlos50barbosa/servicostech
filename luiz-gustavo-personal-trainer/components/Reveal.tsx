"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wrapper reutilizável para animações sutis de entrada ao rolar a página.
 * Faz fade + slide para cima quando o elemento entra na viewport.
 * Respeita `prefers-reduced-motion` automaticamente (Framer Motion).
 */
type RevealProps = {
  children: ReactNode;
  /** Atraso em segundos (útil para encadear itens de uma grade). */
  delay?: number;
  /** Tag HTML renderizada (padrão: div). */
  as?: "div" | "section" | "li" | "article" | "span";
  className?: string;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export default function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}
