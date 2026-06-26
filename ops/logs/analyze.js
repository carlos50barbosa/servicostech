"use strict";

/**
 * Agregação dos logs de acesso em uma estrutura pronta para exibir
 * (usada pelo CLI report.js e pelo painel web ops/panel.js).
 */

const { iterAccess, isSuspiciousPath, isPrivateIp, geoLookup, brtHourKey } = require("./loglib");

function topN(map, n) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

async function buildReport({ files, since = null, top = 15, withGeo = false }) {
  const byRoute = new Map();
  const byPath = new Map();
  const byIp = new Map();
  const ip4xx = new Map();
  const byHour = new Map();
  const byReferer = new Map();
  const routeMs = new Map();
  const suspicious = new Map();
  const statusClass = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };
  let total = 0, first = null, last = null;

  for (const e of iterAccess({ files, since })) {
    total++;
    if (e.time) {
      if (!first || e.time < first) first = e.time;
      if (!last || e.time > last) last = e.time;
    }
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
      const h = brtHourKey(e.time); // bucket por hora no fuso de Brasília
      byHour.set(h, (byHour.get(h) || 0) + 1);
    }
    if (e.status === 404 && isSuspiciousPath(e.path)) {
      const s = suspicious.get(e.path) || { count: 0, ips: new Set() };
      s.count++; s.ips.add(e.ip); suspicious.set(e.path, s);
    }
  }

  let geo = {};
  if (withGeo) {
    try { geo = await geoLookup(topN(byIp, top).map(([ip]) => ip)); } catch (_) {}
  }

  const pctOf = (n) => (total ? (n / total) * 100 : 0);

  const topIps = topN(byIp, top).map(([ip, count]) => ({
    ip, count, errors: ip4xx.get(ip) || 0,
    country: (geo[ip] && geo[ip].country) || "",
    city: (geo[ip] && geo[ip].city) || ""
  }));

  const countries = new Map();
  if (withGeo) {
    for (const [ip, n] of byIp.entries()) {
      const g = geo[ip];
      if (g && g.country) countries.set(g.country, (countries.get(g.country) || 0) + n);
    }
  }

  return {
    meta: { total, first, last, files: files.length },
    status: {
      "2xx": statusClass["2xx"], "3xx": statusClass["3xx"],
      "4xx": statusClass["4xx"], "5xx": statusClass["5xx"],
      errorPct: pctOf(statusClass["4xx"] + statusClass["5xx"])
    },
    topRoutes: topN(byRoute, top).map(([route, count]) => {
      const rm = routeMs.get(route) || { sum: 0, n: 1 };
      return { route, count, pct: pctOf(count), avgMs: rm.sum / rm.n };
    }),
    topPaths: topN(byPath, top).map(([path, count]) => ({ path, count })),
    topIps,
    countries: topN(countries, top).map(([country, count]) => ({ country, count })),
    suspicious: [...suspicious.entries()]
      .sort((a, b) => b[1].count - a[1].count).slice(0, top)
      .map(([path, s]) => ({ path, count: s.count, ips: s.ips.size })),
    referers: topN(byReferer, top).map(([ref, count]) => ({ ref, count })),
    slowRoutes: [...routeMs.entries()]
      .filter(([, v]) => v.n >= 5)
      .map(([route, v]) => ({ route, avgMs: v.sum / v.n, count: v.n }))
      .sort((a, b) => b.avgMs - a.avgMs).slice(0, top),
    perHour: [...byHour.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([hour, count]) => ({ hour, count }))
  };
}

// Eventos individuais (log viewer): retorna as entradas mais recentes que batem os
// filtros, em ordem decrescente de horário, com paginação (offset/limit).
// filters: { ip, status ("2xx".."5xx" | "err" | "404" | ""), q (path/rota/ua), suspicious }
async function buildEvents({ files, since = null, filters = {}, limit = 200, offset = 0, withGeo = false }) {
  const ipf = filters.ip || "";
  const ql = filters.q ? String(filters.q).toLowerCase() : "";
  const st = String(filters.status || "");
  const stClass = /^[2-5]xx$/.test(st) ? Number(st[0]) : null;
  const stExact = /^\d{3}$/.test(st) ? Number(st) : null;
  const wantErr = st === "err";
  const onlySusp = !!filters.suspicious;

  const keep = Math.max(1, offset + limit);
  const buf = []; // janela com os últimos `keep` matches (ordem crescente)
  let scanned = 0, matched = 0;

  for (const e of iterAccess({ files, since })) {
    scanned++;
    if (ipf && e.ip !== ipf) continue;
    if (stClass !== null && Math.floor(e.status / 100) !== stClass) continue;
    if (stExact !== null && e.status !== stExact) continue;
    if (wantErr && e.status < 400) continue;
    if (onlySusp && !isSuspiciousPath(e.path)) continue;
    if (ql && !(
      e.path.toLowerCase().includes(ql) ||
      (e.route || "").toLowerCase().includes(ql) ||
      (e.ua || "").toLowerCase().includes(ql)
    )) continue;

    matched++;
    buf.push(e);
    if (buf.length > keep) buf.shift(); // mantém só a cauda (mais recentes)
  }

  const page = buf.reverse().slice(offset, offset + limit); // mais recentes primeiro

  let geo = {};
  if (withGeo) {
    try { geo = await geoLookup(page.map((e) => e.ip)); } catch (_) {}
  }

  return {
    meta: {
      scanned, matched, returned: page.length, offset, limit,
      hasMore: matched > offset + page.length, files: files.length
    },
    events: page.map((e) => ({
      time: e.time ? e.time.toISOString() : "",
      level: e.level,
      route: e.route,
      path: e.path,
      status: e.status,
      ms: e.ms,
      ip: e.ip,
      from: e.from,
      ua: e.ua,
      suspicious: isSuspiciousPath(e.path),
      country: (geo[e.ip] && geo[e.ip].country) || "",
      city: (geo[e.ip] && geo[e.ip].city) || ""
    }))
  };
}

module.exports = { buildReport, buildEvents, topN };
