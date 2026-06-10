const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { projects, getProjectBySlug } = require("./projects");

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = __dirname;
const LOG_STATIC = process.env.LOG_STATIC === "true";
let requestSequence = 0;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function formatValue(value) {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const fields = Object.entries(meta)
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join(" ");
  const line = fields ? `[${timestamp}] ${level} ${message} ${fields}` : `[${timestamp}] ${level} ${message}`;

  if (level === "ERROR") {
    console.error(line);
    return;
  }

  console.log(line);
}

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.socket.remoteAddress || "unknown";
}

function getAccessLogLevel(statusCode) {
  if (statusCode >= 500) {
    return "ERROR";
  }

  if (statusCode >= 400) {
    return "WARN";
  }

  return "INFO";
}

function isStaticAssetPath(pathname) {
  return /\.(?:css|js|ico|svg|png|jpg|jpeg|webp|gif|avif|woff2?)$/i.test(pathname);
}

function shouldLogAccess(statusCode, pathname) {
  if (statusCode >= 400) {
    return true;
  }

  return LOG_STATIC || !isStaticAssetPath(pathname);
}

function getStaticRoute(pathname) {
  if (pathname === "/" || pathname === "/index.html") {
    return "page.home";
  }

  if (pathname === "/style.css") {
    return "asset.css";
  }

  if (pathname === "/favicon.ico") {
    return "asset.favicon";
  }

  if (pathname.startsWith("/assets/")) {
    return "asset.site";
  }

  return `static${pathname}`;
}

function getUserAgentSummary(userAgent) {
  if (!userAgent) {
    return "unknown";
  }

  const browserMatch =
    userAgent.match(/Edg\/([\d.]+)/) ||
    userAgent.match(/Chrome\/([\d.]+)/) ||
    userAgent.match(/Firefox\/([\d.]+)/) ||
    userAgent.match(/Version\/([\d.]+).*Safari/) ||
    userAgent.match(/Safari\/([\d.]+)/);
  const browserName = userAgent.includes("Edg/")
    ? "Edge"
    : userAgent.includes("Chrome/")
      ? "Chrome"
      : userAgent.includes("Firefox/")
        ? "Firefox"
        : userAgent.includes("Safari/")
          ? "Safari"
          : "Browser";
  const browserVersion = browserMatch ? browserMatch[1].split(".")[0] : "";
  const os = userAgent.includes("Windows")
    ? "Windows"
    : userAgent.includes("Android")
      ? "Android"
      : userAgent.includes("iPhone") || userAgent.includes("iPad")
        ? "iOS"
        : userAgent.includes("Mac OS X")
          ? "macOS"
          : userAgent.includes("Linux")
            ? "Linux"
            : "unknown OS";

  return browserVersion ? `${browserName} ${browserVersion} / ${os}` : `${browserName} / ${os}`;
}

function getRefererPath(request) {
  const referer = request.headers.referer || request.headers.referrer;

  if (typeof referer !== "string" || referer.length === 0) {
    return "";
  }

  try {
    const url = new URL(referer);
    return `${url.pathname}${url.search}`;
  } catch {
    return referer;
  }
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/5511915155349?text=${encodeURIComponent(message)}`;
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderSiteHeader() {
  return `
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="/" aria-label="Serviços Tech">
          <span class="brand-icon" aria-hidden="true">
            <img src="/assets/servicos-tech-mark.svg" alt="" />
          </span>
          <span>
            Serviços Tech
            <small>servicostech.com.br</small>
          </span>
        </a>
        <nav class="main-nav" aria-label="Navegação principal">
          <a href="/#beneficios">Benefícios</a>
          <a href="/#portfolio">Portfólio</a>
          <a href="/#oferta">Oferta</a>
          <a href="/#contato">Contato</a>
        </nav>
        <a class="header-action quote-action" href="${buildWhatsAppUrl("Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.")}" target="_blank" rel="noopener">
          <span class="quote-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12h12" /><path d="m13 6 6 6-6 6" /></svg>
          </span>
          Solicitar Orçamento
        </a>
      </div>
    </header>`;
}

function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <div class="container footer-inner">
        <a class="brand footer-brand" href="/" aria-label="Serviços Tech">
          <span class="brand-icon" aria-hidden="true">
            <img src="/assets/servicos-tech-mark.svg" alt="" />
          </span>
          <span>
            Serviços Tech
            <small>servicostech.com.br</small>
          </span>
        </a>
        <div class="footer-links">
          <a href="${buildWhatsAppUrl("Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.")}" target="_blank" rel="noopener">WhatsApp: (11) 91515-5349</a>
          <a href="https://www.instagram.com/agendamentos.online/" target="_blank" rel="noopener">Instagram</a>
          <a href="mailto:servicos.negocios.digital@gmail.com">servicos.negocios.digital@gmail.com</a>
        </div>
        <p>© 2026 Serviços Tech. Todos os direitos reservados.</p>
      </div>
    </footer>`;
}

