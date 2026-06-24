import type { Config } from 'tailwindcss';

/**
 * Design tokens da marca Fernando Luiz — Calhas e Rufos.
 * Paleta: azul-marinho profundo + dourado + detalhes metálicos.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1E3F', // primária — fundos escuros, header, footer, hero
          light: '#13294B', // cards e seções escuras secundárias
        },
        gold: {
          DEFAULT: '#F2A900', // destaque — CTAs, ícones, headings-chave
          dark: '#D8920A', // hover dos botões dourados
        },
        silver: '#C9D1D9', // detalhes metálicos / linhas
        light: '#F8FAFC', // fundo de seções claras
        ink: '#1A2332', // texto principal em fundo claro
        muted: '#64748B', // texto secundário
      },
      fontFamily: {
        // Mapeadas para as variáveis criadas via next/font em app/layout.tsx
        heading: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(11, 30, 63, 0.18)',
        'soft-lg': '0 24px 60px -20px rgba(11, 30, 63, 0.28)',
        gold: '0 12px 30px -10px rgba(242, 169, 0, 0.45)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(160deg, #0B1E3F 0%, #13294B 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F2A900 0%, #D8920A 100%)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          lg: '2rem',
        },
        screens: {
          '2xl': '1200px',
        },
      },
    },
  },
  plugins: [],
};

export default config;
