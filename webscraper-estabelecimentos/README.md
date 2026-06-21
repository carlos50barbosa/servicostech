# Web Scraper — Estabelecimentos sem website (Google Maps)

Aplicação web em **Python + Flask + Playwright** que busca estabelecimentos no
Google Maps e extrai **Nome, Telefone, Cidade - UF e CEP**, mostrando **apenas
os que NÃO possuem website** (ideal para prospecção/leads).

## Instalação

```bash
# 1. (opcional) ambiente virtual
python -m venv .venv
.venv\Scripts\activate          # Windows PowerShell

# 2. dependências
pip install -r requirements.txt

# 3. baixar o navegador do Playwright (Chromium) — passo obrigatório!
python -m playwright install chromium
```

## Como usar

```bash
python app.py
```

Abra **http://127.0.0.1:5000** no navegador.

1. No campo **Buscas**, digite **uma busca por linha**, ex.:
   ```
   advogados em Osasco, SP
   advocacia em Pinheiros, SP
   advogado trabalhista em São Paulo, SP
   ```
2. Defina o **máximo por busca** (1–200) e marque/desmarque **Exigir telefone**.
3. Clique em **Buscar**. As buscas rodam em sequência e os resultados aparecem
   em tempo real. **Estabelecimentos repetidos entre buscas são removidos
   automaticamente.**
4. (Opcional) Use o campo **Filtrar por Cidade / UF** para refinar a lista
   exibida — ex.: digite `Osasco` ou `SP`. O contador mostra "Exibindo X de Y".
5. (Opcional) Preencha a **Mensagem padrão do WhatsApp** — use `{nome}` para
   inserir automaticamente o nome do estabelecimento. A mensagem fica salva no
   navegador. Clique no botão **WhatsApp** de qualquer linha para abrir a conversa
   já com a mensagem preenchida.
6. Exporte com **CSV** ou **Excel (.xlsx)**. As exportações respeitam o filtro
   ativo (baixam apenas o que está sendo exibido) e incluem o **link do WhatsApp**
   de cada contato.

> O Excel é gerado no servidor (`openpyxl`) com cabeçalho estilizado, primeira
> linha congelada, autofiltro e a coluna **WhatsApp** como link clicável.

### Botão e mensagem do WhatsApp

O telefone coletado é normalizado automaticamente para o formato do WhatsApp
(DDI 55 + DDD + número) e vira um link `https://wa.me/...`. A mensagem padrão
aceita o marcador `{nome}`, que é substituído pelo nome do estabelecimento na
hora de abrir a conversa. Exemplo:

```
Olá {nome}, tudo bem? Vi que vocês não têm site e gostaria de apresentar uma proposta.
```

### Como coletar o máximo de dados (modo lote)

O Google Maps entrega **no máximo ~120 resultados por busca** (limite do próprio
Google — não há como passar disso numa única pesquisa). Para coletar milhares de
registros, faça **muitas buscas e deixe o app deduplicar**:

- **Segmente por cidade/bairro:** `advogados em Osasco`, `advogados em Pinheiros`...
  Use o gerador **⚙ Gerar buscas por cidade**: informe o termo base (`advogados`)
  e uma lista de cidades/bairros (uma por linha) → o app monta as buscas para você.
- **Varie o termo:** `advogado`, `advocacia`, `advogado criminalista`,
  `advogado trabalhista`...

Cada busca soma até ~120 **novos** estabelecimentos; os repetidos são descartados
(deduplicação por nome + telefone).

> ⚠️ Muitas buscas seguidas aumentam o risco de **CAPTCHA/bloqueio** do Google.
> Há uma pausa automática entre buscas; se aparecer verificação, desmarque
> **"Navegador oculto"** para resolver manualmente na janela que abrir.

> Dica: desmarque **"Oculto (headless)"** para ver o navegador trabalhando —
> útil se o Google pedir verificação ou consentimento de cookies.

## Como funciona o filtro "sem site"

Para cada estabelecimento, o scraper abre o painel de detalhes e verifica se
existe o link de website (`a[data-item-id="authority"]`). Se **existir**, o item
é **ignorado**. Também ignora quem não tem telefone listado.

## Teste rápido pelo terminal (sem interface)

```bash
python scraper.py "advogados em São Paulo"
```

## Observações importantes

- **Uso responsável:** scraping do Google Maps é contra os Termos de Serviço do
  Google. Use com moderação, para fins legítimos. Volumes altos ou repetidos
  podem disparar bloqueio/CAPTCHA — nesse caso, rode com o navegador visível
  (headless desmarcado) e resolva manualmente, ou reduza a frequência.
- O Google muda o layout do Maps de tempos em tempos; se a extração parar de
  funcionar, os seletores em `scraper.py` (ex.: `h1.DUwDvf`, `a.hfpxzc`) podem
  precisar de ajuste.
- Alternativa mais estável (paga/cadastro): **Google Places API**.

## Estrutura

```
webscraper-adv/
├── app.py              # servidor Flask + streaming (SSE)
├── scraper.py          # lógica de scraping com Playwright
├── requirements.txt
├── templates/
│   └── index.html      # interface web
└── README.md
```
