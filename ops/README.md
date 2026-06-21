# Ops — análise de logs, alertas, fail2ban e GeoIP

Ferramentas que rodam sobre os logs de acesso do `server.js` (capturados pelo
pm2 em `/root/.pm2/logs/servicos-tech-out.log`). **Sem dependências npm** —
só Node nativo + APIs por HTTPS.

> ⚠️ **Pré-requisito crítico:** o IP logado só é o do visitante real se o Nginx
> repassar `X-Forwarded-For`. Confirme que o server block do site principal tem:
> ```nginx
> proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
> proxy_set_header X-Real-IP $remote_addr;
> ```
> Sem isso, todos os IPs viram `127.0.0.1` (o proxy) e relatório/alerta/fail2ban
> ficam inúteis. Teste: `node ops/logs/report.js --since 1h | grep -A6 "TOP IPs"`.

---

## 0. Painel web (relatórios + controle de IPs banidos)
Dashboard servido pelo próprio Node em **`servicostech.com.br/ops`** (caminho e
senha configuráveis), protegido por Basic Auth. Mostra os relatórios (status,
top rotas/IPs com país/cidade, 404 suspeitos, referers, req/hora) **e** lista os
IPs banidos pelo fail2ban com botões de **Desbanir** / **Banir** (incl. banir um
IP direto da tabela de top IPs).

Config no `.env` (e `pm2 restart servicos-tech` depois):
```bash
OPS_USER=admin
OPS_PASS=uma-senha-forte
OPS_PATH=/painel-ops          # opcional: caminho secreto (padrao /ops)
OPS_BAN_JAIL=servicostech-scanner   # jail usado nos bans manuais
```
Requisitos: o app Node roda como **root** (já é o caso) para poder chamar o
`fail2ban-client`. Acesso: `https://servicostech.com.br${OPS_PATH:-/ops}`.

## 1. Relatório de acessos
```bash
cd /var/www/servicostech.com.br
node ops/logs/report.js --since 24h --top 15        # últimas 24h
node ops/logs/report.js --since 7d --geo            # 7 dias, com país/cidade
node ops/logs/report.js --log /root/.pm2/logs/servicos-tech-out.log --since 90m
```
Mostra: status (2xx/3xx/4xx/5xx + % de erro), top rotas (com ms médio), top
páginas, top IPs (com nº de erros e, com `--geo`, país/cidade), **404 suspeitos
de scanner**, referers, rotas mais lentas e requisições por hora.

Relatório diário por e-mail (cron):
```bash
crontab -e
# 8h todo dia:
0 8 * * * cd /var/www/servicostech.com.br && /usr/bin/node ops/logs/report.js --since 24h --geo | mail -s "Relatorio acessos" voce@dominio.com
```

---

## 2. Alerta de ataque (força-bruta no painel)
Detecta um IP com muitos `401` em caminhos `/admin*` numa janela e avisa.

**Configure os canais** no `.env` do site (o script lê o `.env` do repo):
```bash
# qualquer combinação:
ALERT_WHATSAPP_PHONE=5511915155349
ALERT_WHATSAPP_APIKEY=xxxxx        # grátis: https://www.callmebot.com/ (WhatsApp)
ALERT_WEBHOOK_URL=https://...      # Discord/Slack/Telegram/n8n/Make
ALERT_EMAIL_TO=voce@dominio.com    # usa o sendmail do sistema
# limiares (opcionais): ALERT_401_THRESHOLD=5  ALERT_401_WINDOW_MIN=15  ALERT_COOLDOWN_MIN=60
```
**Agende no cron** (a cada 5 min):
```bash
crontab -e
*/5 * * * * cd /var/www/servicostech.com.br && /usr/bin/node ops/logs/alert-admin.js >> /var/log/st-alert.log 2>&1
```
Testar agora (sem esperar o cron):
```bash
node ops/logs/alert-admin.js
```

---

## 3. fail2ban (banir IPs automaticamente)
Bane no firewall quem faz força-bruta no admin (401) ou varre paths de scanner (404).

```bash
# 1) instalar (Alma/Rocky/RHEL):
dnf install -y fail2ban
systemctl enable --now fail2ban

# 2) copiar filtros e jails do repo:
cd /var/www/servicostech.com.br
cp ops/fail2ban/filter.d/servicostech-admin.conf   /etc/fail2ban/filter.d/
cp ops/fail2ban/filter.d/servicostech-scanner.conf /etc/fail2ban/filter.d/
cp ops/fail2ban/jail.d/servicostech.local          /etc/fail2ban/jail.d/

# 3) recarregar e conferir:
systemctl restart fail2ban
fail2ban-client status
fail2ban-client status servicostech-admin
```
Testar se o filtro casa com os logs:
```bash
fail2ban-regex /root/.pm2/logs/servicos-tech-out.log /etc/fail2ban/filter.d/servicostech-admin.conf
fail2ban-regex /root/.pm2/logs/servicos-tech-out.log /etc/fail2ban/filter.d/servicostech-scanner.conf
```
Notas:
- Se usar **firewalld**, o fail2ban já bane via iptables-compat; se quiser nativo,
  acrescente nos jails `banaction = firewallcmd-rich-rules` (ou `nftables`).
- Se a data não for reconhecida, descomente o `datepattern` no `jail.d/servicostech.local`.
- Desbanir um IP: `fail2ban-client set servicostech-admin unbanip 1.2.3.4`.

---

## 4. GeoIP (país/cidade)
Por padrão o `--geo` usa o **ip-api.com** (grátis, sem cadastro, só resolve os top IPs).

Para usar a base **MaxMind** local (offline, sem limite):
```bash
# 1) crie conta grátis em https://www.maxmind.com e gere uma License Key
# 2) baixe o GeoLite2-City.mmdb e coloque em ops/geo/
mkdir -p /var/www/servicostech.com.br/ops/geo
#   (baixe GeoLite2-City.mmdb via geoipupdate ou pelo site, para ops/geo/)
# 3) instale o leitor e aponte no .env:
cd /var/www/servicostech.com.br && npm install maxmind
echo 'GEOIP_MMDB=/var/www/servicostech.com.br/ops/geo/GeoLite2-City.mmdb' >> .env
```
O `report.js --geo` passa a usar a base local automaticamente.

---

## Privacidade (LGPD)
IP é dado pessoal. Você já tem política de privacidade no site — garanta que ela
menciona a coleta de logs de acesso (base legal: legítimo interesse de
segurança/operação), defina retenção (o `pm2-logrotate` já limita o histórico) e,
para estatística, considere anonimizar o IP (mascarar o último octeto).
