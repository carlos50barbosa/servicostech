import type { Config } from "tailwindcss";

/**
 * Design system — "Atlético Premium"
 * Paleta escura e elegante com acento laranja energia + detalhes em verde saúde.
 * Tokens centralizados aqui para manter tudo consistente.
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
        // Fundos
        ink: {
          DEFAULT: "#0B0B0D", // fundo escuro principal
          soft: "#15151A", // fundo escuro secundário (cards/seções)
        },
        // Acento laranja (energia)
        brand: {
          DEFAULT: "#FF5722",
          light: "#FF7A45", // hover
        },
        // Verde saúde
        health: "#22C55E",
        // Textos
        cloud: "#F5F5F7", // texto claro
        muted: "#A1A1AA", // texto suave/secundário
        // Seção clara de respiro
        offwhite: "#FAFAFA",
      },
      fontFamily: {
        // Display atlético para headlines
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        // Corpo legível
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(255, 87, 34, 0.55)",
        "glow-sm": "0 6px 20px -6px rgba(255, 87, 34, 0.45)",
        card: "0 20px 50px -20px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "hero-fade":
          "radial-gradient(120% 100% at 50% 0%, #15151A 0%, #0B0B0D 55%, #000000 100%)",
        "brand-gradient": "linear-gradient(135deg, #FF5722 0%, #FF7A45 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 87, 34, 0.45)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255, 87, 34, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-glow": "pulse-glow 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
