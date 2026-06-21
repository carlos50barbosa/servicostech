#!/usr/bin/env node
"use strict";

/**
 * Relatório de acessos a partir dos logs do pm2.
 *
 * Uso:
 *   node ops/logs/report.js [--since 24h] [--app servicos-tech] [--top 15] [--geo]
 *   node ops/logs/report.js --log /caminho/arquivo.log --since 7d --geo
 *
 *   --since   janela: 24h, 7d, 90m, ou uma data ISO. Padrão: 24h
 *   --app     nome do app no pm2. Padrão: servicos-tech
 *   --top     quantos itens por ranking. Padrão: 15
 *   --geo     resolve país/cidade dos top IPs (MaxMind local ou ip-api.com)
 *   --log     usa um arquivo específico em vez dos logs do pm2
 */

const { loadRepoEnv, logFilesFor, iterAccess, isSuspiciousPath, isPrivateIp, geoLookup, parseSince } = require("./loglib");

loadRepoEnv(); // GEOIP_MMDB e afins do .env do repo

function arg(name, def) {
  const i = process.argv.indexOf("--" + name);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  if (!next || next.startsWith("--")) return true; // flag booleana
  return next;
}

function pct(n, total) {
  return total ? ((n / total) * 100).toFixed(1) + "%" : "0%";
}
function pad(s, n) {
  s = String(s);
  return s.length >= n ? s.slice(0, n) : s + " ".repeat(n - s.length);
}
function topN(map, n) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

