#!/usr/bin/env node
"use strict";

/**
 * Relatório de acessos a partir dos logs do pm2 (formato texto).
 *
 * Uso:
 *   node ops/logs/report.js [--since 24h] [--app servicos-tech] [--top 15] [--geo]
 *   node ops/logs/report.js --log /caminho/arquivo.log --since 7d --geo
 */

const { loadRepoEnv, logFilesFor, parseSince } = require("./loglib");
const { buildReport } = require("./analyze");

loadRepoEnv();

function arg(name, def) {
  const i = process.argv.indexOf("--" + name);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  if (!next || next.startsWith("--")) return true;
  return next;
}
function pct(n) { return n.toFixed(1) + "%"; }
function pad(s, n) { s = String(s); return s.length >= n ? s : s + " ".repeat(n - s.length); }

async function main() {
  const sinceArg = arg("since", "24h");
  const since = parseSince(sinceArg);
  const app = arg("app", "servicos-tech");
  const top = Number(arg("top", "15")) || 15;
  const withGeo = !!arg("geo", false);
  const logOverride = arg("log", null);

  const files = logOverride && logOverride !== true ? [logOverride] : logFilesFor(app, "both");
  if (!files.length) {
    console.error("Nenhum log encontrado para o app '" + app + "'. Use --log /root/.pm2/logs/" + app + "-out.log");
    process.exit(1);
  }

  const r = await buildReport({ files, since, top, withGeo });
  const L = [];
  L.push("==================================================================");
  L.push("  RELATÓRIO DE ACESSOS — Serviços Tech");
  L.push("  Janela: " + sinceArg + (r.meta.first ? "  (" + r.meta.first.toISOString() + " → " + (r.meta.last ? r.meta.last.toISOString() : "?") + ")" : ""));
  L.push("  Arquivos: " + r.meta.files + "   |   Requisições: " + r.meta.total);
  L.push("==================================================================");

  L.push("\n## STATUS");
  for (const k of ["2xx", "3xx", "4xx", "5xx"]) L.push("  " + pad(k, 5) + pad(r.status[k], 8) + pct(r.meta.total ? (r.status[k] / r.meta.total) * 100 : 0));
  L.push("  -> erros (4xx+5xx): " + pct(r.status.errorPct));

  L.push("\n## TOP ROTAS");
  for (const x of r.topRoutes) L.push("  " + pad(x.count, 7) + pad(pct(x.pct), 8) + pad(x.avgMs.toFixed(1) + "ms", 10) + x.route);

  L.push("\n## TOP PÁGINAS (path)");
  for (const x of r.topPaths) L.push("  " + pad(x.count, 7) + x.path);

  L.push("\n## TOP IPs" + (withGeo ? "  (país/cidade)" : ""));
  for (const x of r.topIps) L.push("  " + pad(x.count, 7) + pad(x.ip, 24) + (x.errors ? "(" + x.errors + " erros)" : "") + (x.country ? "  " + [x.country, x.city].filter(Boolean).join("/") : ""));

  if (withGeo && r.countries.length) {
    L.push("\n## PAÍSES (dos top IPs resolvidos)");
    for (const x of r.countries) L.push("  " + pad(x.count, 7) + x.country);
  }

  L.push("\n## 404 SUSPEITOS (scanners/bots)");
  if (!r.suspicious.length) L.push("  (nenhum)");
  for (const x of r.suspicious) L.push("  " + pad(x.count, 6) + pad(x.ips + " IP(s)", 9) + x.path);

  L.push("\n## REFERERS (de onde vêm)");
  if (!r.referers.length) L.push("  (nenhum)");
  for (const x of r.referers) L.push("  " + pad(x.count, 7) + x.ref);

  L.push("\n## ROTAS MAIS LENTAS (média de ms, mín. 5 hits)");
  for (const x of r.slowRoutes) L.push("  " + pad(x.avgMs.toFixed(1) + "ms", 10) + pad("(" + x.count + ")", 8) + x.route);

  L.push("\n## REQUISIÇÕES POR HORA");
  const maxH = Math.max(1, ...r.perHour.map((x) => x.count));
  for (const x of r.perHour.slice(-48)) L.push("  " + pad(x.hour, 16) + pad(x.count, 7) + "█".repeat(Math.round((x.count / maxH) * 40)));

  L.push("");
  console.log(L.join("\n"));
}

main().catch((e) => { console.error(e); process.exit(1); });
