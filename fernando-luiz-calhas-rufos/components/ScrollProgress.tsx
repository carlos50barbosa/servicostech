'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Barra de progresso de leitura fixa no topo da página.
 * Acompanha a posição do scroll com uma animação suave (spring).
 * `aria-hidden` porque é puramente decorativa.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gold-gradient"
    />
  );
}
