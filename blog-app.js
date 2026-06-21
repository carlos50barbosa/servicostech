"use strict";

/**
 * Modulo de blog dinamico da Serviços Tech.
 * Servido quando o Host e o subdominio do blog (ver BLOG_HOST no server.js).
 * - Posts ficam em blog-data/posts.json (fora do git; nao conflita com git pull).
 * - Imagens enviadas pelo painel ficam em blog-data/uploads/.
 * - Painel em /admin protegido por Basic Auth (BLOG_ADMIN_USER / BLOG_ADMIN_PASS).
 * - Render reaproveita blog/styles.css (mesma identidade visual).
 */

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const BLOG_DIR = path.join(ROOT, "blog"); // styles.css, assets/ (versionados)
const DATA_DIR = path.join(ROOT, "blog-data"); // dados locais da VPS (gitignored)
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const SEED_FILE = path.join(ROOT, "blog-seed.json"); // seed inicial versionado

const ADMIN_USER = process.env.BLOG_ADMIN_USER || "admin";
const ADMIN_PASS = process.env.BLOG_ADMIN_PASS || "trocar-esta-senha";

const SITE_URL = "https://servicostech.com.br";
const WHATSAPP =
  "https://wa.me/5511915155349?text=Ol%C3%A1!%20Vim%20pelo%20blog%20da%20Servi%C3%A7os%20Tech%20e%20gostaria%20de%20um%20or%C3%A7amento.";
const CATEGORIES = [
  "Presença Digital",
  "Estratégia",
  "Design",
  "Performance",
  "SEO",
  "Conversão",
  "Tecnologia"
];

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

// ---------- armazenamento ----------
function ensureDirs() {
  for (const dir of [DATA_DIR, UPLOADS_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(POSTS_FILE)) {
    let seed = [];
    if (fs.existsSync(SEED_FILE)) {
      try {
        seed = JSON.parse(fs.readFileSync(SEED_FILE, "utf8"));
      } catch (_) {
        seed = [];
      }
    }
    fs.writeFileSync(POSTS_FILE, JSON.stringify(seed, null, 2));
  }
}

async function loadPosts() {
  try {
    const raw = await fsp.readFile(POSTS_FILE, "utf8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

async function savePosts(posts) {
  await fsp.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// ---------- helpers ----------
function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "post"
  );
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function readingTime(body) {
  const words = String(body || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function stripMarkdown(md) {
  return String(md || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFrom(body, limit = 160) {
  const text = stripMarkdown(body);
  return text.length > limit ? text.slice(0, limit).trim() + "…" : text;
}

// Markdown minimo e seguro (escapa HTML antes de aplicar a formatacao).
function renderMarkdown(md) {
  const blocks = String(md || "").replace(/\r\n/g, "\n").split(/\n{2,}/);
  const inline = (s) =>
    escapeHtml(s)
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br />");

  const html = [];
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    const lines = block.split("\n");
    if (/^#{1,3}\s/.test(block)) {
      // pode haver varios headings/linhas; trata heading por linha
      for (const line of lines) {
        const m = line.match(/^(#{1,3})\s+(.*)$/);
        if (m) html.push(`<h${m[1].length + 1}>${inline(m[2])}</h${m[1].length + 1}>`);
        else if (line.trim()) html.push(`<p>${inline(line)}</p>`);
      }
    } else if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      html.push("<ul>" + lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ""))}</li>`).join("") + "</ul>");
    } else if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      html.push("<ol>" + lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ""))}</li>`).join("") + "</ol>");
    } else if (lines.every((l) => /^\s*>\s?/.test(l))) {
      html.push("<blockquote>" + inline(lines.map((l) => l.replace(/^\s*>\s?/, "")).join("\n")) + "</blockquote>");
    } else {
      html.push(`<p>${inline(block)}</p>`);
    }
  }
  return html.join("\n");
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function checkAuth(request) {
  const header = request.headers.authorization || "";
  if (!header.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch (_) {
    return false;
  }
  const idx = decoded.indexOf(":");
  if (idx === -1) return false;
  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);
  return safeEqual(user, ADMIN_USER) && safeEqual(pass, ADMIN_PASS);
}

function readBody(request, limit = 16 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("payload_too_large"));
        request.destroy();
        return;
      }
      data += chunk;
    });
    request.on("end", () => resolve(data));
    request.on("error", reject);
  });
}

