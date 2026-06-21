"use strict";

/**
 * Canais de notificação para os alertas (sem dependências npm).
 * Configurados por variáveis de ambiente — qualquer combinação funciona:
 *
 *   WhatsApp (CallMeBot - grátis):
 *     ALERT_WHATSAPP_PHONE=5511915155349
 *     ALERT_WHATSAPP_APIKEY=123456        (obtido no https://www.callmebot.com/)
 *
 *   Webhook genérico (Discord/Slack/Telegram/n8n/Make):
 *     ALERT_WEBHOOK_URL=https://...        (recebe POST {text, content})
 *
 *   E-mail (usa o binário sendmail do sistema, se existir):
 *     ALERT_EMAIL_TO=voce@dominio.com
 *     ALERT_EMAIL_FROM=alertas@servicostech.com.br   (opcional)
 */

const { httpJson } = require("./loglib");
const { spawn } = require("child_process");
const https = require("https");

function getJson(url) {
  return new Promise((resolve) => {
    const req = https.request(new URL(url), { method: "GET", timeout: 8000 }, (resp) => {
      let raw = "";
      resp.on("data", (c) => (raw += c));
      resp.on("end", () => resolve({ status: resp.statusCode, body: raw }));
    });
    req.on("error", () => resolve({ status: 0, body: "" }));
    req.on("timeout", () => { req.destroy(); resolve({ status: 0, body: "" }); });
    req.end();
  });
}

async function sendWhatsApp(text) {
  const phone = process.env.ALERT_WHATSAPP_PHONE;
  const apikey = process.env.ALERT_WHATSAPP_APIKEY;
  if (!phone || !apikey) return false;
  const url =
    "https://api.callmebot.com/whatsapp.php?phone=" +
    encodeURIComponent(phone) +
    "&apikey=" + encodeURIComponent(apikey) +
    "&text=" + encodeURIComponent(text);
  const r = await getJson(url);
  return r.status >= 200 && r.status < 300;
}

async function sendWebhook(text) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return false;
  try {
    // text  -> Slack/Mattermost ;  content -> Discord ;  message -> genérico
    await httpJson(url, { text, content: text, message: text });
    return true;
  } catch (_) {
    return false;
  }
}

function sendEmail(subject, text) {
  return new Promise((resolve) => {
    const to = process.env.ALERT_EMAIL_TO;
    if (!to) return resolve(false);
    const from = process.env.ALERT_EMAIL_FROM || "alertas@servicostech.com.br";
    const msg =
      `From: Serviços Tech <${from}>\n` +
      `To: ${to}\n` +
      `Subject: ${subject}\n` +
      `Content-Type: text/plain; charset=UTF-8\n\n` +
      text + "\n";
    try {
      const sm = spawn("sendmail", ["-t"], { stdio: ["pipe", "ignore", "ignore"] });
      sm.on("error", () => resolve(false));
      sm.on("close", (code) => resolve(code === 0));
      sm.stdin.write(msg);
      sm.stdin.end();
    } catch (_) {
      resolve(false);
    }
  });
}

// Envia por todos os canais configurados. Retorna a lista de canais que deram certo.
async function notify(subject, text) {
  const full = subject ? subject + "\n\n" + text : text;
  const results = await Promise.all([
    sendWhatsApp(full).then((ok) => (ok ? "whatsapp" : null)),
    sendWebhook(full).then((ok) => (ok ? "webhook" : null)),
    sendEmail(subject || "Alerta Serviços Tech", text).then((ok) => (ok ? "email" : null))
  ]);
  return results.filter(Boolean);
}

module.exports = { notify, sendWhatsApp, sendWebhook, sendEmail };
