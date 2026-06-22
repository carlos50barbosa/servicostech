#!/usr/bin/env bash
#
# Retencao dos logs de acesso (LGPD)
# ----------------------------------
# Os logs de acesso do app sao capturados pelo pm2 em /root/.pm2/logs.
# Esses logs contem dados pessoais (endereco IP). A Politica de Privacidade
# declara retencao de ATE 30 DIAS para logs de acesso/seguranca — este script
# configura o pm2-logrotate para fazer valer esse prazo (rotacao diaria,
# guardando ~30 arquivos => ~30 dias de historico).
#
# Rode UMA vez no servidor (e novamente se trocar a maquina/usuario do pm2):
#   bash ops/logs/setup-retention.sh
#
set -euo pipefail

RETAIN_DAYS="${RETAIN_DAYS:-30}"

# Modulo que rotaciona e expira os logs do pm2.
pm2 install pm2-logrotate

# Rotaciona todo dia a meia-noite.
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
# Mantem RETAIN_DAYS arquivos (1 por dia) e descarta os mais antigos.
pm2 set pm2-logrotate:retain "${RETAIN_DAYS}"
# Comprime os rotacionados e evita arquivos gigantes entre rotacoes.
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:max_size 50M

echo "pm2-logrotate configurado: rotacao diaria, retencao de ${RETAIN_DAYS} dias."
echo "Confira com: pm2 conf pm2-logrotate"
