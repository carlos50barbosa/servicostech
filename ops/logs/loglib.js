"use strict";

/**
 * Biblioteca compartilhada para análise dos logs de acesso do server.js.
 * Linha de log:
 *   [2026-06-21T16:21:08.162Z] INFO access route="..." path="..." status=200 ms=3.1 ip="1.2.3.4" from="..." ua="..."
 * Sem dependências npm (só módulos nativos do Node).
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const https = require("https");
const http = require("http");

// ---------- .env do repositório (para o cron não precisar de env inline) ----------
function loadRepoEnv() {
  const envPath = path.join(__dirname, "..", "..", ".env");
  let text;
  try { text = fs.readFileSync(envPath, "utf8"); } catch (_) { return; }
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(k) && process.env[k] === undefined) process.env[k] = v;
  }
}

// ---------- localização dos logs do pm2 ----------
function pm2LogDir() {
  const home = process.env.PM2_HOME || path.join(process.env.HOME || "/root", ".pm2");
  return path.join(home, "logs");
}

// Arquivos de log de um app pm2 (out = stdout/INFO/WARN, error = stderr/ERROR),
// incluindo rotacionados (pm2-logrotate) e .gz, ordenados do mais antigo ao mais novo.
function logFilesFor(appName, kind /* "out" | "error" | "both" */) {
  const dir = pm2LogDir();
  let names = [];
  try {
    names = fs.readdirSync(dir);
  } catch (_) {
    return [];
  }
  const kinds = kind === "both" ? ["out", "error"] : [kind || "out"];
  const re = new RegExp("^" + appName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "-(out|error)(__.*)?\\.log(\\.gz)?$");
  const files = names
    .map((n) => {
      const m = n.match(re);
      if (!m || !kinds.includes(m[1])) return null;
      const full = path.join(dir, n);
      let mtime = 0;
      try { mtime = fs.statSync(full).mtimeMs; } catch (_) {}
      return { full, mtime };
    })
    .filter(Boolean)
    .sort((a, b) => a.mtime - b.mtime)
    .map((f) => f.full);
  return files;
}

function readFileText(file) {
  const buf = fs.readFileSync(file);
  if (file.endsWith(".gz")) {
    try { return zlib.gunzipSync(buf).toString("utf8"); } catch (_) { return ""; }
  }
  return buf.toString("utf8");
}

// ---------- parsing ----------
function parseAccessLine(line) {
  const at = line.indexOf(" access ");
  if (at === -1) return null;

  const tsM = line.match(/\[([0-9T:.+\-Z]+)\]/);
  const time = tsM ? new Date(tsM[1]) : null;
  const lvlM = line.match(/\b(INFO|WARN|ERROR)\b/);
  const level = lvlM ? lvlM[1] : "";

  const rest = line.slice(at + 8);
  const fields = {};
  const re = /(\w+)=("(?:[^"\\]|\\.)*"|\S+)/g;
  let m;
  while ((m = re.exec(rest))) {
    let v = m[2];
    if (v[0] === '"') {
      try { v = JSON.parse(v); } catch (_) { v = v.slice(1, -1); }
    } else if (/^-?\d+(?:\.\d+)?$/.test(v)) {
      v = Number(v);
    }
    fields[m[1]] = v;
  }
  if (fields.status === undefined || fields.path === undefined) return null;

  return {
    time,
    level,
    route: fields.route || "",
    path: String(fields.path || ""),
    status: Number(fields.status),
    ms: Number(fields.ms) || 0,
    ip: String(fields.ip || ""),
    from: String(fields.from || ""),
    ua: String(fields.ua || "")
  };
}

// Gera as entradas de acesso a partir dos arquivos, filtrando por janela (since: Date|null).
function* iterAccess({ files, since = null }) {
  for (const file of files) {
    let text;
    try { text = readFileText(file); } catch (_) { continue; }
    for (const line of text.split(/\r?\n/)) {
      if (!line) continue;
      const e = parseAccessLine(line);
      if (!e) continue;
      if (since && (!e.time || e.time < since)) continue;
      yield e;
    }
  }
}

