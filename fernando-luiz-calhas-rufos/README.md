# Fernando Luiz — Calhas e Rufos · Landing Page

Landing page profissional, moderna e 100% responsiva para a empresa **Fernando Luiz — Calhas e Rufos** (Campinas e região).

> _"Qualidade que protege, serviço que dura."_

Construída com **Next.js (App Router) + TypeScript**, **Tailwind CSS**, **Framer Motion** e **lucide-react**. Sem back-end: o formulário de contato abre o WhatsApp com a mensagem já preenchida.

---

## ✨ Recursos

- ⚡ **Next.js 14 (App Router)** com TypeScript
- 🎨 **Tailwind CSS** com design tokens da marca (azul-marinho + dourado)
- 🎬 **Framer Motion** — animações sutis on-scroll (respeitam `prefers-reduced-motion`)
- 📱 **Mobile-first** e responsivo (testado em 360px, 768px e 1280px)
- ♿ **Acessível** — tags semânticas, `alt`, contraste, foco visível e `aria-label`
- 🟢 **Botão flutuante de WhatsApp** em todas as seções
- 📝 **Formulário** que monta a mensagem e abre o WhatsApp (sem servidor)
- 🔍 **SEO** — metadata, Open Graph, Twitter Card, JSON-LD `LocalBusiness`, `sitemap.ts`, `robots.ts`
- 🗂️ **Conteúdo 100% centralizado** em [`lib/site-config.ts`](lib/site-config.ts)

---

## 🚀 Como rodar localmente

Pré-requisitos: **Node.js 18.18+** (recomendado 20+) e **npm**.

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar em modo de desenvolvimento
npm run dev
```

Abra **http://localhost:3000** no navegador.

### Outros comandos

```bash
npm run build   # gera a build de produção
npm run start   # roda a build de produção localmente
npm run lint    # checa o código com o ESLint
```

---

## ✏️ Onde editar o conteúdo (IMPORTANTE)

> **Quase tudo que o cliente precisa alterar está em um único arquivo:**
> [`lib/site-config.ts`](lib/site-config.ts)

| O que você quer mudar                      | Onde, em `lib/site-config.ts`            |
| ------------------------------------------ | ---------------------------------------- |
| **Telefone** exibido                       | `contact.phoneDisplay`                   |
| **Telefone** do link de ligar (`tel:`)     | `contact.phoneTel`                       |
| **Número do WhatsApp**                      | `contact.whatsapp.number`                |
| **Mensagem padrão** do WhatsApp            | `contact.whatsapp.defaultMessage`        |
| **Instagram**                               | `contact.instagram`                      |
| **Links do menu**                           | `navLinks`                               |
| **Textos do hero** (título, subtítulo)     | `hero`                                   |
| **Diferenciais** (4 cards)                  | `diferenciais`                           |
| **Serviços** (cards)                        | `servicos`                               |
| **Benefícios** ("Por que cuidar...")        | `beneficios`                             |
| **Texto do "Sobre"**                        | `sobre`                                  |
| **Imagens da galeria**                      | `galeria`                                |
| **Depoimentos**                             | `depoimentos`                            |
| **Cidades atendidas**                       | `areaAtuacao.cities`                     |
| **Perguntas do FAQ**                        | `faq`                                    |
| **Opções do select do formulário**         | `tiposDeServico`                         |
| **Título/descrição para SEO e URL do site**| `seo`                                    |

> ⚠️ Ao trocar o número de telefone, atualize **os dois campos**: `contact.phoneDisplay`
> (exibição) **e** `contact.phoneTel` + `contact.whatsapp.number` (links).

---

## 🖼️ Onde trocar as imagens e o logo

Os arquivos atuais são **placeholders** (em SVG, com a paleta da marca). Substitua-os
mantendo o **mesmo nome de arquivo** — assim nada quebra no código.

| Imagem                       | Arquivo                                   | Proporção sugerida |
| ---------------------------- | ----------------------------------------- | ------------------ |
| Logo (fundo claro)           | `public/logo.svg`                         | —                  |
| Logo (fundo escuro)          | `public/logo-light.svg`                   | —                  |
| Imagem do hero               | `public/images/hero.svg`                  | 4:3 (ex.: 1200×900)|
| Imagem dos benefícios        | `public/images/beneficios.svg`            | 5:4 (ex.: 1000×800)|
| Foto do "Sobre"              | `public/images/sobre.svg`                 | 9:10 (ex.: 900×1000)|
| Galeria (6 fotos)            | `public/images/galeria-1.svg` … `-6.svg`  | 4:3 (ex.: 800×600) |
| Capa de compartilhamento (OG)| `public/images/og-image.svg`              | 1200×630           |

> 💡 **Dica:** se você substituir os SVGs por arquivos **`.jpg`/`.png`/`.webp`**, lembre-se de
> atualizar os caminhos correspondentes em `lib/site-config.ts` (galeria) e nos componentes
> que usam a imagem (ex.: `components/Hero.tsx`). Para fotos reais, formatos `.webp`/`.jpg`
> trazem melhor performance.
>
> O **logo** é renderizado por um componente SVG em [`components/Logo.tsx`](components/Logo.tsx)
> (para adaptar a cor ao fundo). Se preferir usar o arquivo de imagem oficial, troque o
> conteúdo desse componente por um `<Image src="/logo.svg" ... />`.

Onde houver placeholder, há um comentário no código: `{/* TROCAR: ... */}`.

---

## 📂 Estrutura do projeto

```
/app
  layout.tsx        # metadata, fontes (next/font), JSON-LD LocalBusiness
  page.tsx          # monta as seções na ordem
  globals.css       # estilos globais + classes utilitárias (.btn-gold, etc.)
  sitemap.ts        # sitemap.xml automático
  robots.ts         # robots.txt automático
  icon.svg          # favicon