function sendHtml(response, html, status = 200) {
  response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  response.end(html);
}
function sendJson(response, obj, status = 200) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(obj));
}

// ---------- componentes visuais ----------
function pageHead(title, description) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description || "")}" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>`;
}

function siteHeader() {
  return `<header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="Serviços Tech"><img src="/assets/logo-azul.png" alt="Serviços Tech" width="200" height="46" /></a>
      <nav class="header-nav" aria-label="Navegação do blog">
        <a class="nav-link back-link" href="${SITE_URL}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Voltar ao site
        </a>
        <a class="btn btn-primary" href="${WHATSAPP}" target="_blank" rel="noopener">Orçamento</a>
      </nav>
    </div>
  </header>`;
}

function siteFooter() {
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col footer-brand">
        <img src="/assets/logo-branca.png" alt="Serviços Tech" />
        <p>Sites profissionais para empresas que querem transmitir mais confiança e gerar mais contatos.</p>
        <div class="footer-social" aria-label="Redes sociais">
          <a href="https://www.instagram.com/servicostech.br/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M17.2 6.8h.1"/></svg></a>
          <a href="https://wa.me/5511915155349" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 19l1.2-3.8A7.2 7.2 0 1 1 9 18.6z"/><path d="M9 9.5c.7 2.5 2.2 4 5 5"/></svg></a>
        </div>
      </div>
      <nav class="footer-col" aria-label="Site">
        <h4>Site</h4>
        <a href="${SITE_URL}/#inicio">Início</a>
        <a href="${SITE_URL}/#beneficios">Benefícios</a>
        <a href="${SITE_URL}/#portfolio">Portfólio</a>
        <a href="${SITE_URL}/#contato">Contato</a>
      </nav>
      <nav class="footer-col" aria-label="Blog">
        <h4>Blog</h4>
        <a href="/">Todos os artigos</a>
      </nav>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} Serviços Tech. Todos os direitos reservados.</span>
      <span>blog.servicostech.com.br</span>
    </div>
  </footer>`;
}

function coverHtml(post, big = false) {
  const tag = `<span class="tag">${escapeHtml(post.category || "Artigo")}</span>`;
  if (post.cover) {
    return `<span class="cover cover-img${big ? " cover-big" : ""}" style="background-image:url('${escapeHtml(post.cover)}')">${tag}</span>`;
  }
  return `<span class="cover${big ? " cover-big" : ""}">${tag}</span>`;
}

function cardHtml(post) {
  const href = `/p/${escapeHtml(post.slug)}`;
  return `<article class="card">
    <a class="cover-link" href="${href}" aria-label="${escapeHtml(post.title)}">${coverHtml(post)}</a>
    <div class="card-body">
      <h3><a href="${href}">${escapeHtml(post.title)}</a></h3>
      <p>${escapeHtml(post.excerpt || excerptFrom(post.body))}</p>
      <div class="meta"><span>${formatDate(post.createdAt)}</span><span class="dot"></span><span>${readingTime(post.body)} min</span></div>
      <a class="read-more" href="${href}">Ler artigo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
    </div>
  </article>`;
}

function renderIndex(posts) {
  const published = posts.filter((p) => p.published !== false).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const [featured, ...rest] = published;

  let body = "";
  if (!published.length) {
    body = `<p style="text-align:center;color:var(--slate);padding:40px 0">Ainda não há artigos publicados.</p>`;
  } else {
    const featuredHtml = `<article class="card featured">
      <a class="cover-link" href="/p/${escapeHtml(featured.slug)}">${coverHtml(featured, true)}</a>
      <div class="card-body">
        <h3><a href="/p/${escapeHtml(featured.slug)}">${escapeHtml(featured.title)}</a></h3>
        <p>${escapeHtml(featured.excerpt || excerptFrom(featured.body))}</p>
        <div class="meta"><span>${formatDate(featured.createdAt)}</span><span class="dot"></span><span>${readingTime(featured.body)} min de leitura</span></div>
        <a class="read-more" href="/p/${escapeHtml(featured.slug)}">Ler artigo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      </div>
    </article>`;
    const grid = rest.length
      ? `<h2 class="section-title">Últimos artigos</h2><div class="grid">${rest.map(cardHtml).join("")}</div>`
      : "";
    body = featuredHtml + grid;
  }

  return (
    pageHead("Blog | Serviços Tech", "Dicas e estratégias sobre sites, presença digital e tecnologia.") +
    siteHeader() +
    `<section class="hero"><div class="container">
      <span class="eyebrow">Blog da Serviços Tech</span>
      <h1>Ideias e estratégias para o seu negócio crescer online</h1>
      <p class="lead">Conteúdo prático sobre criação de sites, presença digital, performance e tecnologia.</p>
    </div></section>
    <main class="posts"><div class="container">${body}</div></main>` +
    siteFooter() +
    "</body></html>"
  );
}

function renderPostPage(post) {
  return (
    pageHead(`${post.title} | Blog Serviços Tech`, post.excerpt || excerptFrom(post.body)) +
    siteHeader() +
    `<main class="post-wrap"><article class="container post">
      <a class="back-to-blog" href="/">&larr; Todos os artigos</a>
      <span class="post-tag">${escapeHtml(post.category || "Artigo")}</span>
      <h1 class="post-title">${escapeHtml(post.title)}</h1>
      <div class="post-meta"><span>${formatDate(post.createdAt)}</span><span class="dot"></span><span>${readingTime(post.body)} min de leitura</span></div>
      ${post.cover ? `<div class="post-cover" style="background-image:url('${escapeHtml(post.cover)}')"></div>` : `<div class="post-cover post-cover-grad"></div>`}
      <div class="article">${renderMarkdown(post.body)}</div>
      <div class="post-cta">
        <p>Quer um site profissional como os que falamos aqui?</p>
        <a class="btn btn-primary" href="${WHATSAPP}" target="_blank" rel="noopener">Falar no WhatsApp</a>
      </div>
    </article></main>` +
    siteFooter() +
    "</body></html>"
  );
}

// ---------- painel /admin ----------
function renderAdmin() {
  const cats = CATEGORIES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  return `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Painel do Blog — Serviços Tech</title>
