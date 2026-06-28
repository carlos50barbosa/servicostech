import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0A0A0A',
        brand: {
          DEFAULT: '#E10600',
          dark: '#B30500',
        },
        surface: '#1A1A1A',
        muted: '#B3B3B3',
        whatsapp: '#25D366',
      },
      fontFamily: {
        // Carregadas via <link> no layout (Anton + Oswald p/ títulos, Inter p/ corpo).
        display: ['Anton', 'Oswald', 'Arial Narrow', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        // Arredondamento sutil (raio pequeno), conforme a identidade.
        DEFAULT: '0.375rem',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