/components
  Header.tsx        # navbar fixa, transparente que solidifica no scroll + menu mobile
  Hero.tsx          # primeira dobra (headline, CTAs, prova rápida, imagem)
  Diferenciais.tsx  # 4 cards com ícone dourado
  Servicos.tsx      # grid de serviços
  Beneficios.tsx    # "Por que cuidar das suas calhas?"
  Sobre.tsx         # apresentação do Fernando Luiz
  Galeria.tsx       # grade de imagens dos trabalhos
  Depoimentos.tsx   # depoimentos com estrelas
  AreaAtuacao.tsx   # cidades atendidas
  Faq.tsx           # acordeão de perguntas frequentes
  Contato.tsx       # CTA final + formulário que abre o WhatsApp
  Footer.tsx        # rodapé
  WhatsAppFloat.tsx # botão flutuante de WhatsApp
  ScrollProgress.tsx# barra de progresso no topo
  Reveal.tsx        # wrapper de animação on-scroll (Framer Motion)
  Logo.tsx          # logo SVG (adapta a cor ao fundo)
  SectionHeading.tsx# cabeçalho padrão de seção
  icons/
    WhatsAppIcon.tsx# ícone da marca WhatsApp
/lib
  site-config.ts    # 👈 TODOS os dados editáveis do site
/public
  logo.svg, logo-light.svg
  /images           # placeholders (hero, benefícios, sobre, galeria, og-image)
```

---

## ☁️ Deploy na Vercel

A Vercel é a forma mais simples de publicar um projeto Next.js.

1. Suba este projeto para um repositório no **GitHub** (ou GitLab/Bitbucket).
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New… → Project"**.
3. Importe o repositório. A Vercel detecta o Next.js automaticamente
   (Framework Preset: **Next.js**) — não precisa configurar nada.
4. Clique em **Deploy**. Em poucos instantes o site estará no ar.

> Não há variáveis de ambiente obrigatórias.

### Depois de publicar

- Atualize `seo.siteUrl` em [`lib/site-config.ts`](lib/site-config.ts) com a URL final
  (ex.: `https://www.seudominio.com.br`). Isso garante OG, sitemap e JSON-LD corretos.
- (Opcional) Configure um **domínio próprio** nas configurações do projeto na Vercel.

### Alternativa: deploy via CLI

```bash
npm i -g vercel
vercel        # segue o assistente
vercel --prod # publica em produção
```

---

## 🎨 Identidade visual (design tokens)

Definidos em [`tailwind.config.ts`](tailwind.config.ts):

| Token         | Cor       | Uso                                       |
| ------------- | --------- | ----------------------------------------- |
| `navy`        | `#0B1E3F` | Fundos escuros, header, footer, hero      |
| `navy-light`  | `#13294B` | Cards/seções escuras secundárias          |
| `gold`        | `#F2A900` | CTAs, ícones, detalhes, headings-chave    |
| `gold-dark`   | `#D8920A` | Hover dos botões dourados                 |
| `silver`      | `#C9D1D9` | Detalhes metálicos / linhas               |
| `light`       | `#F8FAFC` | Fundo de seções claras                    |
| `ink`         | `#1A2332` | Texto principal em fundo claro            |
| `muted`       | `#64748B` | Texto secundário                          |

- **Títulos:** Montserrat (700/800), em caixa-alta nas chamadas principais.
- **Corpo:** Inter.
- Ambas carregadas via `next/font` (sem requisições externas em runtime).

---

## 📄 Licença

Projeto desenvolvido sob medida para **Fernando Luiz — Calhas e Rufos**.
Sinta-se à vontade para adaptar conforme a necessidade do negócio.
