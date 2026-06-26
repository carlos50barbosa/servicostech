# Rodolfo Souza Crédito — Landing Page

Landing page de alta conversão (lead generation via WhatsApp) para serviço de
crédito/empréstimo no cartão, com estética **fintech premium**.

Construída com **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer
Motion + lucide-react**. Mobile-first, acessível e otimizada para SEO.

---

## 🚀 Como rodar

Pré-requisitos: **Node.js 18.17+** (testado no Node 24) e npm.

```bash
# 1. Instalar dependências
npm install

# 2. Ambiente de desenvolvimento (http://localhost:3000)
npm run dev

# 3. Build de produção + start
npm run build
npm run start
```

> A primeira execução baixa as fontes do Google (Sora e Inter) via `next/font`.
> É necessário acesso à internet no `build`/`dev`.

---

## ✏️ O que editar antes de publicar

Quase tudo do negócio está centralizado em **[`lib/config.ts`](lib/config.ts)**.
Edite lá e a página inteira é atualizada.

| O quê | Onde | Observação |
|------|------|-----------|
| WhatsApp / telefone | `CONTATO` | número internacional só com dígitos em `whatsappNumero` |
| Instagram | `CONTATO` | |
| Endereço / cidade / CEP | `ENDERECO` | usado no rodapé e no JSON-LD |
| **CNPJ e registro** | `LEGAL` | ⚠️ **PLACEHOLDERS** — preencher com dados reais |
| Taxa do simulador | `SIMULADOR.TAXA_MENSAL_PADRAO` | ⚠️ **ilustrativa** — só estimativa do site |
| Faixas do simulador | `SIMULADOR` | valor mín/máx, passo, parcelas |
| Mensagens dos CTAs | `MENSAGENS` | textos pré-preenchidos do `wa.me` |
| URL de produção | `SITE.url` | usada em metadata/OG/JSON-LD |

### ⚠️ Itens de conformidade (revisar com o responsável)

- **CNPJ / "credenciado e autorizado" / registro**: são placeholders. Validar com
  dados reais antes de ir ao ar (`lib/config.ts` → `LEGAL`).
- **Depoimentos**: os textos em [`components/Depoimentos.tsx`](components/Depoimentos.tsx)
  são **ilustrativos**. Substituir por relatos **reais e autorizados**.
- **Simulador**: exibe aviso de "valores aproximados, sujeitos a análise". A taxa
  real é definida na simulação oficial (WhatsApp). Não é oferta de crédito.
- O texto evita garantias absolutas de aprovação ("sujeito a análise").

---

## 🎨 Design System

Tokens de cor, fontes e sombras ficam em
[`tailwind.config.ts`](tailwind.config.ts):

- **Roxo** (marca): `roxo-900/700/500`
- **Navy** (seções escuras): `navy-900/800`
- **Dourado** (CTAs/destaques, uso comedido): `gold-500/400`
- **Verde** (PIX, checks): `green-500`
- Base clara: `cloud`, `mist`, `white` · Texto: `ink`
- Fontes: **Sora** (display) e **Inter** (corpo), via `next/font`

---

## 📁 Estrutura

```
app/
  layout.tsx        metadata, fontes, JSON-LD (FinancialService), lang pt-BR
  page.tsx          monta as seções na ordem de conversão
  globals.css       base, tokens CSS, prefers-reduced-motion
components/
  Header  Hero  Stats  Diferenciais  ComoFunciona  Simulador
  ParaQuemE  Depoimentos  FAQ  Sobre  CTAFinal  Footer  WhatsAppFloat
  CreditCard  Logo
  ui/  → Button  Card  Section  Container  Reveal  AnimatedCounter
lib/
  config.ts         dados do negócio + helpers de wa.me + formatadores
  cn.ts             utilitário de classes
public/
  favicon.svg  logo.svg  og-image.svg
tailwind.config.ts
```

---

## 🖼️ Imagem de compartilhamento (OG)

`public/og-image.svg` é gerada para o preview social. Para **máxima
compatibilidade** (alguns apps não renderizam SVG), exporte um **PNG 1200×630**
a partir dela e atualize as referências em
[`app/layout.tsx`](app/layout.tsx) (`openGraph.images` e `twitter.images`) de
`/og-image.svg` para `/og-image.png`.

---

## ♿ Acessibilidade & SEO

- HTML semântico, `aria-label` em ícones/botões, foco visível, FAQ e menu
  navegáveis por teclado, link "pular para o conteúdo".
- Respeita `prefers-reduced-motion`.
- Metadata completa, Open Graph + Twitter cards, favicon, `lang="pt-BR"`,
  JSON-LD `FinancialService` com endereço, telefone e geo.

---

## 📦 Deploy

Otimizado para **Vercel** (ou qualquer host Node):

```bash
npm run build && npm run start
```

Na Vercel: importe o repositório — o build é detectado automaticamente.
Lembre de configurar o domínio e atualizar `SITE.url` em `lib/config.ts`.