async function main() {
  const sinceArg = arg("since", "24h");
  const since = parseSince(sinceArg);
  const app = arg("app", "servicos-tech");
  const top = Number(arg("top", "15")) || 15;
  const withGeo = !!arg("geo", false);
  const logOverride = arg("log", null);

  const files = logOverride && logOverride !== true ? [logOverride] : logFilesFor(app, "both");
  if (!files.length) {
    console.error("Nenhum arquivo de log encontrado para o app '" + app + "'.");
    console.error("Dica: passe --log /root/.pm2/logs/" + app + "-out.log");
    process.exit(1);
  }

  const byRoute = new Map();
  const byPath = new Map();
  const byIp = new Map();
  const ip4xx = new Map();
  const byHour = new Map();
  const byReferer = new Map();
  const routeMs = new Map(); // route -> {sum, n}
  const suspicious = new Map(); // path -> {count, ips:Set}
  const statusClass = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };
  let total = 0;
  let first = null, last = null;

  for (const e of iterAccess({ files, since })) {
    total++;
    if (e.time) { if (!first || e.time < first) first = e.time; if (!last || e.time > last) last = e.time; }

    const cls = Math.floor(e.status / 100) + "xx";
    if (statusClass[cls] !== undefined) statusClass[cls]++;

    byRoute.set(e.route, (byRoute.get(e.route) || 0) + 1);
    byPath.set(e.path, (byPath.get(e.path) || 0) + 1);

    if (!isPrivateIp(e.ip)) {
      byIp.set(e.ip, (byIp.get(e.ip) || 0) + 1);
      if (e.status >= 400) ip4xx.set(e.ip, (ip4xx.get(e.ip) || 0) + 1);
    }

    if (e.from) byReferer.set(e.from, (byReferer.get(e.from) || 0) + 1);

    const rm = routeMs.get(e.route) || { sum: 0, n: 0 };
    rm.sum += e.ms; rm.n++; routeMs.set(e.route, rm);

    if (e.time) {
      const h = e.time.toISOString().slice(0, 13).replace("T", " ") + "h";
      byHour.set(h, (byHour.get(h) || 0) + 1);
    }

    if (e.status === 404 && isSuspiciousPath(e.path)) {
      const s = suspicious.get(e.path) || { count: 0, ips: new Set() };
      s.count++; s.ips.add(e.ip); suspicious.set(e.path, s);
    }
  }

  // GeoIP nos top IPs
  let geo = {};
  if (withGeo) {
    const ipsToGeo = topN(byIp, top).map(([ip]) => ip);
    try { geo = await geoLookup(ipsToGeo); } catch (_) {}
  }

  // ---------- saída ----------
  const L = [];
  L.push("==================================================================");
  L.push("  RELATÓRIO DE ACESSOS — Serviços Tech");
  L.push("  Janela: " + sinceArg + (first ? "  (" + first.toISOString() + " → " + (last ? last.toISOString() : "?") + ")" : ""));
  L.push("  Arquivos: " + files.length + "   |   Requisições: " + total);
  L.push("==================================================================");

  L.push("\n## STATUS");
  for (const k of ["2xx", "3xx", "4xx", "5xx"]) {
    L.push("  " + pad(k, 5) + pad(statusClass[k], 8) + pct(statusClass[k], total));
  }
  const errRate = pct(statusClass["4xx"] + statusClass["5xx"], total);
  L.push("  -> erros (4xx+5xx): " + errRate);

  L.push("\n## TOP ROTAS");
  for (const [route, n] of topN(byRoute, top)) {
    const rm = routeMs.get(route) || { sum: 0, n: 1 };
    L.push("  " + pad(n, 7) + pad(pct(n, total), 8) + pad((rm.sum / rm.n).toFixed(1) + "ms", 10) + route);
  }

  L.push("\n## TOP PÁGINAS (path)");
  for (const [p, n] of topN(byPath, top)) L.push("  " + pad(n, 7) + p);

  L.push("\n## TOP IPs" + (withGeo ? "  (país/cidade)" : ""));
  for (const [ip, n] of topN(byIp, top)) {
    const e4 = ip4xx.get(ip) || 0;
    const g = geo[ip];
    const loc = g ? "  " + [g.country, g.city].filter(Boolean).join("/") : "";
    L.push("  " + pad(n, 7) + pad(ip, 22) + (e4 ? "(" + e4 + " erros)" : "") + loc);
  }

  if (withGeo) {
    const byCountry = new Map();
    for (const [ip, n] of byIp.entries()) {
      const g = geo[ip];
      if (g && g.country) byCountry.set(g.country, (byCountry.get(g.country) || 0) + n);
    }
    if (byCountry.size) {
      L.push("\n## PAÍSES (dos top IPs resolvidos)");
      for (const [c, n] of topN(byCountry, top)) L.push("  " + pad(n, 7) + c);
    }
  }

  L.push("\n## 404 SUSPEITOS (scanners/bots)");
  const susList = [...suspicious.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, top);
  if (!susList.length) L.push("  (nenhum)");
  for (const [p, s] of susList) L.push("  " + pad(s.count, 6) + pad(s.ips.size + " IP(s)", 9) + p);

  L.push("\n## REFERERS (de onde vêm)");
  const refs = topN(byReferer, top);
  if (!refs.length) L.push("  (nenhum referer registrado)");
  for (const [r, n] of refs) L.push("  " + pad(n, 7) + r);

  L.push("\n## ROTAS MAIS LENTAS (média de ms, mín. 5 hits)");
  const slow = [...routeMs.entries()]
    .filter(([, v]) => v.n >= 5)
    .map(([route, v]) => [route, v.sum / v.n, v.n])
    .sort((a, b) => b[1] - a[1])
    .slice(0, top);
  for (const [route, avg, n] of slow) L.push("  " + pad(avg.toFixed(1) + "ms", 10) + pad("(" + n + ")", 8) + route);

  L.push("\n## REQUISIÇÕES POR HORA");
  const hours = [...byHour.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const maxH = Math.max(1, ...hours.map(([, n]) => n));
  for (const [h, n] of hours.slice(-48)) {
    const bar = "█".repeat(Math.round((n / maxH) * 40));
    L.push("  " + pad(h, 16) + pad(n, 7) + bar);
  }

  L.push("");
  console.log(L.join("\n"));
}

main().catch((e) => { console.error(e); process.exit(1); });
