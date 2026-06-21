"use strict";

/**
 * Painel de operações (servido pelo server.js sob OPS_PATH).
 * - Relatórios de acesso (reaproveita ops/logs/analyze.js)
 * - Controle do fail2ban: listar / desbanir / banir IPs (via fail2ban-client)
 * Protegido por Basic Auth (OPS_USER / OPS_PASS).
 */

const crypto = require("crypto");
const { execFile } = require("child_process");
const { loadRepoEnv, logFilesFor, parseSince } = require("./logs/loglib");
const { buildReport } = require("./logs/analyze");

loadRepoEnv();

const OPS_PATH = "/" + (process.env.OPS_PATH || "ops").replace(/^\/+|\/+$/g, "");
const OPS_USER = process.env.OPS_USER || "admin";
const OPS_PASS = process.env.OPS_PASS || "trocar-esta-senha";
const OPS_APP = process.env.OPS_APP || "servicos-tech";
const OPS_BAN_JAIL = process.env.OPS_BAN_JAIL || "servicostech-scanner";
const OPS_LOG = process.env.OPS_LOG || ""; // override do arquivo de log (teste)

// ---------- helpers ----------
function safeEqual(a, b) {
  const ba = Buffer.from(String(a)), bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
function checkAuth(req) {
  const h = req.headers.authorization || "";
  if (!h.startsWith("Basic ")) return false;
  let dec = "";
  try { dec = Buffer.from(h.slice(6), "base64").toString("utf8"); } catch (_) { return false; }
  const i = dec.indexOf(":");
  if (i === -1) return false;
  return safeEqual(dec.slice(0, i), OPS_USER) && safeEqual(dec.slice(i + 1), OPS_PASS);
}
function readBody(req, limit = 1 << 20) {
  return new Promise((resolve, reject) => {
    let d = "", n = 0;
    req.on("data", (c) => { n += c.length; if (n > limit) { reject(new Error("too_large")); req.destroy(); return; } d += c; });
    req.on("end", () => resolve(d));
    req.on("error", reject);
  });
}
function sendJson(res, obj, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
const isJail = (j) => /^[A-Za-z0-9_.-]{1,64}$/.test(j || "");
const isIp = (ip) => /^[0-9a-fA-F:.]{2,45}$/.test(ip || "");

// ---------- fail2ban ----------
function runF2b(args) {
  return new Promise((resolve) => {
    execFile("fail2ban-client", args, { timeout: 8000 }, (err, stdout, stderr) => {
      resolve({ ok: !err, out: stdout || "", err: (err && err.message) || String(stderr || "") });
    });
  });
}
async function listJails() {
  const r = await runF2b(["status"]);
  if (!r.ok) return { available: false, error: r.err, jails: [] };
  const m = r.out.match(/Jail list:\s*(.*)/);
  const names = m ? m[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
  const jails = [];
  for (const name of names) {
    const s = await runF2b(["status", name]);
    let banned = [];
    if (s.ok) {
      const bm = s.out.match(/Banned IP list:\s*(.*)/);
      banned = bm ? bm[1].split(/\s+/).map((x) => x.trim()).filter(Boolean) : [];
    }
    jails.push({ name, banned });
  }
  return { available: true, jails };
}

// ---------- página ----------
function bar(n, max) {
  const w = Math.round((n / Math.max(1, max)) * 100);
  return `<span class="barwrap"><span class="bar" style="width:${w}%"></span></span>`;
}
function renderDashboard(r, f2b, opts) {
  const since = opts.since, geo = opts.geo;
  const windows = ["6h", "24h", "7d", "30d"];
  const winLinks = windows.map((w) =>
    `<a class="chip${w === since ? " on" : ""}" href="${OPS_PATH}?since=${w}${geo ? "&geo=1" : ""}">${w}</a>`).join("");
  const geoLink = `<a class="chip${geo ? " on" : ""}" href="${OPS_PATH}?since=${since}${geo ? "" : "&geo=1"}">GeoIP ${geo ? "on" : "off"}</a>`;

  const st = r.status;
  const statusCards =
    `<div class="cards">
      <div class="kpi"><b>${r.meta.total}</b><span>requisições</span></div>
      <div class="kpi ok"><b>${st["2xx"]}</b><span>2xx</span></div>
      <div class="kpi warn"><b>${st["4xx"]}</b><span>4xx</span></div>
      <div class="kpi err"><b>${st["5xx"]}</b><span>5xx</span></div>
      <div class="kpi"><b>${st.errorPct.toFixed(1)}%</b><span>erros</span></div>
    </div>`;

  const maxRoute = Math.max(1, ...r.topRoutes.map((x) => x.count));
  const routes = r.topRoutes.map((x) =>
    `<tr><td>${esc(x.route)}</td><td class="num">${x.count}</td><td>${bar(x.count, maxRoute)}</td><td class="num">${x.avgMs.toFixed(1)}ms</td></tr>`).join("");

  const ips = r.topIps.map((x) =>
    `<tr><td class="mono">${esc(x.ip)}</td><td class="num">${x.count}</td><td class="num">${x.errors || ""}</td><td>${esc([x.country, x.city].filter(Boolean).join(" / "))}</td>
      <td><button class="btn-sm danger" onclick="ban('${esc(x.ip)}')">Banir</button></td></tr>`).join("");

  const sus = r.suspicious.length
    ? r.suspicious.map((x) => `<tr><td class="mono">${esc(x.path)}</td><td class="num">${x.count}</td><td class="num">${x.ips} IP</td></tr>`).join("")
    : `<tr><td colspan="3" class="muted">nenhum</td></tr>`;

  const refs = r.referers.length
    ? r.referers.map((x) => `<tr><td class="mono">${esc(x.ref)}</td><td class="num">${x.count}</td></tr>`).join("")
    : `<tr><td colspan="2" class="muted">nenhum</td></tr>`;

  const slow = r.slowRoutes.map((x) => `<tr><td>${esc(x.route)}</td><td class="num">${x.avgMs.toFixed(1)}ms</td><td class="num">${x.count}</td></tr>`).join("");

  const maxH = Math.max(1, ...r.perHour.map((x) => x.count));
  const hours = r.perHour.slice(-48).map((x) =>
    `<tr><td class="mono">${esc(x.hour)}</td><td class="num">${x.count}</td><td>${bar(x.count, maxH)}</td></tr>`).join("");

  const countries = (geo && r.countries.length)
    ? `<div class="panel"><h2>Países</h2><table>${r.countries.map((x) => `<tr><td>${esc(x.country)}</td><td class="num">${x.count}</td></tr>`).join("")}</table></div>`
    : "";

  // fail2ban
  let f2bHtml;
  if (!f2b.available) {
    f2bHtml = `<p class="muted">fail2ban indisponível ${f2b.error ? "(" + esc(f2b.error) + ")" : ""}. Roda no servidor onde o fail2ban está ativo.</p>`;
  } else {
    const jailOpts = f2b.jails.map((j) => `<option value="${esc(j.name)}">${esc(j.name)}</option>`).join("");
    const jails = f2b.jails.map((j) => {
      const rows = j.banned.length
        ? j.banned.map((ip) => `<tr><td class="mono">${esc(ip)}</td><td><button class="btn-sm" onclick="unban('${esc(j.name)}','${esc(ip)}')">Desbanir</button></td></tr>`).join("")
        : `<tr><td colspan="2" class="muted">nenhum banido</td></tr>`;
      return `<div class="jail"><h3>${esc(j.name)} <span class="muted">(${j.banned.length})</span></h3><table>${rows}</table></div>`;
    }).join("");
    f2bHtml = `${jails}
      <div class="banform">
        <input id="banip" class="inp" placeholder="IP para banir (v4/v6)" />
        <select id="banjail" class="inp">${jailOpts}</select>
        <button class="btn danger" onclick="banManual()">Banir</button>
      </div>`;
  }

  const periodo = r.meta.first ? esc(r.meta.first.toISOString().slice(0, 16)) + " → " + esc((r.meta.last || r.meta.first).toISOString().slice(0, 16)) : "";

  return `<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel Ops — Serviços Tech</title>
<style>
  :root{--primary:#0F2A3D;--primary-dark:#0A1E2C;--secondary:#1E88E5;--light:#F5F7FA;--white:#fff;--line:#E2E8F0;--slate:#5C6B7A;--ok:#16A34A;--warn:#D97706;--err:#DC2626;}
  *{box-sizing:border-box}body{margin:0;font-family:"Inter","Segoe UI",system-ui,Arial,sans-serif;background:var(--light);color:#111827;font-size:14px}
  header{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;padding:16px 22px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  header h1{margin:0;font-size:18px;font-weight:800}header .meta{color:rgba(255,255,255,.7);font-size:12.5px}
  .wrap{max-width:1180px;margin:0 auto;padding:20px}
  .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px}
  .chip{font-size:13px;font-weight:600;color:var(--primary);background:#fff;border:1px solid var(--line);border-radius:999px;padding:7px 14px;text-decoration:none}
  .chip.on{background:var(--secondary);color:#fff;border-color:var(--secondary)}
  .cards{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px}
  .kpi{flex:1;min-width:120px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px;box-shadow:0 8px 22px rgba(15,42,61,.05)}
  .kpi b{display:block;font-size:26px;font-weight:800;color:var(--primary)}.kpi span{color:var(--slate);font-size:12.5px}
  .kpi.ok b{color:var(--ok)}.kpi.warn b{color:var(--warn)}.kpi.err b{color:var(--err)}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media(max-width:820px){.grid{grid-template-columns:1fr}}
  .panel{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;box-shadow:0 8px 22px rgba(15,42,61,.05);margin-bottom:16px;overflow:hidden}
  .panel h2{margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:var(--slate)}
  table{width:100%;border-collapse:collapse}td{padding:7px 8px;border-bottom:1px solid var(--line);font-size:13.5px;vertical-align:middle}
  tr:last-child td{border-bottom:none}.num{text-align:right;white-space:nowrap;color:var(--primary);font-weight:600}
  .mono{font-family:ui-monospace,Consolas,monospace;font-size:12.5px;word-break:break-all}.muted{color:var(--slate)}
  .barwrap{display:block;height:8px;background:var(--light);border-radius:6px;overflow:hidden;min-width:60px}
  .bar{display:block;height:100%;background:var(--secondary)}
  .btn,.btn-sm{cursor:pointer;border:none;border-radius:8px;font-weight:600;font-family:inherit}
  .btn{padding:9px 16px;font-size:14px;background:var(--primary);color:#fff}
  .btn-sm{padding:5px 11px;font-size:12px;background:#eef2f7;color:var(--primary)}
  .btn-sm.danger,.btn.danger{background:#fde8e8;color:#b91c1c}.btn.danger{background:#b91c1c;color:#fff}
  .jail{margin-bottom:14px}.jail h3{margin:0 0 6px;font-size:14px;color:var(--primary)}
  .banform{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.inp{padding:9px 12px;border:1px solid var(--line);border-radius:8px;font:inherit;font-size:13.5px}
  .banform .inp:first-child{flex:1;min-width:180px}
</style></head><body>
<header>
  <h1>🛡️ Painel Ops</h1>
  <span class="meta">${periodo}${r.meta.total ? " &nbsp;|&nbsp; " + r.meta.total + " req em " + r.meta.files + " arquivo(s)" : ""}</span>
</header>
<div class="wrap">
  <div class="toolbar">Janela: ${winLinks} ${geoLink} <a class="chip" href="${OPS_PATH}?since=${since}${geo ? "&geo=1" : ""}">↻ atualizar</a></div>
  ${statusCards}

  <div class="panel"><h2>fail2ban — IPs banidos</h2>${f2bHtml}</div>

  <div class="grid">
    <div class="panel"><h2>Top rotas</h2><table>${routes}</table></div>
    <div class="panel"><h2>Top IPs${geo ? " (país/cidade)" : ""}</h2><table><tr><td class="muted">IP</td><td class="num muted">req</td><td class="num muted">err</td><td class="muted">local</td><td></td></tr>${ips}</table></div>
    <div class="panel"><h2>404 suspeitos (scanners)</h2><table>${sus}</table></div>
    <div class="panel"><h2>Referers</h2><table>${refs}</table></div>
    <div class="panel"><h2>Rotas mais lentas</h2><table>${slow}</table></div>
    ${countries}
  </div>

  <div class="panel"><h2>Requisições por hora</h2><table>${hours}</table></div>
</div>
<script>
  const BASE = ${JSON.stringify(OPS_PATH)};
  async function act(url, body){
    const r = await fetch(url, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
    const d = await r.json().catch(()=>({}));
    if(!r.ok || d.error){ alert("Erro: " + (d.error || ("HTTP "+r.status))); return; }
    location.reload();
  }
  function ban(ip){ if(confirm("Banir "+ip+"?")) act(BASE+"/api/ban", {ip}); }
  function unban(jail, ip){ if(confirm("Desbanir "+ip+"?")) act(BASE+"/api/unban", {jail, ip}); }
  function banManual(){
    const ip = document.getElementById("banip").value.trim();
    const jail = document.getElementById("banjail").value;
    if(!ip){ alert("Informe um IP."); return; }
    if(confirm("Banir "+ip+" no jail "+jail+"?")) act(BASE+"/api/ban", {ip, jail});
  }
</script>
</body></html>`;
}

// ---------- roteador ----------
async function handle(request, response) {
  if (!checkAuth(request)) {
    response.writeHead(401, { "WWW-Authenticate": 'Basic realm="Painel Ops", charset="UTF-8"', "Content-Type": "text/plain; charset=utf-8" });
    response.end("Autenticacao necessaria");
    return;
  }

  const url = new URL(request.url, "http://ops.local");
  const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";
  const sub = pathname === OPS_PATH ? "" : pathname.slice(OPS_PATH.length);
  const method = request.method || "GET";

  // APIs
  if (sub === "/api/unban" && method === "POST") {
    let b; try { b = JSON.parse(await readBody(request)); } catch (_) { return sendJson(response, { error: "json invalido" }, 400); }
    if (!isJail(b.jail) || !isIp(b.ip)) return sendJson(response, { error: "jail/ip invalido" }, 400);
    const r = await runF2b(["set", b.jail, "unbanip", b.ip]);
    return sendJson(response, r.ok ? { ok: true } : { error: r.err || "falhou" }, r.ok ? 200 : 500);
  }
  if (sub === "/api/ban" && method === "POST") {
    let b; try { b = JSON.parse(await readBody(request)); } catch (_) { return sendJson(response, { error: "json invalido" }, 400); }
    const jail = b.jail || OPS_BAN_JAIL;
    if (!isJail(jail) || !isIp(b.ip)) return sendJson(response, { error: "jail/ip invalido" }, 400);
    const r = await runF2b(["set", jail, "banip", b.ip]);
    return sendJson(response, r.ok ? { ok: true } : { error: r.err || "falhou" }, r.ok ? 200 : 500);
  }
  if (sub === "/api/report" && method === "GET") {
    const since = parseSince(url.searchParams.get("since") || "24h");
    const files = OPS_LOG ? [OPS_LOG] : logFilesFor(OPS_APP, "both");
    const r = await buildReport({ files, since, top: 20, withGeo: url.searchParams.get("geo") === "1" });
    return sendJson(response, r);
  }
  if (sub === "/api/fail2ban" && method === "GET") {
    return sendJson(response, await listJails());
  }

  // Dashboard
  if (sub === "" && method === "GET") {
    const sinceArg = url.searchParams.get("since") || "24h";
    const geo = url.searchParams.get("geo") === "1";
    const files = OPS_LOG ? [OPS_LOG] : logFilesFor(OPS_APP, "both");
    const r = await buildReport({ files, since: parseSince(sinceArg), top: 20, withGeo: geo });
    const f2b = await listJails();
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(renderDashboard(r, f2b, { since: sinceArg, geo }));
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Nao encontrado");
}

module.exports = { handle, OPS_PATH };
