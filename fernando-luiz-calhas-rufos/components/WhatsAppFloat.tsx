'use client';

import { useEffect, useState } from 'react';
import { buildWhatsAppLink, contact } from '@/lib/site-config';
import WhatsAppIcon from './icons/WhatsAppIcon';

/**
 * Botão flutuante de WhatsApp, fixo no canto inferior direito.
 * Visível em todas as seções. Acessível (aria-label) e com tooltip no hover.
 * Aparece com um leve atraso após o carregamento para não competir com o hero.
 */
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp: ${contact.phoneDisplay}`}
      className={`group fixed bottom-5 right-5 z-50 flex items-center gap-3 transition-all duration-500 sm:bottom-7 sm:right-7 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      {/* Tooltip (oculto no mobile para não atrapalhar) */}
      <span className="pointer-events-none hidden rounded-xl bg-navy px-4 py-2 font-heading text-sm font-semibold text-white shadow-soft-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block">
        Fale conosco agora
      </span>

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft-lg transition-transform duration-200 group-hover:scale-110 sm:h-16 sm:w-16">
        {/* Pulso animado ao redor do botão */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 motion-reduce:hidden" />
        <WhatsAppIcon className="relative h-7 w-7 sm:h-8 sm:w-8" />
      </span>
    </a>
  );
}