// ---------- 404 suspeitos (scanners) ----------
const SCANNER_RE = new RegExp(
  [
    "wp-login", "wp-admin", "wp-content", "wp-includes", "xmlrpc\\.php",
    "\\.env", "\\.git", "\\.aws", "\\.ssh", "id_rsa",
    "phpmyadmin", "pma", "myadmin", "adminer",
    "/vendor/", "/cgi-bin/", "/actuator", "/console", "/solr",
    "\\.php$", "\\.asp$", "\\.aspx$", "\\.jsp$",
    "/shell", "/backup", "/\\.well-known/security", "/owa/", "/boaform",
    "eval-stdin", "/config\\.", "/server-status", "/\\.vscode", "/telescope"
  ].join("|"),
  "i"
);
function isSuspiciousPath(p) {
  return SCANNER_RE.test(p || "");
}

// IP local/privado (não geolocaliza nem trata como visitante externo)
function isPrivateIp(ip) {
  if (!ip || ip === "unknown") return true;
  if (ip === "::1" || ip.startsWith("127.") || ip.startsWith("::ffff:127.")) return true;
  if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80")) return true;
  return false;
}

// ---------- GeoIP ----------
// 1) Se GEOIP_MMDB apontar para um GeoLite2-City.mmdb e o pacote "maxmind" existir, usa local.
// 2) Senão, usa o batch gratuito do ip-api.com (http, até 100 IPs por chamada).
async function geoLookup(ips) {
  const unique = [...new Set(ips.filter((ip) => !isPrivateIp(ip)))];
  const out = {};
  if (!unique.length) return out;

  // Tentativa local (MaxMind)
  const mmdb = process.env.GEOIP_MMDB;
  if (mmdb && fs.existsSync(mmdb)) {
    try {
      const maxmind = require("maxmind");
      const reader = await maxmind.open(mmdb);
      for (const ip of unique) {
        try {
          const r = reader.get(ip);
          if (r) {
            out[ip] = {
              country: (r.country && r.country.iso_code) || "",
              city: (r.city && r.city.names && (r.city.names.pt || r.city.names.en)) || ""
            };
          }
        } catch (_) {}
      }
      return out;
    } catch (_) {
      // pacote maxmind não instalado -> cai no fallback HTTP
    }
  }

  // Fallback: ip-api.com batch (http)
  for (let i = 0; i < unique.length; i += 100) {
    const chunk = unique.slice(i, i + 100);
    try {
      const res = await httpJson("http://ip-api.com/batch?fields=status,country,city,query", chunk);
      if (Array.isArray(res)) {
        for (const item of res) {
          if (item && item.status === "success") {
            out[item.query] = { country: item.country || "", city: item.city || "" };
          }
        }
      }
    } catch (_) {}
  }
  return out;
}

function httpJson(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === "https:" ? https : http;
    const data = body != null ? JSON.stringify(body) : null;
    const req = lib.request(
      u,
      {
        method: body != null ? "POST" : "GET",
        headers: data ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } : {},
        timeout: 8000
      },
      (resp) => {
        let raw = "";
        resp.on("data", (c) => (raw += c));
        resp.on("end", () => {
          try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("timeout")));
    if (data) req.write(data);
    req.end();
  });
}

// ---------- util ----------
function parseSince(arg) {
  if (!arg) return null;
  const m = String(arg).match(/^(\d+)([hdm])$/);
  if (m) {
    const n = Number(m[1]);
    const mult = m[2] === "h" ? 3600e3 : m[2] === "d" ? 86400e3 : 60e3;
    return new Date(Date.now() - n * mult);
  }
  const d = new Date(arg);
  return isNaN(d.getTime()) ? null : d;
}

module.exports = {
  loadRepoEnv,
  pm2LogDir,
  logFilesFor,
  parseAccessLine,
  iterAccess,
  isSuspiciousPath,
  isPrivateIp,
  geoLookup,
  httpJson,
  parseSince
};
