# Serviços Tech

Site institucional da Serviços Tech (`servicostech.com.br`) servido com Node.js, sem dependências externas.

## Canais oficiais

- E-mail: contato@servicostech.com.br
- WhatsApp: (11) 91515-5349
- Instagram: https://www.instagram.com/servicostech.br/

## Como executar

Instale o Node.js e rode:

```bash
npm start
```

Depois acesse:

```text
http://localhost:3000
```

Para usar outra porta:

```powershell
$env:PORT=4173; npm start
```

## Google Analytics 4

Configure o Measurement ID do GA4 como variavel de ambiente antes de iniciar o servidor:

```powershell
$env:VITE_GA_MEASUREMENT_ID="G-ZERSFR2192"; npm start
```

Em hospedagem/producao, cadastre `VITE_GA_MEASUREMENT_ID` no painel de variaveis de ambiente. O ID deve ser obtido em uma propriedade Google Analytics 4.

O script do Google Analytics so e carregado depois que o visitante clica em "Aceitar" na barra de cookies. Se o visitante clicar em "Recusar", o consentimento fica salvo no `localStorage` como `cookieConsent = "rejected"` e o Analytics nao e carregado.
