"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Info, Calculator } from "lucide-react";
import { Section, SectionHeading } from "./ui/Section";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import {
  SIMULADOR,
  formatBRL,
  formatBRLCentavos,
  waLink,
  MENSAGENS,
} from "@/lib/config";

/**
 * Calcula a parcela estimada pela Tabela Price (sistema de amortizacao).
 * PMT = PV * i / (1 - (1 + i)^-n)
 * ATENCAO: calculo APENAS ILUSTRATIVO. A taxa real e definida na
 * simulacao oficial pelo WhatsApp.
 */
function calcularParcela(valor: number, parcelas: number, taxa: number): number {
  if (taxa <= 0) return valor / parcelas;
  const fator = Math.pow(1 + taxa, -parcelas);
  return (valor * taxa) / (1 - fator);
}

export function Simulador() {
  const [valor, setValor] = useState<number>(SIMULADOR.valorInicial);
  const [parcelas, setParcelas] = useState<number>(SIMULADOR.parcelaInicial);

  const { parcela, total } = useMemo(() => {
    const p = calcularParcela(valor, parcelas, SIMULADOR.TAXA_MENSAL_PADRAO);
    return { parcela: p, total: p * parcelas };
  }, [valor, parcelas]);

  const linkWhats = waLink(MENSAGENS.simulacao(formatBRL(valor), parcelas));

  // Posicao do preenchimento do slider (para o gradiente da trilha).
  const pct =
    ((valor - SIMULADOR.valorMin) /
      (SIMULADOR.valorMax - SIMULADOR.valorMin)) *
    100;

  return (
    <Section id="simulador" tone="light">
      <SectionHeading
        eyebrow="Simulador"
        title="Faça uma simulação rápida"
        subtitle="Escolha o valor e o número de parcelas para ver uma estimativa. Depois é só simular de verdade no WhatsApp."
      />

      <Reveal className="mx-auto mt-12 max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-mist bg-white shadow-soft-lg lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          {/* Controles */}
          <div className="p-7 sm:p-9">
            <div className="mb-8">
              <div className="flex items-end justify-between">
                <label
                  htmlFor="valor"
                  className="text-sm font-semibold text-ink/70"
                >
                  Valor desejado
                </label>
                <span className="font-display text-2xl font-extrabold text-roxo-700">
                  {formatBRL(valor)}
                </span>
              </div>
              <input
                id="valor"
                type="range"
                min={SIMULADOR.valorMin}
                max={SIMULADOR.valorMax}
                step={SIMULADOR.valorPasso}
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                aria-valuetext={formatBRL(valor)}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full outline-none
                  [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                  [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:shadow-gold [&::-webkit-slider-thumb]:transition
                  [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-gold-500"
                style={{
                  background: `linear-gradient(to right, #4B1E78 0%, #7B3FB8 ${pct}%, #EAE8F0 ${pct}%, #EAE8F0 100%)`,
                }}
              />
              <div className="mt-2 flex justify-between text-xs text-ink/45">
                <span>{formatBRL(SIMULADOR.valorMin)}</span>
                <span>{formatBRL(SIMULADOR.valorMax)}</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="parcelas"
                className="text-sm font-semibold text-ink/70"
              >
                Número de parcelas
              </label>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[1, 3, 6, 10, 12, 18].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setParcelas(n)}
                    aria-pressed={parcelas === n}
                    className={
                      "rounded-xl border-2 py-2.5 text-sm font-semibold transition-all " +
                      (parcelas === n
                        ? "border-roxo-700 bg-roxo-700 text-white shadow-soft"
                        : "border-mist bg-white text-ink/70 hover:border-roxo-500/40")
                    }
                  >
                    {n}x
                  </button>
                ))}
              </div>
              <label htmlFor="parcelas-select" className="sr-only">
                Selecionar número de parcelas
              </label>
              <select
                id="parcelas-select"
                value={parcelas}
                onChange={(e) => setParcelas(Number(e.target.value))}
                className="mt-3 w-full rounded-xl border-2 border-mist bg-white px-4 py-3 text-sm font-medium text-ink/80 outline-none focus:border-roxo-500"
              >
                {Array.from({ length: SIMULADOR.parcelaMax }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}x parcela{n > 1 ? "s" : ""}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Resultado */}
          <div className="relative flex flex-col justify-center bg-gradient-hero p-7 text-white sm:p-9">
            <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calculator className="h-4 w-4 text-gold-400" aria-hidden />
                Parcela estimada
              </div>
              <div className="mt-2 font-display text-4xl font-extrabold text-gradient-gold sm:text-5xl">
                {formatBRLCentavos(parcela)}
              </div>
              <p className="mt-1 text-sm text-white/60">
                por mês em {parcelas}x
              </p>

              <dl className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/60">Valor solicitado</dt>
                  <dd className="font-semibold text-white">{formatBRL(valor)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/60">Total estimado</dt>
                  <dd className="font-semibold text-white">
                    {formatBRLCentavos(total)}
                  </dd>
                </div>
              </dl>

              <ButtonLink
                href={linkWhats}
                variant="gold"
                size="lg"
                className="mt-7 w-full"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Simular de verdade no WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Aviso obrigatorio de conformidade */}
        <p className="mt-4 flex items-start gap-2 px-2 text-xs leading-relaxed text-ink/50">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Valores aproximados e meramente ilustrativos, sujeitos a análise e
          aprovação. As condições, taxas e prazos reais são definidos na
          simulação oficial. Esta calculadora não representa oferta de crédito.
        </p>
      </Reveal>
    </Section>
  );
}
