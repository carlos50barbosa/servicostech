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

function renderSiteHeader(variant = "default") {
  const isLawyer = variant === "lawyer";
  const navLinks = isLawyer
    ? [
        { href: "#inicio", label: "Início" },
        { href: "#sobre", label: "Sobre" },
        { href: "#areas", label: "Áreas de Atuação" },
        { href: "#diferenciais", label: "Diferenciais" },
        { href: "#contato-projeto", label: "Contato" }
      ]
    : [
        { href: "/#beneficios", label: "Benefícios" },
        { href: "/#portfolio", label: "Portfólio" },
        { href: "/#oferta", label: "Oferta" },
        { href: "/#contato", label: "Contato" }
      ];
  const quoteMessage = isLawyer
    ? "Olá! Vi o modelo de site para advogado no portfólio da Serviços Tech e gostaria de solicitar um orçamento."
    : "Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.";

  if (isLawyer) {
    return `
    <header class="site-header portfolio-advogado-header">
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
        <nav class="main-nav" aria-label="Navegação da landing page">
          ${navLinks.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
        </nav>
        <a class="header-action quote-action" href="${buildWhatsAppUrl(quoteMessage)}" target="_blank" rel="noopener">
          <span class="quote-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12h12" /><path d="m13 6 6 6-6 6" /></svg>
          </span>
          Solicitar orçamento
        </a>
      </div>
    </header>`;
  }

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

function renderLayout({ title, description, canonicalPath, image, content, headerVariant = "default" }) {
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
  <link rel="stylesheet" href="/style.css?v=20260610-menu-mobile" />
</head>
<body>
  ${renderSiteHeader(headerVariant)}
  ${content}
  <a class="whatsapp-float" href="${buildWhatsAppUrl("Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.")}" target="_blank" rel="noopener" aria-label="Falar com a Serviços Tech no WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 18.7 6.2 15A7.8 7.8 0 1 1 9 17.8l-3.6.9Z"></path><path d="M9.3 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.4.5c.5.9 1.3 1.7 2.3 2.1l.6-.7c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.5.3-1 .5-1.7.5-1.6 0-3.3-.9-4.6-2.2C9.2 12 8.4 10.4 8.4 9.3c0-.2.4-.6.9-.7Z"></path></svg>
    <span>
      <strong>Atendimento</strong>
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

function renderProjectStats(project) {
  if (!Array.isArray(project.stats) || project.stats.length === 0) {
    return "";
  }

  return `
    <div class="project-stats">
      ${project.stats.map((stat) => `
        <div>
          <strong>${escapeHtml(stat.value)}</strong>
          <span>${escapeHtml(stat.label)}</span>
        </div>
      `).join("")}
    </div>`;
}

function renderProjectSpecialties(project) {
  if (!Array.isArray(project.specialties) || project.specialties.length === 0) {
    return "";
  }

  return `
    <section class="project-detail-section specialty-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Especialidades</p>
          <h2>Problemas jurídicos apresentados de forma clara</h2>
        </div>
        <div class="specialty-grid">
          ${project.specialties.map((specialty) => `
            <article class="specialty-card">
              <h3>${escapeHtml(specialty.title)}</h3>
              <p>${escapeHtml(specialty.description)}</p>
              <a href="#contato-projeto">Ver estrutura de atendimento</a>
            </article>
          `).join("")}
        </div>
      </div>
    </section>`;
}

function renderProjectAbout(project) {
  if (!project.about) {
    return "";
  }

  return `
    <section class="project-detail-section project-about-section">
      <div class="container project-about-grid">
        <div>
          <p class="eyebrow">Quem sou</p>
          <h2>${escapeHtml(project.about.title)}</h2>
          <p>${escapeHtml(project.about.text)}</p>
        </div>
        <div class="about-proof-card">
          <span>Modelo ideal para</span>
          <ul class="feature-list">
            <li>Advogados consumeristas</li>
            <li>Direito bancário e digital</li>
            <li>Atendimento nacional por WhatsApp</li>
          </ul>
        </div>
      </div>
    </section>`;
}

function renderProjectFaqs(project) {
  if (!Array.isArray(project.faqs) || project.faqs.length === 0) {
    return "";
  }

  return `
    <section class="project-detail-section faq-section">
      <div class="container faq-grid">
        <div class="section-heading">
          <p class="eyebrow">FAQ</p>
          <h2>Dúvidas frequentes antes do contato</h2>
        </div>
        <div class="faq-list">
          ${project.faqs.map((faq) => `
            <article class="faq-item">
              <h3>${escapeHtml(faq.question)}</h3>
              <p>${escapeHtml(faq.answer)}</p>
            </article>
          `).join("")}
        </div>
      </div>
    </section>`;
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

function renderLawyerProjectPage(project) {
  const whatsappMessage = "Olá! Vi o modelo de site para advogado no portfólio da Serviços Tech e gostaria de solicitar um orçamento.";
  const featureLabels = project.features || [];
  const specialties = project.specialties || [];
  const differentials = project.lawyerDifferentials || project.differentials || [];
  const processSteps = project.process || [];

  return renderLayout({
    title: `${project.name} | Portfólio Serviços Tech`,
    description: project.description,
    canonicalPath: `/portfolio/${project.slug}`,
    image: project.image,
    headerVariant: "lawyer",
    content: `
      <main class="project-detail-page portfolio-advogado-page">
        <section class="portfolio-advogado-hero" id="inicio">
          <div class="container portfolio-advogado-hero-grid">
            <div class="portfolio-advogado-hero-copy">
              <a class="back-link portfolio-advogado-back" href="/#portfolio">Voltar ao portfólio</a>
              <p class="eyebrow portfolio-advogado-eyebrow">${escapeHtml(project.category)}</p>
              <h1>${escapeHtml(project.heroTitle)}</h1>
              <p>${escapeHtml(project.heroSubtitle)}</p>
              <div class="portfolio-advogado-actions">
                <a class="btn btn-primary" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">Quero um site assim</a>
                <a class="btn btn-secondary" href="#areas">Ver seções do modelo</a>
              </div>
              <div class="portfolio-advogado-trust">
                ${(project.badges || []).map((badge) => `<span>${escapeHtml(badge)}</span>`).join("")}
              </div>
            </div>
            <div class="portfolio-advogado-mockup" aria-label="Mockup demonstrativo de site jurídico">
              <div class="portfolio-advogado-browser">
                <span></span><span></span><span></span>
              </div>
              <div class="portfolio-advogado-mockup-hero">
                <p>Escritório jurídico</p>
                <strong>Atendimento online com clareza e autoridade</strong>
                <a href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">WhatsApp</a>
              </div>
              <div class="portfolio-advogado-mockup-grid">
                <article>
                  <span>01</span>
                  <strong>Áreas de atuação</strong>
                  <p>Serviços organizados por necessidade.</p>
                </article>
                <article>
                  <span>02</span>
                  <strong>Consulta estratégica</strong>
                  <p>Chamada objetiva para contato qualificado.</p>
                </article>
              </div>
              <div class="portfolio-advogado-mockup-bar">
                <span>Resposta rápida pelo WhatsApp</span>
                <strong>Solicitar atendimento</strong>
              </div>
            </div>
          </div>
        </section>

        <section class="portfolio-advogado-section portfolio-advogado-intro" id="sobre">
          <div class="container portfolio-advogado-split">
            <div>
              <p class="eyebrow portfolio-advogado-eyebrow">Presença digital jurídica</p>
              <h2>Um site pensado para transmitir autoridade</h2>
              <p>${escapeHtml(project.lawyerIntro)}</p>
            </div>
            <div class="portfolio-advogado-feature-grid">
              ${featureLabels.map((feature) => `
                <article class="portfolio-advogado-card portfolio-advogado-feature-card">
                  <span aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false"><path d="m5 12 4 4 10-10" /></svg>
                  </span>
                  <h3>${escapeHtml(feature)}</h3>
                </article>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="portfolio-advogado-section portfolio-advogado-about">
          <div class="container portfolio-advogado-about-grid">
            <div class="portfolio-advogado-photo-placeholder" aria-hidden="true">
              <svg viewBox="0 0 96 96" focusable="false">
                <path d="M48 50c11.6 0 21-9.4 21-21S59.6 8 48 8 27 17.4 27 29s9.4 21 21 21Z" />
                <path d="M16 86c4.7-18.5 16.2-28 32-28s27.3 9.5 32 28" />
              </svg>
            </div>
            <div>
              <p class="eyebrow portfolio-advogado-eyebrow">Quem sou</p>
              <h2>${escapeHtml(project.about.title)}</h2>
              <p>${escapeHtml(project.about.text)}</p>
              <a class="btn btn-secondary" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">Solicitar avaliação do projeto</a>
            </div>
          </div>
        </section>

        <section class="portfolio-advogado-section portfolio-advogado-areas" id="areas">
          <div class="container">
            <div class="section-heading portfolio-advogado-heading">
              <p class="eyebrow portfolio-advogado-eyebrow">Áreas de atuação</p>
              <h2>Serviços jurídicos apresentados com ordem e clareza</h2>
            </div>
            <div class="portfolio-advogado-areas-grid">
              ${specialties.map((specialty, index) => `
                <article class="portfolio-advogado-card portfolio-advogado-area-card">
                  <span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                  <h3>${escapeHtml(specialty.title)}</h3>
                  <p>${escapeHtml(specialty.description)}</p>
                </article>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="portfolio-advogado-section portfolio-advogado-differentials" id="diferenciais">
          <div class="container">
            <div class="section-heading portfolio-advogado-heading">
              <p class="eyebrow portfolio-advogado-eyebrow">Diferenciais</p>
              <h2>Por que esse modelo funciona?</h2>
            </div>
            <div class="portfolio-advogado-differentials-grid">
              ${differentials.map((item) => `
                <article class="portfolio-advogado-card portfolio-advogado-differential-card">
                  <span aria-hidden="true"></span>
                  <h3>${escapeHtml(item)}</h3>
                </article>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="portfolio-advogado-section portfolio-advogado-process">
          <div class="container portfolio-advogado-process-grid">
            <div>
              <p class="eyebrow portfolio-advogado-eyebrow">Processo</p>
              <h2>Como criamos seu site</h2>
            </div>
            <div class="portfolio-advogado-steps">
              ${processSteps.map((step, index) => `
                <article>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <h3>${escapeHtml(step)}</h3>
                </article>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="portfolio-advogado-cta" id="contato-projeto">
          <div class="container portfolio-advogado-cta-box">
            <div>
              <p class="eyebrow portfolio-advogado-eyebrow">Projeto sob medida</p>
              <h2>Quer um site profissional como este?</h2>
              <p>A Serviços Tech cria sites modernos para advogados, escritórios e profissionais liberais que querem transmitir mais autoridade e conquistar mais clientes.</p>
            </div>
            <a class="btn btn-primary btn-large" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">Solicitar orçamento pelo WhatsApp</a>
          </div>
        </section>
      </main>`
  });
}

function renderProjectPage(project) {
  if (project.slug === "site-para-advogado") {
    return renderLawyerProjectPage(project);
  }

  const whatsappMessage = `Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para um projeto parecido com ${project.name}.`;

  return renderLayout({
    title: `${project.name} | Portfólio Serviços Tech`,
    description: project.description,
    canonicalPath: `/portfolio/${project.slug}`,
    image: project.image,
    content: `
      <main class="project-detail-page ${project.slug === "site-para-advogado" ? "lawyer-theme" : ""}">
        <section class="project-detail-hero">
          <div class="container project-hero-grid">
            <div class="project-hero-copy">
              <a class="back-link" href="/#portfolio">← Voltar ao portfólio</a>
              <p class="eyebrow">${escapeHtml(project.category)}</p>
              <h1>${escapeHtml(project.heroTitle || project.name)}</h1>
              <p>${escapeHtml(project.heroSubtitle || project.description)}</p>
              ${renderProjectStats(project)}
              <div class="project-meta">
                ${(project.badges || ["Site responsivo", "SEO básico", "CTA WhatsApp"]).map((badge) => `<span>${escapeHtml(badge)}</span>`).join("")}
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

        ${renderProjectSpecialties(project)}
        ${renderProjectAbout(project)}

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

        ${renderProjectFaqs(project)}

        <section class="project-conversion" id="contato-projeto">
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
