# Deploy — Webscraper Estabelecimentos

App **Flask + Playwright** que roda em `127.0.0.1:5000`. No site principal ele é
servido em **`/webscraper-estabelecimentos`** por um *reverse proxy* feito no
`server.js` (Node) do repositório raiz — não precisa de Nginx para essa rota.

- Front (Node) → proxia `/webscraper-estabelecimentos/*` → Flask `127.0.0.1:5000`
- O template usa `const BASE = location.pathname...`, então os endpoints
  (`/scrape` via SSE e `/export/xlsx` via POST) funcionam tanto sob o subcaminho
  quanto em dev na raiz (`python app.py`).
- Porta/host do alvo são configuráveis no Node por `WEBSCRAPER_PORT` /
  `WEBSCRAPER_HOST` (padrão `127.0.0.1:5000`).

## Caminho na VPS
`/var/www/servicostech.com.br/webscraper-estabelecimentos`

## 1. Atualizar o código
```bash
cd /var/www/servicostech.com.br
git pull
```

## 2. Ambiente Python (uma vez)
```bash
cd /var/www/servicostech.com.br/webscraper-estabelecimentos
apt update && apt install -y python3 python3-venv python3-pip
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m playwright install --with-deps chromium
```

## 3. Serviço systemd
O arquivo está versionado em `deploy/webscraper.service`. Instale:
```bash
cp /var/www/servicostech.com.br/webscraper-estabelecimentos/deploy/webscraper.service \
   /etc/systemd/system/webscraper.service
systemctl daemon-reload
systemctl enable --now webscraper
systemctl status webscraper --no-pager
```

## 4. Conferir
```bash
curl -s -o /dev/null -w "flask local: %{http_code}\n" http://127.0.0.1:5000/
curl -s -o /dev/null -w "proxy:       %{http_code}\n" http://127.0.0.1:3000/webscraper-estabelecimentos
```
Ambos devem retornar **200**. Então `https://servicostech.com.br/webscraper-estabelecimentos` funciona.

## Atualizações futuras
```bash
cd /var/www/servicostech.com.br && git pull
systemctl restart webscraper            # se mudou o app Python
# reiniciar o processo do Node, se mudou o server.js
```

## Observações
- `--timeout 0` no gunicorn é essencial: o `/scrape` é um stream SSE longo;
  com timeout o gunicorn cortaria a raspagem no meio.
- `Environment=HOME=/root` faz o serviço achar os navegadores do Playwright
  instalados como root (`/root/.cache/ms-playwright`). Se instalar com outro
  usuário, ajuste `User=`/`HOME=` no `.service`.
- Logs do serviço: `journalctl -u webscraper -f`.
