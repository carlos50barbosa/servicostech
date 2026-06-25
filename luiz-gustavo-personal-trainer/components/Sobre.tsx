"use client";

import Image from "next/image";
import { GraduationCap, BadgeCheck, CalendarClock, Globe } from "lucide-react";
import Reveal from "./Reveal";
import { withBasePath } from "@/lib/base-path";

const credenciais = [
  {
    icon: GraduationCap,
    title: "Formação em Educação Física",
    desc: "Licenciado e Bacharel — base sólida em anatomia e fisiologia.",
  },
  {
    icon: BadgeCheck,
    title: "CREF 003920-G/AL",
    desc: "Registro profissional ativo e regularizado.",
  },
  {
    icon: CalendarClock,
    title: "Experiência prática",
    // ⚠️ SUGERIDO — ajustar com os anos reais de experiência do Luiz.
    desc: "Anos acompanhando alunos de diferentes perfis e objetivos.",
  },
  {
    icon: Globe,
    title: "Presencial e online",
    desc: "Atendimento em Batalha-AL e consultoria à distância.",
  },
];

export default function Sobre() {
  return (
    <section id="sobre" className="relative bg-ink py-20 md:py-28">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        {/* Imagem */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink shadow-card">
            {/* Reutiliza a foto do perfil com enquadramento mais fechado.
                Dica: para variar, troque por uma foto do Luiz treinando em
                /public (proporção 4:5) e atualize o `src` abaixo. */}
            <Image
              src={withBasePath("/perfil-luiz-gustavo.png")}
              alt="Luiz Gustavo, personal trainer em Batalha-AL"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="scale-[1.18] object-cover object-top brightness-[0.95] contrast-[1.06] saturate-[1.05]"
            />
            {/* Vinheta + degradê para integrar ao tema escuro */}
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_35%,transparent_40%,rgba(11,11,13,0.7)_100%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
          </div>
        </Reveal>

        {/* Texto */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow mb-4">Sobre o trabalho</span>
            <h2 className="headline text-3xl text-cloud sm:text-4xl">
              Mais do que um treino.{" "}
              <span className="text-gradient">Um acompanhamento completo.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              <p>
                O papel de um personal trainer vai muito além de montar um treino.
                É um profissional qualificado para maximizar seus resultados,
                garantir sua segurança e otimizar seu tempo, através de um
                acompanhamento individualizado. A presença próxima é fundamental
                para corrigir posturas, ajustar cargas e aumentar a motivação,
                prevenindo lesões e criando uma rotina mais eficiente e constante.
              </p>
              <p>
                O treinamento é baseado nas necessidades, limitações e objetivos de
                cada aluno — seja emagrecimento, ganho de massa ou reabilitação — o
                que torna tudo muito mais eficiente. Mais do que exercício, ofereço
                orientação sobre hábitos saudáveis e descanso adequado, muitas vezes
                em conjunto com nutricionistas, para otimizar resultados.
              </p>
              <p>
                Sou um mentor que une conhecimento técnico (anatomia e fisiologia) à
                empatia, para ajudar você a atingir seus objetivos de forma segura e
                duradoura, dentro de um verdadeiro estilo de vida saudável.
              </p>
            </div>
          </Reveal>

          {/* Mini-credenciais */}
          <Reveal delay={0.2}>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {credenciais.map(({ icon: Icon, title, desc }) => (
                <li
                  key={title}
                  className="flex gap-3 rounded-2xl border border-white/5 bg-ink-soft p-4"
                >
                  <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand/10">
                    <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-cloud">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