function renderLayout({ title, description, canonicalPath, image, content }) {
  const canonicalUrl = `https://servicostech.com.br${canonicalPath}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${escapeHtml(image || "https://servicostech.com.br/og-image.jpg")}" />
  <meta name="theme-color" content="#2563EB" />
  <link rel="icon" href="/assets/servicos-tech-mark.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  ${renderSiteHeader()}
  ${content}
  <a class="whatsapp-float" href="${buildWhatsAppUrl("Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.")}" target="_blank" rel="noopener" aria-label="Falar com a Serviços Tech no WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 18.7 6.2 15A7.8 7.8 0 1 1 9 17.8l-3.6.9Z"></path><path d="M9.3 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.4.5c.5.9 1.3 1.7 2.3 2.1l.6-.7c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.5.3-1 .5-1.7.5-1.6 0-3.3-.9-4.6-2.2C9.2 12 8.4 10.4 8.4 9.3c0-.2.4-.6.9-.7Z"></path></svg>
    <span>
      <strong>Atendimendo</strong>
      <small>WhatsApp</small>
    </span>
  </a>
  ${renderSiteFooter()}
</body>
</html>`;
}

function renderProjectCard(project) {
  return `
    <article class="project-card">
      <a class="project-image" href="/portfolio/${project.slug}" aria-label="Ver detalhes do projeto ${escapeHtml(project.name)}">
        <img src="${escapeHtml(project.image)}" alt="Mockup do projeto ${escapeHtml(project.name)}" loading="lazy" />
      </a>
      <div class="project-copy">
        <span>${escapeHtml(project.category)}</span>
        <h3>${escapeHtml(project.name)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <ul>${renderList(project.features.slice(0, 3))}</ul>
        <a class="project-link" href="/portfolio/${project.slug}">Ver detalhes</a>
      </div>
    </article>`;
}

function renderPortfolioIndex() {
  return renderLayout({
    title: "Portfólio de Projetos | Serviços Tech",
    description: "Conheça exemplos de sites profissionais, landing pages e sistemas digitais criados pela Serviços Tech.",
    canonicalPath: "/portfolio",
    image: projects[0].image,
    content: `
      <main class="portfolio-page">
        <section class="project-detail-hero">
          <div class="container project-hero-grid">
            <div class="project-hero-copy">
              <p class="eyebrow">Portfólio</p>
              <h1>Projetos digitais com visual profissional e foco em conversão</h1>
              <p>Veja exemplos práticos de sites, landing pages e soluções digitais que podemos adaptar para a sua empresa.</p>
              <a class="btn btn-primary" href="/#portfolio">Voltar para a página inicial</a>
            </div>
            <div class="project-hero-media">
              <img src="${escapeHtml(projects[0].image)}" alt="Exemplo de projeto profissional da Serviços Tech" />
            </div>
          </div>
        </section>
        <section class="project-detail-section">
          <div class="container portfolio-grid">
            ${projects.map(renderProjectCard).join("")}
          </div>
        </section>
      </main>`
  });
}

