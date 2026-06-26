"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Contador numérico animado que dispara ao entrar na viewport.
 * Sem framer-motion: IntersectionObserver + requestAnimationFrame.
 * Respeita prefers-reduced-motion (mostra o valor final direto).
 */
export function AnimatedCounter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (reduce || typeof requestAnimationFrame === "undefined") {
        setDisplay(to);
        return;
      }
      const start = performance.now();
      const ms = Math.max(1, duration * 1000);
      const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / ms);
        setDisplay(Math.round(ease(p) * to));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
