# BigFly Paragliding

Site institucional estático para a BigFly Paragliding, com layout responsivo, slider no banner, galeria, avaliações do Google editáveis e botões de WhatsApp.

## Como editar os dados principais

- Número do WhatsApp: altere `WHATSAPP_NUMBER` em `script.js`.
- Mensagens prontas do WhatsApp: edite `whatsappMessage` em cada idioma de `src/i18n/translations.js`.
- Instagram: edite o link no header/rodapé de `index.html`; local de atendimento: edite `meetingPoint` e `footer.location` em `src/i18n/translations.js`.
- Textos do site: edite as chaves dos idiomas `pt`, `en` e `es` em `src/i18n/translations.js`.
- Fotos reais: substitua as imagens em `assets/images/` ou ajuste os caminhos usados em `index.html`.
- Imagens do slider: atualmente usam `assets/images/foto-1.jpeg` até `assets/images/foto-5.jpeg`.
- Galeria: as fotos são carregadas de `assets/images/album/` com base em `GALLERY_IMAGE_COUNT` no `script.js`; no desktop mostra 6 fotos por vez com setas, e no mobile mostra 1 foto por vez.
- Fonte do site: Sora, carregada no `index.html` via Google Fonts e aplicada em `styles.css`.
- Link do perfil do Google: altere `GOOGLE_REVIEWS_URL` em `script.js`.
- Avaliações reais do Google: edite o array `googleReviews` em `script.js`.

O array de avaliações fica vazio por padrão para evitar conteúdo fictício publicado no site.

## Traduções

O idioma padrão é português (`pt`). O visitante pode alternar entre `PT`, `EN` e `ES`; a escolha fica salva no `localStorage`.

Para adicionar ou ajustar traduções, edite `src/i18n/translations.js`. Mantenha a mesma estrutura de chaves nos três idiomas para que o JavaScript consiga aplicar os textos automaticamente.

As avaliações reais do Google não são traduzidas automaticamente. Se precisar cadastrar textos por idioma, use um objeto no campo `texto`, por exemplo:

```js
{
  nome: "Nome do cliente",
  nota: 5,
  texto: {
    pt: "Texto original ou tradução em português.",
    en: "English version.",
    es: "Versión en español."
  },
  origem: "Google"
}
```
