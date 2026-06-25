"use client";

import { Star, Quote } from "lucide-react";
import Reveal from "./Reveal";

/* ============================================================================
 * ⚠️ DEPOIMENTOS PLACEHOLDER
 * ----------------------------------------------------------------------------
 * Estes depoimentos são EXEMPLOS para o Luiz substituir por depoimentos REAIS
 * de alunos (com autorização). Troque `nome`, `objetivo` e `texto` abaixo.
 * Dica: peça um print ou áudio do aluno e adapte para texto curto.
 * ========================================================================== */
const depoimentos = [
  {
    nome: "Aluna",
    objetivo: "Emagrecimento",
    texto:
      "Comecei do zero e hoje treino com confiança. O acompanhamento de perto fez toda a diferença.",
  },
  {
    nome: "Aluno",
    objetivo: "Reabilitação",
    texto:
      "Voltei a treinar depois de uma lesão e fui respeitando meus limites. Recuperei força e qualidade de vida.",
  },
  {
    nome: "Aluno",
    objetivo: "Hipertrofia",
    texto:
      "Ganhei massa muscular treinando do jeito certo, sem me machucar. Profissional atencioso e técnico.",
  },
];

export default function Depoimentos() {
  return (
    <section id="depoimentos" className="relative bg-ink-soft py-20 md:py-28">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mb-4">Depoimentos</span>
          <h2 className="headline text-3xl text-cloud sm:text-4xl">
            O que dizem os <span className="text-gradient">alunos</span>
          </h2>
          <p className="mt-4 text-muted">
            Histórias de quem decidiu treinar com acompanhamento e segurança.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {depoimentos.map(({ nome, objetivo, texto }, i) => (
            <Reveal key={i} delay={i * 0.1} as="article">
              <figure className="card-dark flex h-full flex-col">
                <Quote
                  className="mb-4 h-8 w-8 text-brand/60"
                  aria-hidden="true"
                />
                <div
                  className="mb-4 flex gap-0.5"
                  aria-label="Avaliação 5 de 5 estrelas"
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 fill-brand text-brand"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-cloud">
                  &ldquo;{texto}&rdquo;
                </blockquote>
                <figcaption className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-cloud">{nome}</p>
                  <p className="text-xs text-brand">{objetivo}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Aviso visível apenas no código/desenvolvimento — remover se quiser */}
        <p className="mt-8 text-center text-xs text-muted/70">
          {/* TODO: substituir pelos depoimentos reais dos alunos (com autorização). */}
          * Depoimentos ilustrativos — substituir pelos relatos reais dos alunos.
        </p>
      </div>
    </section>
  );
}
