# Identidade visual da Servicos Tech

Este documento registra a paleta oficial do site e orienta o uso das cores nos componentes.

## Paleta oficial

| Cor | Hexadecimal | Uso recomendado |
| --- | --- | --- |
| Principal | `#0F2A3D` | Cor principal da marca. Usar em header, footer, titulos importantes e fundos institucionais. |
| Secundaria | `#1E88E5` | Cor de acao. Usar em botoes principais, links, destaques, icones e estados de foco. |
| Neutro escuro | `#111827` | Cor de textos principais, subtitulos fortes e elementos neutros escuros. |
| Fundo claro | `#F5F7FA` | Fundo geral das paginas e secoes claras. |
| Branco | `#FFFFFF` | Cards, formularios, areas internas e textos sobre fundos escuros. |

## Tokens CSS

As cores devem ser consumidas a partir das variaveis globais em `style.css`:

```css
:root {
  --color-primary: #0F2A3D;
  --color-secondary: #1E88E5;
  --color-dark: #111827;
  --color-light-bg: #F5F7FA;
  --color-white: #FFFFFF;
}
```

## Regras de aplicacao

- Header usa `--color-white` com links em `--color-dark` para leitura limpa. Footer e fundos institucionais podem usar `--color-primary`.
- Botoes principais usam `--color-secondary` com texto branco.
- Botoes secundarios usam fundo branco ou transparente com borda em `--color-secondary`.
- Cards, formularios e blocos internos usam `--color-white` sobre `--color-light-bg`.
- Textos principais usam `--color-dark`.
- Titulos de destaque usam `--color-primary`.
- Links, icones e pequenos destaques usam `--color-secondary`.
- Evitar novas cores soltas no CSS. Quando uma variacao for necessaria, preferir `rgba()` com os canais RGB ja centralizados em `:root`.
