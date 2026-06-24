'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Reveal — wrapper de animação on-scroll (fade + slide sutil).
 *
 * Anima o conteúdo quando ele entra na viewport. Respeita automaticamente a
 * preferência "prefers-reduced-motion": nesse caso, o conteúdo aparece sem
 * movimento, apenas com o estado final.
 *
 * Props:
 *  - direction: de onde o elemento "entra" (padrão: 'up')
 *  - delay: atraso em segundos (útil para escalonar itens em sequência)
 *  - as: tag HTML do wrapper (padrão: 'div')
 */
type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

type RevealProps = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
};

const OFFSET = 28;

function getOffset(direction: Direction) {
  switch (direction) {
    case 'up':
      return { x: 0, y: OFFSET };
    case 'down':
      return { x: 0, y: -OFFSET };
    case 'left':
      return { x: OFFSET, y: 0 };
    case 'right':
      return { x: -OFFSET, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = getOffset(direction);

  const variants: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