function renderProjectPage(project) {
  const whatsappMessage = `Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para um projeto parecido com ${project.name}.`;

  return renderLayout({
    title: `${project.name} | Portfólio Serviços Tech`,
    description: project.description,
    canonicalPath: `/portfolio/${project.slug}`,
    image: project.image,
    content: `
      <main class="project-detail-page">
        <section class="project-detail-hero">
          <div class="container project-hero-grid">
            <div class="project-hero-copy">
              <a class="back-link" href="/#portfolio">← Voltar ao portfólio</a>
              <p class="eyebrow">${escapeHtml(project.category)}</p>
              <h1>${escapeHtml(project.name)}</h1>
              <p>${escapeHtml(project.description)}</p>
              <div class="project-meta">
                <span>Site responsivo</span>
                <span>SEO básico</span>
                <span>CTA WhatsApp</span>
              </div>
              <div class="project-actions">
                <a class="btn btn-primary" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">Quero um projeto parecido</a>
                <a class="btn btn-secondary" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">Falar no WhatsApp</a>
              </div>
            </div>
            <div class="project-hero-media">
              <img src="${escapeHtml(project.image)}" alt="Imagem principal do projeto ${escapeHtml(project.name)}" />
            </div>
          </div>
        </section>

        <section class="project-detail-section">
          <div class="container project-detail-grid">
            <article class="detail-card detail-card-large">
              <span>Objetivo</span>
              <h2>O que o projeto precisava resolver</h2>
              <p>${escapeHtml(project.objective)}</p>
            </article>
            <article class="detail-card">
              <span>Funcionalidades</span>
              <h2>Principais recursos</h2>
              <ul class="feature-list">${renderList(project.features)}</ul>
            </article>
            <article class="detail-card">
              <span>Tecnologias</span>
              <h2>Base técnica</h2>
              <div class="tech-list">
                ${project.technologies.map((technology) => `<span>${escapeHtml(technology)}</span>`).join("")}
              </div>
            </article>
            <article class="detail-card detail-card-large">
              <span>Diferenciais</span>
              <h2>Por que esse projeto transmite mais valor</h2>
              <ul class="feature-list">${renderList(project.differentials)}</ul>
            </article>
          </div>
        </section>

        <section class="project-detail-section project-gallery-section">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">Galeria</p>
              <h2>Prints e referências visuais do projeto</h2>
            </div>
            <div class="gallery-grid">
              ${project.gallery.map((image, index) => `
                <figure class="gallery-card">
                  <img src="${escapeHtml(image)}" alt="Imagem ${index + 1} do projeto ${escapeHtml(project.name)}" loading="lazy" />
                </figure>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="project-conversion">
          <div class="container">
            <div class="conversion-box">
              <p class="eyebrow">Gostou desse projeto?</p>
              <h2>Podemos criar algo parecido para sua empresa.</h2>
              <p>Solicite uma proposta e receba uma orientação objetiva para transformar sua ideia em um site profissional.</p>
              <a class="btn btn-primary btn-large" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">Solicitar orçamento</a>
            </div>
          </div>
        </section>
      </main>`
  });
}

function renderProjectNotFound(slug) {
  return renderLayout({
    title: "Projeto não encontrado | Serviços Tech",
    description: "O projeto solicitado não foi encontrado no portfólio da Serviços Tech.",
    canonicalPath: `/portfolio/${slug}`,
    image: projects[0].image,
    content: `
      <main class="project-detail-page">
        <section class="not-found-section">
          <div class="container not-found-box">
            <p class="eyebrow">Portfólio</p>
            <h1>Projeto não encontrado</h1>
            <p>O projeto que você tentou acessar não existe ou mudou de endereço.</p>
            <a class="btn btn-primary" href="/#portfolio">Voltar ao portfólio</a>
          </div>
        </section>
      </main>`
  });
}

function renderSitemap() {
  const urls = [
    "https://servicostech.com.br/",
    "https://servicostech.com.br/portfolio",
    ...projects.map((project) => `https://servicostech.com.br/portfolio/${project.slug}`)
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join("\n")}
</urlset>
`;
}

function sendHtml(response, html, statusCode = 200) {
  response.writeHead(statusCode, {
    "Content-Type": "text/html; charset=utf-8"
  });
  response.end(html);
}

function sendText(response, text, contentType = "text/plain; charset=utf-8", statusCode = 200) {
  response.writeHead(statusCode, {
    "Content-Type": contentType
  });
  response.end(text);
}

async function sendFile(response, filePath) {
  const file = await fs.readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const headers = {
    "Content-Type": mimeTypes[extension] || "application/octet-stream"
  };

  if (isStaticAssetPath(filePath)) {
    headers["Cache-Control"] = "public, max-age=3600";
  }

  response.writeHead(200, headers);
  response.end(file);
}

const server = http.createServer(async (request, response) => {
  const startedAt = process.hrtime.bigint();
  const requestId = ++requestSequence;
  const clientIp = getClientIp(request);
  const method = request.method || "UNKNOWN";
  let route = "unmatched";
  let pathname = request.url || "";

  response.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const status = response.statusCode;
    const userAgent = request.headers["user-agent"] || "";

    if (!shouldLogAccess(status, pathname)) {
      return;
    }

    log(getAccessLogLevel(status), "access", {
      route,
      path: pathname,
      status,
      ms: Number(durationMs.toFixed(2)),
      ip: clientIp,
      from: getRefererPath(request),
      ua: getUserAgentSummary(userAgent)
    });
  });

  if (!request.url || request.method !== "GET") {
    route = "method_not_allowed";
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Metodo nao permitido");
    return;
  }

  const url = new URL(request.url, `http://localhost:${PORT}`);
  pathname = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";

  if (pathname === "/portfolio") {
    route = "page.portfolio";
    sendHtml(response, renderPortfolioIndex());
    return;
  }

  if (pathname.startsWith("/portfolio/")) {
    const slug = pathname.split("/").filter(Boolean)[1];
    const project = getProjectBySlug(slug);
    route = "page.project";

    if (!project) {
      route = "page.project_not_found";
      sendHtml(response, renderProjectNotFound(slug || ""), 404);
      return;
    }

    sendHtml(response, renderProjectPage(project));
    return;
  }

  if (pathname === "/robots.txt") {
    route = "bot.robots";
    sendText(
      response,
      "User-agent: *\nAllow: /\nSitemap: https://servicostech.com.br/sitemap.xml\n"
    );
    return;
  }

  if (pathname === "/sitemap.xml") {
    route = "bot.sitemap";
    sendText(response, renderSitemap(), "application/xml; charset=utf-8");
    return;
  }

  const filePath = resolveRequestPath(request.url);

  if (!filePath) {
    route = "static.forbidden";
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Acesso negado");
    return;
  }

  if (pathname === "/favicon.ico") {
    route = "asset.favicon";
    await sendFile(response, path.join(PUBLIC_DIR, "assets", "servicos-tech-mark.svg"));
    return;
  }

  try {
    route = getStaticRoute(pathname);
    await sendFile(response, filePath);
  } catch (error) {
    const statusCode = error.code === "ENOENT" ? 404 : 500;
    route = statusCode === 404 ? "static.not_found" : "static.error";

    if (statusCode >= 500) {
      log("ERROR", "file_response_error", {
        requestId,
        url: request.url,
        path: pathname,
        filePath,
        status: statusCode,
        code: error.code || "UNKNOWN",
        message: error.message
      });
    }

    response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(statusCode === 404 ? "Arquivo nao encontrado" : "Erro interno");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    log("ERROR", "port_in_use", {
      port: PORT,
      hint: "Feche o outro servidor ou rode com outra porta: PORT=3001 npm start"
    });
    process.exit(1);
  }

  log("ERROR", "server_error", {
    code: error.code || "UNKNOWN",
    message: error.message,
    stack: error.stack
  });

  throw error;
});

server.listen(PORT, () => {
  log("INFO", "server_started", {
    port: PORT,
    publicDir: PUBLIC_DIR,
    nodeEnv: process.env.NODE_ENV || "development"
  });
});
