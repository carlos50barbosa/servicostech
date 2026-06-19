# Narimatsu Advogados — Site Institucional

Site institucional moderno, responsivo e estático (HTML + CSS + JS, sem dependências de build). Reformulação do site atual com foco em visual profissional, organização das informações, navegação no celular e pontos de contato diretos com o escritório.

## Estrutura

```
narimatsu-advogados/
├── index.html          # Página única: Início, Sobre, Áreas, Diferenciais, Notícias, Contato, Localização
├── styles.css          # Estilos (paleta azul-petróleo + dourado), responsivo
├── script.js           # Menu mobile, animações, formulário, notícias, WhatsApp
├── noticias-posts.js   # 📝 Lista de notícias/artigos — edite aqui para publicar
└── README.md
```

## Como visualizar

Basta abrir o `index.html` no navegador. Para um servidor local (recomendado p/ testar o mapa e o formulário):

```bash
# Python
python -m http.server 8000
# depois acesse http://localhost:8000
```

## ✅ Itens a personalizar antes de publicar

Os campos abaixo estão com **valores de exemplo** — substitua pelos dados reais:

| Item | Onde alterar | Valor atual (exemplo) |
|------|--------------|------------------------|
| **Número de WhatsApp** | `index.html` (3 links `wa.me/...`) e `script.js` (constante `WHATSAPP`) | `5511000000000` |
| **Telefone exibido** | `index.html`, seção Contato | `(11) 0000-0000` |
| **E-mail** | `index.html`, seção Contato | `contato@narimatsuadvogados.com` |
| **Links de redes sociais** | `index.html`, seção Contato e rodapé | Instagram / LinkedIn |

> O número de WhatsApp segue o formato internacional **DDI + DDD + número**, sem espaços ou símbolos. Ex.: `5511987654321`.

## Formulário de contato

Por padrão, o formulário monta a mensagem e **abre o WhatsApp** para o envio (não requer servidor).

Para receber as mensagens por **e-mail**, integre um serviço gratuito como [Formspree](https://formspree.io):

1. Crie um formulário no Formspree e copie o endpoint (ex.: `https://formspree.io/f/abc123`).
2. No `index.html`, ajuste a tag `<form>`:
   ```html
   <form class="contact-form" id="contact-form" action="https://formspree.io/f/SEU_ID" method="POST">
   ```
3. Remova/ajuste o `e.preventDefault()` no `script.js` se quiser usar o envio nativo do Formspree.

## 📝 Como publicar uma nova notícia

Toda a seção de **Notícias** é alimentada pelo arquivo **`noticias-posts.js`** — não é preciso mexer no HTML.

1. Abra `noticias-posts.js` em qualquer editor de texto.
2. Copie um bloco existente (do `{` até o `}`) e cole no **topo** da lista (logo após o `[`).
3. Preencha os campos:
   ```js
   {
     titulo: "Título da notícia",
     data: "2026-06-17",                 // formato AAAA-MM-DD
     resumo: "Frase curta que aparece no card.",
     conteudo: "Primeiro parágrafo.\n\nSegundo parágrafo.",  // \n\n separa parágrafos
     imagem: "imagens/foto.jpg"          // opcional — remova a linha se não houver
   },
   ```
4. Salve. O site ordena automaticamente da mais recente para a mais antiga e monta o card + a leitura completa (abre num leitor sobreposto).

> As notícias atuais já foram pré-cadastradas com base nos artigos do site original.

## Mapa

O mapa usa o embed gratuito do Google Maps apontando para **Av. Paulista, 1636, São Paulo**. Para trocar, edite o `src` do `<iframe>` na seção de localização.

## Melhorias já incluídas (além do solicitado)

- Cabeçalho fixo com navegação responsiva (menu hambúrguer no celular).
- Botão flutuante de WhatsApp com animação de destaque.
- Seção de **diferenciais** e cartões de **missão/valores**.
- Animações suaves de entrada (respeitam `prefers-reduced-motion`).
- SEO básico: meta tags, Open Graph e dados estruturados `LegalService` (schema.org).
- Aviso de conformidade com o **Código de Ética da OAB** no rodapé.
- Acessibilidade: navegação por teclado, `aria-labels` e contraste adequado.

## Publicação

Por ser estático, pode ser hospedado gratuitamente em: **Netlify**, **Vercel**, **GitHub Pages** ou **Cloudflare Pages**. Basta enviar a pasta.
