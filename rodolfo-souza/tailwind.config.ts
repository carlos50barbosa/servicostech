import type { Config } from "tailwindcss";

/**
 * Design System — Rodolfo Souza Credito
 * Estetica fintech premium: base clara, roxo de marca, dourado comedido
 * para CTAs/destaques e verde para sinais de sucesso (PIX/checks).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        roxo: {
          900: "#2E0F4F", // roxo profundo (base escura)
          700: "#4B1E78", // roxo primario
          500: "#7B3FB8", // roxo claro / detalhes
        },
        navy: {
          900: "#0A0E27", // azul meia-noite (secoes escuras / footer)
          800: "#111736",
        },
        gold: {
          500: "#E0A02E", // dourado (CTAs e destaques)
          400: "#F2B544",
        },
        green: {
          500: "#1FB573", // verde sucesso (PIX, checks)
        },
        ink: "#16132A", // texto escuro
        cloud: "#F8F7FB", // fundo claro
        mist: "#EAE8F0", // cinza claro / bordas
      },
      fontFamily: {
        // Definidas via next/font no layout (CSS variables).
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem", // 20px
        "3xl": "1.5rem", // 24px
      },
      boxShadow: {
        // Sombras suaves em camadas — nada de sombra dura.
        soft: "0 2px 8px rgba(46, 15, 79, 0.06), 0 12px 32px rgba(46, 15, 79, 0.08)",
        "soft-lg":
          "0 4px 16px rgba(46, 15, 79, 0.08), 0 24px 56px rgba(46, 15, 79, 0.12)",
        gold: "0 8px 24px rgba(224, 160, 46, 0.28)",
        card: "0 1px 2px rgba(16, 19, 42, 0.04), 0 8px 24px rgba(16, 19, 42, 0.06)",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #2E0F4F 0%, #1A1140 45%, #0A0E27 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #F2B544 0%, #E0A02E 100%)",
        "gradient-roxo":
          "linear-gradient(135deg, #7B3FB8 0%, #4B1E78 100%)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        pulseRing: "pulseRing 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
