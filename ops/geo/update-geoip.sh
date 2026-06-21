#!/usr/bin/env bash
# Atualiza a base MaxMind GeoLite2-City (alternativa ao geoipupdate).
# Lê a License Key de /etc/maxmind.key (chmod 600) ou da env MAXMIND_LICENSE_KEY.
# Destino: GEOIP_MMDB ou /usr/share/GeoIP/GeoLite2-City.mmdb
set -euo pipefail

KEY="${MAXMIND_LICENSE_KEY:-}"
if [ -z "$KEY" ] && [ -f /etc/maxmind.key ]; then KEY="$(tr -d '[:space:]' < /etc/maxmind.key)"; fi
if [ -z "$KEY" ]; then echo "ERRO: defina MAXMIND_LICENSE_KEY ou crie /etc/maxmind.key"; exit 1; fi

DEST="${GEOIP_MMDB:-/usr/share/GeoIP/GeoLite2-City.mmdb}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

URL="https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${KEY}&suffix=tar.gz"
curl -fsSL -o "$TMP/db.tgz" "$URL"
tar -xzf "$TMP/db.tgz" -C "$TMP"
install -m 0644 "$TMP"/GeoLite2-City_*/GeoLite2-City.mmdb "$DEST"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] GeoLite2-City atualizado em $DEST"
