import Image from "next/image";
import { MessageCircle, ArrowDown, ShieldCheck, MapPin, Award } from "lucide-react";
import { WHATSAPP, whatsappLink } from "@/lib/config";
import { withBasePath } from "@/lib/base-path";

const badges = [
  { icon: Award, label: "Licenciado e Bacharel em Educação Física" },
  { icon: ShieldCheck, label: "CREF 003920-G/AL" },
  { icon: MapPin, label: "Atendimento Presencial e Online" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-hero-fade pt-28 md:pt-36"
    >
      {/* Camadas de fundo: grade sutil + brilho laranja */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-site relative grid items-center gap-12 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28">
        {/* Coluna de texto */}
        <div>
          <span className="eyebrow mb-5 hero-in">
            <span className="h-1.5 w-1.5 rounded-full bg-health" />
            Treinar é sobre saúde
          </span>

          <h1 className="headline text-4xl text-cloud sm:text-5xl lg:text-6xl hero-in hero-d1">
            Treinar não é só sobre{" "}
            <span className="text-gradient">estética</span>.
            <br />É sobre <span className="text-gradient">saúde</span>.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg hero-in hero-d2">
            Acompanhamento profissional e individualizado para você alcançar seus
            objetivos com segurança, técnica e resultados que duram. Presencial em
            Batalha-AL ou online, onde você estiver.
          </p>

          {/* Botões */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center hero-in hero-d3">
            <a
              href={whatsappLink(
                "Olá Luiz! Quero começar agora. Pode me contar como funciona o acompanhamento?"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Quero começar agora
            </a>
            <a href="#sobre" className="btn-secondary">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
              Conheça meu trabalho
            </a>
          </div>

          {/* Selos de credibilidade */}
          <ul className="mt-10 flex flex-wrap gap-3 hero-in hero-d4">
            {badges.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-cloud backdrop-blur"
              >
                <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna da imagem */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none hero-in-scale hero-d2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink shadow-card">
            {/* Foto profissional do Luiz (WebP ~54KB, otimizado p/ mobile).
                Para trocar: gere /public/perfil-luiz-gustavo.webp (proporção 4:5,
                ex.: 800x1000px). Ex.: sharp('foto.png').webp({quality:80}). */}
            <Image
              src={withBasePath("/perfil-luiz-gustavo.webp")}
              alt="Luiz Gustavo, personal trainer"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="scale-[1.04] object-cover object-center brightness-[0.97] contrast-[1.06] saturate-[1.08]"
            />
            {/* Tratamento de cor: vinheta escura nas bordas (some as laterais claras) */}
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_38%,transparent_42%,rgba(11,11,13,0.72)_100%)]"
              aria-hidden="true"
            />
            {/* Degradê inferior: integra a foto ao fundo escuro da página */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent"
              aria-hidden="true"
            />
            {/* Brilho sutil da marca + borda interna */}
            <div
              className="pointer-events-none absolute inset-0 bg-brand/5 mix-blend-overlay"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
          </div>

          {/* Cartão flutuante de destaque */}
          <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-ink/90 px-5 py-4 shadow-card backdrop-blur sm:block">
            <p className="text-2xl font-extrabold text-cloud">100%</p>
            <p className="text-xs text-muted">Treino individualizado</p>
          </div>
        </div>
      </div>

      {/* CTA flutuante secundário só no mobile */}
      <a href={WHATSAPP} className="sr-only">
        Falar no WhatsApp
      </a>
    </section>
  );
}
