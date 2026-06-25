# Binho Pinturas Automotivas e Funilaria — Landing Page

Landing page de **página única (one-page)**, responsiva e focada em **conversão via WhatsApp**, para a oficina de pintura automotiva e funilaria do Randerson Tenório (Binho).

> **Stack:** HTML5 + [Tailwind CSS](https://tailwindcss.com/) (Play CDN) + JavaScript puro. Site **estático**, fácil de hospedar no Netlify, Vercel ou GitHub Pages.

---

## 📁 Estrutura de pastas

```
binho-pintura-funilaria/
├── index.html              # Página completa (todas as seções)
├── css/
│   └── styles.css          # Estilos customizados, animações e componentes
├── js/
│   └── script.js           # Menu mobile, animações de scroll, FAQ, links WhatsApp
├── assets/
│   ├── logo.svg            # Logo (PLACEHOLDER — trocar pela oficial)
│   ├── favicon.svg         # Ícone da aba
│   └── img/
│       ├── hero-car.svg    # Ilustração do hero
│       ├── og-image.svg    # Imagem de compartilhamento (trocar por .jpg real)
│       ├── antes.svg / depois.svg   # Antes e depois (PLACEHOLDERS)
│       └── galeria-1..8.svg         # Galeria (PLACEHOLDERS)
└── README.md
```

---

## ▶️ Como rodar localmente

Como é um site estático, basta abrir o `index.html` no navegador. Mas o ideal é servir por um servidor local (para os caminhos e o `fetch`/CDN funcionarem perfeitamente):

**Opção 1 — Python (já vem no Windows/Mac/Linux):**
```bash
# na pasta do projeto
python -m http.server 5500
# acesse http://localhost:5500
```

**Opção 2 — Node (npx):**
```bash
npx serve .
# ou
npx http-server -p 5500
```

**Opção 3 — VS Code:** instale a extensão **Live Server** e clique em *“Go Live”*.

---

## 🚀 Como publicar (deploy)

### GitHub Pages
1. Suba a pasta para um repositório no GitHub.
2. **Settings → Pages → Branch:** selecione `main` / `/root` e salve.
3. O site fica disponível em `https://SEU-USUARIO.github.io/binho-pintura-funilaria/`.

### Netlify (mais simples)
- Acesse [app.netlify.com/drop](https://app.netlify.com/drop) e **arraste a pasta** do projeto. Pronto.
- Ou conecte o repositório do GitHub (sem build command — é estático).

### Vercel
- `npx vercel` na pasta, ou importe o repositório no painel da Vercel. Framework: **Other** (estático).

---

## ✏️ O que personalizar (checklist)

Todos os pontos abaixo estão **comentados no código** para facilitar:

- [ ] **Logo:** substituir `assets/logo.svg` e `assets/favicon.svg` pela arte oficial.
- [ ] **Fotos:** trocar os placeholders em `assets/img/` pelas fotos reais do Instagram
      [@binho_pintura_e_funilaria](https://www.instagram.com/binho_pintura_e_funilaria/).
      (Procure no `index.html` por `Substituir pelas fotos reais`.)
- [ ] **Imagem de compartilhamento (OG):** exportar uma `og-image.jpg` **1200×630** com foto real
      e atualizar as meta tags `og:image` / `twitter:image` (o WhatsApp nem sempre renderiza SVG).
- [ ] **Depoimentos:** os 3 depoimentos são genéricos — substituir por reais
      (procure por `depoimentos genéricos` no `index.html`).
- [ ] **Endereço / Mapa:** inserir o `<iframe>` do Google Maps no rodapé
      (procure por `INSERIR endereço/Google Maps`). **Não foi inventado nenhum endereço.**
- [ ] **Horário:** ajustar “Seg a Sáb — horário comercial” conforme o funcionamento real.
- [ ] **Domínio:** atualizar `link rel="canonical"`, `og:url` e `og:image` quando tiver o domínio.
- [ ] **WhatsApp:** o número está centralizado em `js/script.js` na constante `WHATSAPP_NUMBER`
      (atualmente `5582999946480`). Os textos das mensagens ficam no atributo `data-wa` de cada botão.

---

## 📞 Dados do negócio (já configurados)

- **WhatsApp:** (82) 99994-6480 → `https://wa.me/5582999946480`
- **Instagram:** [@binho_pintura_e_funilaria](https://www.instagram.com/binho_pintura_e_funilaria/)
- **Região:** Alagoas (DDD 82) — “atende toda a região”
- **Diferencial:** aceita pagamento no cartão

---

## ⚙️ (Opcional) Tailwind para produção

O projeto usa o **Play CDN** do Tailwind, que é ótimo para publicar rápido. Para uma versão
ainda mais leve em produção (CSS “purgado”), você pode compilar o Tailwind:

```bash
npm install -D tailwindcss
npx tailwindcss init
# configurar o content: ["./index.html", "./js/**/*.js"] no tailwind.config.js
npx tailwindcss -i ./css/input.css -o ./css/tailwind.build.css --minify
```
Depois, troque o `<script src="https://cdn.tailwindcss.com">` por
`<link rel="stylesheet" href="css/tailwind.build.css">` no `index.html`.

> Para uma landing page deste tamanho, o Play CDN já entrega ótima performance — o build é só um plus.

---

## 🧱 Seções da página

1. Header / Navbar fixo (com menu hambúrguer no mobile)
2. Hero (impacto + CTAs + selos de confiança)
3. Sobre / Por que escolher a Binho (diferenciais)
4. Serviços (grid de cards)
5. Tabela de Valores (Motos – Tanques · Motos – Carenagem/Peças · Carros)
6. Galeria + Antes e Depois
7. Depoimentos
8. Faixa de CTA
9. FAQ (acordeão)
10. Contato / Rodapé (WhatsApp, Instagram, localização, horário)
11. Botão flutuante de WhatsApp (pulsante)

---

Feito com foco em **velocidade, responsividade e conversão**. 💙