<style>
  :root{--primary:#0F2A3D;--secondary:#1E88E5;--light:#F5F7FA;--line:#E2E8F0;--slate:#5C6B7A;}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Segoe UI",system-ui,Arial,sans-serif;background:var(--light);color:#111827;}
  header{background:var(--primary);color:#fff;padding:16px 24px;display:flex;justify-content:space-between;align-items:center}
  header h1{font-size:18px;font-weight:700}
  header a{color:#cfe6f7;text-decoration:none;font-size:14px}
  .wrap{max-width:1100px;margin:24px auto;padding:0 20px;display:grid;grid-template-columns:1fr 1.3fr;gap:24px}
  @media(max-width:820px){.wrap{grid-template-columns:1fr}}
  .panel{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px}
  .panel h2{font-size:15px;text-transform:uppercase;letter-spacing:.06em;color:var(--slate);margin-bottom:14px}
  .post-item{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px;border:1px solid var(--line);border-radius:10px;margin-bottom:10px}
  .post-item .t{font-weight:600;color:var(--primary);font-size:15px}
  .post-item .s{font-size:12.5px;color:var(--slate)}
  .post-item .badge{font-size:11px;font-weight:700;border-radius:999px;padding:2px 8px;background:#e7f1fb;color:#1565C0}
  .post-item .badge.off{background:#fde8e8;color:#b91c1c}
  .row-actions{display:flex;gap:6px;flex-shrink:0}
  button,.btn{font:inherit;font-weight:600;border:none;border-radius:8px;padding:9px 14px;cursor:pointer}
  .btn-edit{background:#eef2f7;color:var(--primary)}
  .btn-del{background:#fde8e8;color:#b91c1c}
  .btn-primary{background:var(--primary);color:#fff}
  .btn-ghost{background:transparent;color:var(--slate)}
  label{display:block;font-size:13px;font-weight:600;color:var(--primary);margin:14px 0 6px}
  input,select,textarea{width:100%;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:#fff}
  textarea{min-height:240px;resize:vertical;font-family:ui-monospace,Consolas,monospace;font-size:13.5px}
  .hint{font-size:12px;color:var(--slate);margin-top:4px}
  .actions{display:flex;gap:10px;margin-top:18px}
  .preview{margin-top:8px;max-height:140px;border-radius:8px;border:1px solid var(--line)}
  #msg{margin:0 20px;max-width:1100px}
  .toast{background:#e7f7ec;color:#137a3a;border:1px solid #b7e3c6;border-radius:8px;padding:10px 14px;margin:0 auto 0;max-width:1060px}
  .toast.err{background:#fde8e8;color:#b91c1c;border-color:#f5c2c2}
</style></head>
<body>
<header>
  <h1>Painel do Blog</h1>
  <a href="/" target="_blank">Ver o blog &rarr;</a>
</header>
<div id="msg"></div>
<div class="wrap">
  <div class="panel">
    <h2>Posts</h2>
    <button class="btn-primary" id="new" style="width:100%;margin-bottom:14px">+ Novo post</button>
    <div id="list">Carregando…</div>
  </div>
  <div class="panel">
    <h2 id="formTitle">Novo post</h2>
    <form id="form">
      <input type="hidden" id="id" />
      <label>Título</label>
      <input id="title" required maxlength="140" />
      <label>Categoria</label>
      <input id="category" list="cats" placeholder="Ex.: Presença Digital" />
      <datalist id="cats">${cats}</datalist>
      <label>Resumo <span class="hint">(opcional — se vazio, geramos do conteúdo)</span></label>
      <input id="excerpt" maxlength="220" />
      <label>Imagem de capa <span class="hint">(opcional — JPG/PNG/WebP)</span></label>
      <input id="coverFile" type="file" accept="image/*" />
      <img id="coverPreview" class="preview" style="display:none" alt="prévia" />
      <input type="hidden" id="cover" />
      <label>Conteúdo <span class="hint">(Markdown: ## título, **negrito**, *itálico*, - lista, [texto](link))</span></label>
      <textarea id="body" required></textarea>
      <label style="display:flex;align-items:center;gap:8px;margin-top:14px;font-weight:600">
        <input type="checkbox" id="published" checked style="width:auto" /> Publicado
      </label>
      <div class="actions">
        <button class="btn-primary" type="submit" id="save">Salvar</button>
        <button class="btn-ghost" type="button" id="cancel">Limpar</button>
      </div>
    </form>
  </div>
</div>
<script>
const $ = (id) => document.getElementById(id);
let posts = [];

function toast(text, err){
  $("msg").innerHTML = '<div class="toast'+(err?' err':'')+'">'+text+'</div>';
  setTimeout(()=>{ $("msg").innerHTML=''; }, 3500);
}

async function load(){
  const r = await fetch('/admin/api/posts');
  posts = await r.json();
  const list = $("list");
  if(!posts.length){ list.innerHTML = '<p style="color:#5C6B7A">Nenhum post ainda.</p>'; return; }
  list.innerHTML = posts.map(p =>
    '<div class="post-item"><div><div class="t">'+esc(p.title)+'</div>'+
    '<div class="s">'+esc(p.category||'')+' · '+(p.createdAt||'').slice(0,10)+
    ' <span class="badge'+(p.published===false?' off':'')+'">'+(p.published===false?'rascunho':'publicado')+'</span></div></div>'+
    '<div class="row-actions"><button class="btn-edit" onclick="edit(\\''+p.id+'\\')">Editar</button>'+
    '<button class="btn-del" onclick="del(\\''+p.id+'\\')">Excluir</button></div></div>'
  ).join('');
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function fill(p){
  $("formTitle").textContent = p ? 'Editar post' : 'Novo post';
  $("id").value = p? p.id : '';
  $("title").value = p? p.title : '';
  $("category").value = p? (p.category||'') : '';
  $("excerpt").value = p? (p.excerpt||'') : '';
  $("body").value = p? (p.body||'') : '';
  $("published").checked = p? p.published!==false : true;
  $("cover").value = p? (p.cover||'') : '';
  const prev = $("coverPreview");
  if(p && p.cover){ prev.src = p.cover; prev.style.display='block'; } else { prev.style.display='none'; prev.src=''; }
  $("coverFile").value='';
  window.scrollTo({top:0,behavior:'smooth'});
}
function edit(id){ fill(posts.find(p=>p.id===id)); }
function reset(){ fill(null); }

$("new").onclick = reset;
$("cancel").onclick = reset;

$("coverFile").onchange = (e) => {
  const f = e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = () => { $("cover").value = reader.result; const pv=$("coverPreview"); pv.src=reader.result; pv.style.display='block'; };
  reader.readAsDataURL(f);
};

$("form").onsubmit = async (e) => {
  e.preventDefault();
  $("save").disabled = true;
  const payload = {
    id: $("id").value || undefined,
    title: $("title").value.trim(),
    category: $("category").value.trim(),
    excerpt: $("excerpt").value.trim(),
    body: $("body").value,
    cover: $("cover").value,
    published: $("published").checked
  };
  try{
    const r = await fetch('/admin/api/save', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if(!r.ok) throw new Error('HTTP '+r.status);
    await r.json();
    toast('Post salvo com sucesso.');
    reset(); load();
  }catch(err){ toast('Erro ao salvar: '+err.message, true); }
  finally{ $("save").disabled = false; }
};

async function del(id){
  if(!confirm('Excluir este post? Esta ação não pode ser desfeita.')) return;
  try{
    const r = await fetch('/admin/api/delete', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})});
    if(!r.ok) throw new Error('HTTP '+r.status);
    toast('Post excluído.'); load();
  }catch(err){ toast('Erro ao excluir: '+err.message, true); }
}
window.edit = edit; window.del = del;
load();
</script>
</body></html>`;
}

// ---------- API ----------
async function saveImage(dataUrl, slug) {
  const m = /^data:(image\/(png|jpe?g|webp|gif));base64,(.+)$/i.exec(dataUrl || "");
  if (!m) return "";
  const ext = m[2].toLowerCase().replace("jpeg", "jpg") === "jpg" ? ".jpg" : "." + m[2].toLowerCase();
  const name = `${slug}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  await fsp.writeFile(path.join(UPLOADS_DIR, name), Buffer.from(m[3], "base64"));
  return `/uploads/${name}`;
}

async function uniqueSlug(base, posts, ignoreId) {
  let slug = base;
  let n = 2;
  while (posts.some((p) => p.slug === slug && p.id !== ignoreId)) slug = `${base}-${n++}`;
  return slug;
}

async function handleSave(request, response) {
  let payload;
  try {
    payload = JSON.parse(await readBody(request));
  } catch (_) {
    return sendJson(response, { error: "json_invalido" }, 400);
  }
  const title = String(payload.title || "").trim();
  if (!title) return sendJson(response, { error: "titulo_obrigatorio" }, 400);

  const posts = await loadPosts();
  let post;
  if (payload.id) {
    post = posts.find((p) => p.id === payload.id);
    if (!post) return sendJson(response, { error: "post_nao_encontrado" }, 404);
  } else {
    post = { id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    posts.push(post);
  }

  post.title = title;
  post.category = String(payload.category || "").trim();
  post.body = String(payload.body || "");
  post.excerpt = String(payload.excerpt || "").trim() || excerptFrom(post.body);
  post.published = payload.published !== false;
  post.updatedAt = new Date().toISOString();
  post.slug = await uniqueSlug(slugify(post.slug || title), posts, post.id);

  const cover = String(payload.cover || "");
  if (cover.startsWith("data:")) {
    post.cover = (await saveImage(cover, post.slug)) || post.cover || "";
  } else if (cover === "") {
    post.cover = "";
  } else {
    post.cover = cover; // /uploads/... existente (inalterado)
  }

  await savePosts(posts);
  return sendJson(response, { ok: true, post });
}

async function handleDelete(request, response) {
  let payload;
  try {
    payload = JSON.parse(await readBody(request));
  } catch (_) {
    return sendJson(response, { error: "json_invalido" }, 400);
  }
  const posts = await loadPosts();
  const next = posts.filter((p) => p.id !== payload.id);
  await savePosts(next);
  return sendJson(response, { ok: true });
}

// ---------- arquivos estaticos (styles, assets, uploads, favicon) ----------
async function serveFile(response, filePath, cache) {
  try {
    const file = await fsp.readFile(filePath);
    const headers = { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" };
    if (cache) headers["Cache-Control"] = "public, max-age=3600";
    response.writeHead(200, headers);
    response.end(file);
  } catch (_) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Nao encontrado");
  }
}

function safeJoin(baseDir, rel) {
  const target = path.normalize(path.join(baseDir, rel));
  if (!target.startsWith(baseDir)) return null;
  return target;
}

// ---------- roteador principal ----------
async function handle(request, response) {
  ensureDirs();
  const url = new URL(request.url, "http://blog.local");
  const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";
  const method = request.method || "GET";

  // estaticos
  if (pathname === "/styles.css") return serveFile(response, path.join(BLOG_DIR, "styles.css"), true);
  if (pathname === "/favicon.ico") return serveFile(response, path.join(BLOG_DIR, "favicon.ico"), true);
  if (pathname.startsWith("/assets/")) {
    const f = safeJoin(BLOG_DIR, pathname.replace(/^\//, ""));
    return f ? serveFile(response, f, true) : serveFile(response, "", false);
  }
  if (pathname.startsWith("/uploads/")) {
    const f = safeJoin(DATA_DIR, pathname.replace(/^\//, ""));
    return f ? serveFile(response, f, true) : serveFile(response, "", false);
  }

  // painel (protegido)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!checkAuth(request)) {
      response.writeHead(401, {
        "WWW-Authenticate": 'Basic realm="Painel do Blog", charset="UTF-8"',
        "Content-Type": "text/plain; charset=utf-8"
      });
      response.end("Autenticacao necessaria");
      return;
    }
    if (pathname === "/admin") return sendHtml(response, renderAdmin());
    if (pathname === "/admin/api/posts" && method === "GET") return sendJson(response, await loadPosts());
    if (pathname === "/admin/api/save" && method === "POST") return handleSave(request, response);
    if (pathname === "/admin/api/delete" && method === "POST") return handleDelete(request, response);
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Nao encontrado");
    return;
  }

  // publico
  if (pathname === "/") return sendHtml(response, renderIndex(await loadPosts()));
  if (pathname.startsWith("/p/")) {
    const slug = pathname.split("/").filter(Boolean)[1];
    const post = (await loadPosts()).find((p) => p.slug === slug && p.published !== false);
    if (!post) {
      return sendHtml(
        response,
        pageHead("Artigo não encontrado | Blog", "") +
          siteHeader() +
          `<main class="post-wrap"><div class="container post"><a class="back-to-blog" href="/">&larr; Todos os artigos</a><h1 class="post-title">Artigo não encontrado</h1><p style="color:var(--slate)">Esse artigo pode ter sido removido ou despublicado.</p></div></main>` +
          siteFooter() +
          "</body></html>",
        404
      );
    }
    return sendHtml(response, renderPostPage(post));
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Nao encontrado");
}

module.exports = { handle, ensureDirs };
