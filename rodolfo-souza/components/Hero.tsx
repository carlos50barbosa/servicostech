import {
  ShieldCheck,
  Search,
  Zap,
  HeartHandshake,
  MessageCircle,
  ArrowDown,
  Banknote,
} from "lucide-react";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Container";
import { CreditCard } from "./CreditCard";
import { WA } from "@/lib/config";

const SELOS = [
  { icon: ShieldCheck, label: "Credenciado e autorizado" },
  { icon: Search, label: "Sem consulta SPC/Serasa" },
  { icon: Zap, label: "Liberação via PIX" },
  { icon: HeartHandshake, label: "Atendimento humano" },
];

// Server component, sem framer-motion: o texto do hero é renderizado visível no
// primeiro paint (nada espera hidratar). A entrada do cartão é só CSS leve.
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-[72px] text-white">
      {/* Camadas decorativas de fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-roxo-500/30 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold-500/20 blur-[130px]" />
      </div>

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:py-28">
        {/* Coluna de texto — visível no primeiro paint (sem JS de animação). */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/85 backdrop-blur-sm">
            <Banknote className="h-4 w-4 text-gold-400" aria-hidden />
            Crédito facilitado em Batalha e região
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Crédito facilitado com as{" "}
            <span className="text-gradient-gold">melhores taxas</span> do mercado
            pra você
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Transforme o limite do seu cartão em dinheiro na sua conta. Liberação
            via PIX, parcelamento em até 18x — sem consulta ao SPC ou Serasa e sem
            comprovação de renda.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={WA.simular()} variant="gold" size="lg">
              <MessageCircle className="h-5 w-5" aria-hidden />
              Quero simular no WhatsApp
            </ButtonLink>
            <ButtonLink href="#como-funciona" variant="outlineLight" size="lg">
              Como funciona
              <ArrowDown className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>

          {/* Selos de confianca */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {SELOS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-white/80"
              >
                <Icon className="h-4 w-4 text-green-500" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna visual: cartao flutuante (entrada + float em CSS). */}
        <div className="flex animate-rise justify-center lg:justify-end">
          <div className="-rotate-[4deg]">
            <div className="animate-float">
              <CreditCard />
            </div>
          </div>
        </div>
      </Container>

      {/* Onda de transicao para a secao clara seguinte */}
      <div aria-hidden className="relative -mb-px">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="h-12 w-full sm:h-16"
        >
          <path d="M0 80 L1440 80 L1440 30 C1080 75 360 -10 0 35 Z" fill="#F8F7FB" />
        </svg>
      </div>
    </section>
  );
}
