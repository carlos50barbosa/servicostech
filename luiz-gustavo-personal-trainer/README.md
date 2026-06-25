# Luiz Gustavo — Personal Trainer · Landing Page

Landing page de página única, escura e atlética, para o personal trainer **Luiz Gustavo** (Batalha-AL · presencial e online). Construída para gerar autoridade e converter visitantes em clientes pelo WhatsApp.

**Stack:** Next.js (App Router) + TypeScript · Tailwind CSS · Framer Motion · lucide-react. Página 100% estática (SSG), rápida e otimizada para SEO. Pronta para deploy na Vercel.

---

## 🚀 Como rodar

Pré-requisitos: **Node.js 18.18+** (recomendado 20+).

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar em modo desenvolvimento (http://localhost:3000)
npm run dev

# 3. Gerar a versão de produção
npm run build

# 4. Rodar a versão de produção localmente
npm start
```

---

## ✅ Checklist antes de publicar

> Itens marcados com ⚠️ no código precisam de confirmação.

1. **Número do WhatsApp** — conferir e ajustar (ver abaixo).
2. **Fotos reais** — substituir os placeholders (ver abaixo).
3. **Depoimentos** — trocar os textos de exemplo pelos relatos reais dos alunos.
4. **Anos de experiência** — ajustar o texto sugerido na seção "Sobre".
5. **URL do site** — atualizar `BUSINESS.siteUrl` após o deploy.
6. **Imagem de capa (OG)** — trocar o SVG por um PNG/JPG 1200×630 (ver abaixo).

---

## 📱 Como editar o número do WhatsApp

Tudo fica centralizado em [`lib/config.ts`](lib/config.ts).

```ts
// ⚠️ Apenas dígitos: código do país (55) + DDD + número
export const WHATSAPP_NUMBER = "5582998350306";
```

> **Atenção:** o link do perfil aparece como `wa.me/551182998350306`, mas esse número
> tem dígitos a mais (Batalha-AL usa DDD **82**). O formato provável correto é
> `5582998350306`. **Confirme o número real do Luiz** antes de publicar.

Você também pode personalizar a mensagem padrão pré-preenchida:

```ts
export const WHATSAPP_MESSAGE =
  "Olá Luiz! Vim pela sua landing page e quero saber mais sobre o acompanhamento.";
```

Todos os botões da página usam essa configuração. Alguns CTAs enviam uma mensagem
mais específica (ex.: "Quero começar agora") através da função `whatsappLink("...")`.

O **Instagram** também é editável no mesmo arquivo:

```ts
export const INSTAGRAM_HANDLE = "personaltrainer_luizgustavo";
```

---

## 🖼️ Como trocar as fotos

As imagens hoje são **placeholders** (arquivos SVG na pasta [`public/`](public/)).
Procure pelos comentários `TODO` no código para localizar cada ponto.

| Onde aparece | Arquivo atual | Tamanho sugerido | Componente |
|---|---|---|---|
| **Logo** (header e rodapé) | `public/logo-luiz-gustavo.png` | PNG com fundo transparente | [`Header.tsx`](components/Header.tsx) · [`Footer.tsx`](components/Footer.tsx) |
| Foto do **Hero** | `public/perfil-luiz-gustavo.png` | 800×1000px (4:5) | [`components/Hero.tsx`](components/Hero.tsx) |
| Foto da seção **Sobre** | `public/perfil-luiz-gustavo.png` (reaproveitada) | 800×1000px (4:5) | [`components/Sobre.tsx`](components/Sobre.tsx) |
| **Capa social (OG)** | `public/og-image.svg` | 1200×630px | [`app/layout.tsx`](app/layout.tsx) |

> A foto do perfil é usada no Hero e reaproveitada (com enquadramento mais fechado)
> na seção "Sobre". Se quiser, coloque uma segunda foto (ex.: treinando) em `public/`
> e troque o `src` em `Sobre.tsx`.

**Passo a passo:**

1. Coloque a foto real em `public/` (ex.: `public/luiz-hero.jpg`).
2. No componente correspondente, troque o `src`:
   ```tsx
   // antes
   <Image src="/hero-placeholder.svg" ... />
   // depois
   <Image src="/luiz-hero.jpg" ... />
   ```
3. Atualize o texto `alt` para descrever a foto (acessibilidade/SEO).
4. (Opcional) Ao usar somente fotos `.jpg/.webp`, você pode remover as linhas
   `dangerouslyAllowSVG` de [`next.config.mjs`](next.config.mjs).

> **Capa social (OG):** redes como WhatsApp e Facebook **não renderizam SVG** na
> pré-visualização do link. Para o preview funcionar, exporte uma capa em
> **PNG ou JPG (1200×630)**, salve como `public/og-image.jpg` e atualize o
> caminho em `app/layout.tsx` (`openGraph.images` e `twitter.images`).

---

## ☁️ Como fazer deploy na Vercel

1. Suba o projeto para um repositório no **GitHub** (ou GitLab/Bitbucket):
   ```bash
   git init
   git add .
   git commit -m "Landing page Luiz Gustavo"
   git branch -M main
   git remote add origin <URL-DO-SEU-REPO>
   git push -u origin main
   ```
2. Acesse [vercel.com](https://vercel.com), clique em **Add New → Project** e
   importe o repositório.
3. A Vercel detecta o Next.js automaticamente — basta clicar em **Deploy**
   (não é necessário configurar build/output).
4. Após o deploy, copie a URL gerada e atualize `BUSINESS.siteUrl` em
   [`lib/config.ts`](lib/config.ts) para o SEO/Open Graph apontar para o domínio
   correto. Faça commit e a Vercel publica de novo.

> Alternativa rápida sem GitHub: `npm i -g vercel` e rode `vercel` na pasta do projeto.

---

## 🧱 Estrutura do projeto

```
app/
  layout.tsx        Fontes, metadata (SEO/OpenGraph) e JSON-LD
  page.tsx          Composição das seções
  globals.css       Tokens do design system e estilos base
components/
  Header.tsx        Cabeçalho fixo + menu mobile
  Hero.tsx          Primeira dobra (headline + CTAs + selos)
  Sobre.tsx         Sobre + mini-credenciais
  Beneficios.tsx    Por que ter um personal (6 cards)
  ParaQuem.tsx      Público-alvo
  Servicos.tsx      Serviços (presencial, online, etc.)
  ComoFunciona.tsx  Metodologia em passos
  FraseImpacto.tsx  Faixa de frase de impacto
  Depoimentos.tsx   Depoimentos (placeholders)
  Faq.tsx           Perguntas frequentes (acordeão)
  CtaFinal.tsx      Chamada final para o WhatsApp
  Footer.tsx        Rodapé
  WhatsappFloat.tsx Botão flutuante de WhatsApp
  Reveal.tsx        Helper de animação de entrada (Framer Motion)
lib/
  config.ts         ⭐ WhatsApp, Instagram, textos e dados do negócio
public/             Imagens placeholder (SVG)
tailwind.config.ts  Cores e fontes do design system
```

---

## 🎨 Design system

| Token | Cor | Uso |
|---|---|---|
| `ink` | `#0B0B0D` | Fundo escuro principal |
| `ink-soft` | `#15151A` | Cards / seções alternadas |
| `brand` | `#FF5722` | Acento laranja (energia) |
| `brand-light` | `#FF7A45` | Hover do laranja |
| `health` | `#22C55E` | Detalhes de "saúde" |
| `cloud` | `#F5F5F7` | Texto claro |
| `muted` | `#A1A1AA` | Texto secundário |

Tipografia: **Archivo** (display/headlines) + **Inter** (corpo), carregadas via
`next/font/google`.

---

© Luiz Gustavo · Personal Trainer · CREF 003920-G/AL — Batalha-AL.
