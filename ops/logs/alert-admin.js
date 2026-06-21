#!/usr/bin/env node
"use strict";

/**
 * Alerta de força-bruta no painel: se um IP fizer >= N respostas 401 em
 * caminhos de admin dentro de uma janela de X minutos, notifica (WhatsApp/
 * webhook/e-mail). Pensado para rodar via cron a cada poucos minutos.
 *
 * Uso:   node ops/logs/alert-admin.js
 *
 * Config (env):
 *   ALERT_401_THRESHOLD     padrão 5     (qtde de 401 para disparar)
 *   ALERT_401_WINDOW_MIN    padrão 15    (janela em minutos)
 *   ALERT_COOLDOWN_MIN      padrão 60    (não re-alerta o mesmo IP antes disso)
 *   ALERT_ADMIN_MATCH       padrão admin (regex no path, case-insensitive)
 *   ALERT_APP               padrão servicos-tech
 *   + canais em notify.js (ALERT_WHATSAPP_*, ALERT_WEBHOOK_URL, ALERT_EMAIL_TO)
 */

const fs = require("fs");
const path = require("path");
const { loadRepoEnv, logFilesFor, iterAccess } = require("./loglib");
const { notify } = require("./notify");

loadRepoEnv(); // carrega ALERT_*/canais do .env do repo

const THRESHOLD = Number(process.env.ALERT_401_THRESHOLD || 5);
const WINDOW_MIN = Number(process.env.ALERT_401_WINDOW_MIN || 15);
const COOLDOWN_MIN = Number(process.env.ALERT_COOLDOWN_MIN || 60);
const ADMIN_RE = new RegExp(process.env.ALERT_ADMIN_MATCH || "admin", "i");
const APP = process.env.ALERT_APP || "servicos-tech";

const STATE_DIR = path.join(__dirname, ".state");
const STATE_FILE = path.join(STATE_DIR, "admin-alerts.json");

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); } catch (_) { return {}; }
}
function saveState(s) {
  try { fs.mkdirSync(STATE_DIR, { recursive: true }); fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2)); } catch (_) {}
}

async function main() {
  const since = new Date(Date.now() - WINDOW_MIN * 60e3);
  const files = process.env.ALERT_LOG ? [process.env.ALERT_LOG] : logFilesFor(APP, "out"); // 401 = WARN -> stdout
  if (!files.length) { console.error("Sem logs para o app", APP); process.exit(0); }

  const perIp = new Map(); // ip -> {count, paths:Set, last:Date}
  for (const e of iterAccess({ files, since })) {
    if (e.status !== 401 || !ADMIN_RE.test(e.path)) continue;
    const o = perIp.get(e.ip) || { count: 0, paths: new Set(), last: null };
    o.count++; o.paths.add(e.path); if (!o.last || (e.time && e.time > o.last)) o.last = e.time;
    perIp.set(e.ip, o);
  }

  const state = loadState();
  const now = Date.now();
  const offenders = [...perIp.entries()].filter(([, o]) => o.count >= THRESHOLD);

  let alerted = 0;
  for (const [ip, o] of offenders) {
    const lastAlert = state[ip] || 0;
    if (now - lastAlert < COOLDOWN_MIN * 60e3) continue; // ainda em cooldown

    const text =
      "🚨 Possível ataque ao painel\n" +
      "IP: " + ip + "\n" +
      "401 em " + o.count + " tentativas nos últimos " + WINDOW_MIN + " min\n" +
      "Caminhos: " + [...o.paths].join(", ") + "\n" +
      "Última: " + (o.last ? o.last.toISOString() : "?");
    const channels = await notify("Serviços Tech — alerta de segurança", text);

    state[ip] = now;
    alerted++;
    console.log("[alert] IP " + ip + " (" + o.count + " 401) -> canais: " + (channels.join(", ") || "NENHUM configurado"));
  }

  // limpa estado antigo (> 24h) para não crescer
  for (const ip of Object.keys(state)) {
    if (now - state[ip] > 86400e3) delete state[ip];
  }
  saveState(state);

  if (!offenders.length) console.log("[alert] ok — nenhum IP acima do limite (" + THRESHOLD + " 401 em " + WINDOW_MIN + " min)");
  else if (!alerted) console.log("[alert] " + offenders.length + " IP(s) suspeito(s), todos ainda em cooldown");
}

main().catch((e) => { console.error(e); process.exit(1); });
