# Academia Romanos — Landing Page

Landing page de conversão (página única) para a **Academia Romanos**, academia de bairro
com 20 anos de tradição na COHAB 2 / COHAB 5, em Carapicuíba (SP). O objetivo da página é
**gerar contato pelo WhatsApp** (matrícula / aula experimental).

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (tema da marca em `tailwind.config.ts`)
- **Framer Motion** (animações de entrada e microinterações)
- **lucide-react** (ícones)
- `next/image` para imagens

## Como rodar

```bash
npm install      # instala dependências
npm run dev      # ambiente de desenvolvimento → http://localhost:3000
npm run build    # build de produção
npm run start    # sobe o build de produção
npm run lint     # ESLint
```

## Estrutura

```
academia-romanos/
├── app/
│   ├── layout.tsx        # metadata, SEO, Open Graph, JSON-LD (LocalBusiness), fontes
│   ├── page.tsx          # monta as seções na ordem
│   ├── globals.css       # estilos base + utilitários (.container-x, .display, .kicker)
│   └── icon.svg          # favicon (emblema da marca)
├── components/
│   ├── Header.tsx        # 1. Header fixo + menu mobile
│   ├── Hero.tsx          # 2. Hero (primeira dobra)
│   ├── SocialProof.tsx   # 3. Faixa de números (contadores animados)
│   ├── HealthPositioning.tsx # 4. "Por que treinar" (saúde)
│   ├── Modalidades.tsx   # 5. Modalidades (cards)
│   ├── Horarios.tsx      # 6. Grade de horários
│   ├── Diferenciais.tsx  # 7. Diferenciais
│   ├── Depoimentos.tsx   # 8. Depoimentos (carrossel)
│   ├── Galeria.tsx       # 9. Galeria (masonry + lightbox)
│   ├── Localizacao.tsx   # 10. Mapa + CTA final
│   ├── Footer.tsx        # 11. Rodapé
│   ├── WhatsAppFloat.tsx # Botão flutuante de WhatsApp
│   └── ui/               # Reveal, WaButton, Logo, Counter, InstagramIcon
├── lib/
│   ├── site.ts           # ⭐ TODOS os dados/textos centrais (editar aqui)
│   └── cn.ts             # helper de classes
└── public/
    ├── logo.svg          # logo placeholder
    ├── og.svg            # imagem de compartilhamento (Open Graph)
    └── images/           # placeholders SVG da marca (hero, saúde, galeria)
```

## Onde editar o conteúdo

Quase tudo (número de WhatsApp, endereço, redes, mensagens prontas, navegação) está
centralizado em **[`lib/site.ts`](lib/site.ts)**. Horários ficam em
[`components/Horarios.tsx`](components/Horarios.tsx) e os depoimentos em
[`components/Depoimentos.tsx`](components/Depoimentos.tsx).

O WhatsApp já está configurado: **5511960176395**. Cada botão abre uma conversa com uma
mensagem pré-preenchida (ver `WA_MESSAGES` em `lib/site.ts`).

## ✅ Checklist `[CONFIRMAR]` com o cliente

Itens que precisam ser validados/substituídos antes de publicar:

| Item | Onde | Status |
|------|------|--------|
| **Logo oficial** (PNG/SVG do elmo de gladiador) | `public/logo.svg`, `components/ui/Logo.tsx`, `app/icon.svg` | placeholder |
| **Endereço completo + CEP** | `lib/site.ts` → `SITE.address` | placeholder |
| **Geolocalização (lat/lng)** | `lib/site.ts` → `SITE.geo` | aproximada |
| **Nº real de alunos atendidos** ("+4 mil") | `components/SocialProof.tsx` | a confirmar |
| **Horário da musculação** | `components/Horarios.tsx` (Musculação) | "horário livre" |
| **Depoimentos reais** (com autorização) | `components/Depoimentos.tsx` | placeholders |
| **Fotos reais** (estrutura/aulas) | `public/images/*` + `components/Galeria.tsx` / `HealthPositioning.tsx` | placeholders SVG |
| **Domínio do site** | `lib/site.ts` → `SITE.url` | placeholder |
| **Diferenciais** (complementar) | `components/Diferenciais.tsx` | base pronta |

## Imagens (placeholders → fotos reais)

As imagens são **placeholders SVG da marca** (preto + vermelho), geradas localmente — o
projeto não depende de nenhum serviço externo e não há risco de imagem quebrada no deploy.

Para usar as fotos reais:

1. Coloque os arquivos em `public/images/` (ex.: `hero.jpg`, `g1-musculacao.jpg`, ...).
2. Em [`components/Galeria.tsx`](components/Galeria.tsx) e
   [`HealthPositioning.tsx`](components/HealthPositioning.tsx), troque o `src` (e as
   dimensões `w`/`h` na galeria) pelas fotos reais — como já usamos `next/image`, a
   otimização passa a valer automaticamente.
3. No Hero ([`components/Hero.tsx`](components/Hero.tsx)), troque
   `url('/images/hero.svg')` pela foto de fundo.
4. Para fotos hospedadas em outro domínio (Cloudinary, Unsplash, etc.), adicione o
   domínio em `images.remotePatterns` no [`next.config.mjs`](next.config.mjs).

> Observação: `dangerouslyAllowSVG` está habilitado apenas para permitir os placeholders
> SVG locais via `next/image`. É seguro pois são arquivos próprios do projeto. Ao migrar
> 100% para fotos (JPG/PNG/WebP), você pode remover essa flag.

## Fontes

As fontes (**Anton** para títulos, **Inter** para o corpo) são carregadas via `<link>` no
[`app/layout.tsx`](app/layout.tsx). Funciona em qualquer ambiente, inclusive offline/CI.

Se preferir **self-hosting + otimização** (recomendado para Lighthouse), troque pelo
`next/font/google`:

```tsx
// app/layout.tsx
import { Anton, Inter } from 'next/font/google'
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
// aplique `${anton.variable} ${inter.variable}` no <html> e remova as tags <link>
```
E ajuste o `fontFamily` no `tailwind.config.ts` para usar as variáveis `var(--font-*)`.

## SEO

- `title`/`description` com foco local (Carapicuíba, COHAB 2 / COHAB 5, "perto de mim").
- Dados estruturados **LocalBusiness** (JSON-LD) em `app/layout.tsx`.
- Open Graph + Twitter Card (`public/og.svg`). Para garantir preview no WhatsApp em todos
  os casos, exporte uma versão **PNG 1200×630** e aponte `openGraph.images` para ela.
- `alt` descritivo em todas as imagens; `lang="pt-BR"`.

## Acessibilidade

Contraste alto (branco sobre preto), navegação por teclado, foco visível, áreas de toque
generosas no mobile, semântica (`header`/`nav`/`section`/`footer`), `aria-*` nos controles
e respeito a `prefers-reduced-motion`.

## Deploy (Vercel)

1. Suba o projeto para um repositório Git (GitHub/GitLab).
2. Importe na [Vercel](https://vercel.com/new) — o framework Next.js é detectado
   automaticamente, sem configuração extra.
3. (Opcional) Configure o domínio em `SITE.url` para metadata/OG corretos.
