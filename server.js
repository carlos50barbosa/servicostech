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

function renderSiteHeader(options = {}) {
  const config = typeof options === "string" ? { variant: options } : options;
  const defaultLinks = [
    { href: "/#beneficios", label: "Benefícios" },
    { href: "/#portfolio", label: "Portfólio" },
    { href: "/#oferta", label: "Oferta" },
    { href: "/#contato", label: "Contato" }
  ];
  const portfolioLinks = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#areas", label: "Áreas de Atuação" },
    { href: "#diferenciais", label: "Diferenciais" },
    { href: "#contato", label: "Contato" }
  ];
  const navLinks =
    config.linksDaPagina ||
    config.navLinks ||
    (config.variant === "portfolio" || config.variant === "lawyer" ? portfolioLinks : defaultLinks);
  const quoteMessage =
    config.whatsappMensagem ||
    config.quoteMessage ||
    "Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.";
  const ctaText = config.ctaTexto || "Solicitar Orçamento";
  const headerClass = ["site-header", config.variant === "lawyer" ? "portfolio-advogado-header" : ""]
    .filter(Boolean)
    .join(" ");

  return `
    <header class="${headerClass}">
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
          ${navLinks.map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join("")}
        </nav>
        <details class="mobile-menu">
          <summary aria-label="Abrir menu">
            <span></span>
            <span></span>
            <span></span>
          </summary>
          <nav aria-label="Menu mobile">
            ${navLinks.map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join("")}
          </nav>
        </details>
        <a class="header-action quote-action" href="${buildWhatsAppUrl(quoteMessage)}" target="_blank" rel="noopener">
          <span class="quote-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12h12" /><path d="m13 6 6 6-6 6" /></svg>
          </span>
          ${escapeHtml(ctaText)}
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

function renderLayout({ title, description, canonicalPath, image, content, headerVariant = "default", headerOptions }) {
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
  <link rel="stylesheet" href="/style.css?v=20260614-corporate-refine" />
</head>
<body>
  ${renderSiteHeader(headerOptions || headerVariant)}
  ${content}
  <a class="whatsapp-float" href="${buildWhatsAppUrl("Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.")}" target="_blank" rel="noopener" aria-label="Falar com a Serviços Tech no WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 18.7 6.2 15A7.8 7.8 0 1 1 9 17.8l-3.6.9Z"></path><path d="M9.3 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.4.5c.5.9 1.3 1.7 2.3 2.1l.6-.7c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.5.3-1 .5-1.7.5-1.6 0-3.3-.9-4.6-2.2C9.2 12 8.4 10.4 8.4 9.3c0-.2.4-.6.9-.7Z"></path></svg>
    <span>
      <strong>Atendimento</strong>
      <small>WhatsApp</small>
    </span>
  </a>
  ${renderSiteFooter()}
  <script>
    document.querySelectorAll(".mobile-menu").forEach((menu) => {
      menu.addEventListener("toggle", () => {
        if (!menu.open) return;
        document.querySelectorAll(".mobile-menu[open]").forEach((openMenu) => {
          if (openMenu !== menu) openMenu.removeAttribute("open");
        });
      });

      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => menu.removeAttribute("open"));
      });
    });

    document.addEventListener("click", (event) => {
      document.querySelectorAll(".mobile-menu[open]").forEach((menu) => {
        if (!menu.contains(event.target)) menu.removeAttribute("open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".mobile-menu[open]").forEach((menu) => {
        menu.removeAttribute("open");
      });
    });

    const revealTargets = [
      ".section-heading",
      ".project-card",
      ".project-hero-copy",
      ".project-hero-media",
      ".portfolio-detail-hero-content",
      ".portfolio-detail-mockup",
      ".portfolio-detail-card",
      ".portfolio-detail-cta-box",
      ".gallery-card",
      ".conversion-box",
      ".not-found-box"
    ];

    document.querySelectorAll(revealTargets.join(",")).forEach((element) => {
      element.classList.add("reveal");
    });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.14 });

      document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
    } else {
      document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    }
  </script>
</body>
</html>`;
}

function renderProjectCard(project) {
  return `
    <article class="project-card">
      <a class="project-image" href="/portfolio/${project.slug}" aria-label="Ver detalhes do projeto ${escapeHtml(project.cardTitle || project.name)}">
        <img src="${escapeHtml(project.image)}" alt="Mockup do projeto ${escapeHtml(project.cardTitle || project.name)}" loading="lazy" />
      </a>
      <div class="project-copy">
        <span>${escapeHtml(project.category)}</span>
        <h3>${escapeHtml(project.cardTitle || project.name)}</h3>
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
              <a href="#contato">Ver estrutura de atendimento</a>
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
  return renderPortfolioIndexPage();
}

function renderPortfolioIndexPage() {
  return renderLayout({
    title: "Portfólio de Projetos | Serviços Tech",
    description: "Conheça exemplos de sites profissionais para clínicas, advogados, barbearias, restaurantes, estética e consultorias.",
    canonicalPath: "/portfolio",
    image: projects[0].image,
    content: `
      <main class="portfolio-page">
        <section class="project-detail-hero">
          <div class="container project-hero-grid">
            <div class="project-hero-copy">
              <p class="eyebrow">Portfólio</p>
              <h1>Modelos de sites profissionais por segmento</h1>
              <p>Escolha um projeto para ver conteúdo, seções, diferenciais e chamada de WhatsApp adaptados ao nicho.</p>
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

        <section class="portfolio-advogado-cta" id="contato">
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
  const sections = project.sections || {};
  const areas = sections.areas || [];
  const processSteps = sections.process || [];
  const finalCta = sections.finalCta || {
    title: "Quer um site profissional como este?",
    text: "A Serviços Tech cria sites modernos para empresas que querem transmitir mais confiança e gerar mais contatos.",
    button: "Solicitar orçamento pelo WhatsApp"
  };
  const whatsappMessage =
    project.whatsappMessage ||
    `Olá! Vi o modelo ${project.name} no portfólio da Serviços Tech e gostaria de solicitar um orçamento.`;
  const badges = project.features.slice(0, 4);
  const cardTitle = project.cardTitle || project.name;

  return renderLayout({
    title: `${project.title || project.name} | Portfólio Serviços Tech`,
    description: project.description,
    canonicalPath: `/portfolio/${project.slug}`,
    image: project.image,
    headerOptions: {
      variant: project.slug === "site-para-advogado" ? "lawyer" : "portfolio",
      whatsappMensagem: whatsappMessage,
      ctaTexto: "Solicitar orçamento",
      linksDaPagina: [
        { href: "#inicio", label: "Início" },
        { href: "#sobre", label: "Sobre" },
        { href: "#areas", label: "Áreas de Atuação" },
        { href: "#diferenciais", label: "Diferenciais" },
        { href: "#contato", label: "Contato" }
      ]
    },
    content: `
      <main class="portfolio-detail-page project-detail-page ${project.slug === "site-para-advogado" ? "portfolio-detail-lawyer" : ""}" style="--portfolio-accent: ${escapeHtml(project.accentColor || "#2563eb")}">
        <section class="portfolio-detail-hero project-detail-hero" id="inicio">
          <div class="container portfolio-detail-hero-grid project-hero-grid">
            <div class="portfolio-detail-hero-content project-hero-copy">
              <a class="back-link" href="/portfolio">Voltar ao portfólio</a>
              <p class="eyebrow">${escapeHtml(project.category)}</p>
              <h1>${escapeHtml(project.title || project.name)}</h1>
              <p>${escapeHtml(project.subtitle || project.description)}</p>
              <div class="portfolio-detail-tags project-meta">
                ${badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join("")}
              </div>
              <div class="portfolio-detail-actions project-actions">
                <a class="btn btn-primary" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">${escapeHtml(project.primaryCta || "Quero um site assim")}</a>
                <a class="btn btn-secondary" href="#areas">${escapeHtml(project.secondaryCta || "Ver seções do modelo")}</a>
              </div>
            </div>
            <div class="portfolio-detail-mockup">
              <div class="portfolio-detail-browser">
                <span></span><span></span><span></span>
              </div>
              <div class="portfolio-detail-mockup-visual">
                <img src="${escapeHtml(project.image)}" alt="Imagem principal do projeto ${escapeHtml(cardTitle)}" />
                <div>
                  <p>${escapeHtml(project.category)}</p>
                  <strong>${escapeHtml(project.heroMockupTitle || project.title || project.name)}</strong>
                  <a href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">${escapeHtml(project.heroMockupButton || "WhatsApp")}</a>
                </div>
              </div>
              <div class="portfolio-detail-mockup-grid">
                ${areas.slice(0, 2).map((area, index) => `
                  <article>
                    <span>${String(index + 1).padStart(2, "0")}</span>
                    <strong>${escapeHtml(area.title)}</strong>
                    <p>${escapeHtml(area.description)}</p>
                  </article>
                `).join("")}
              </div>
            </div>
          </div>
        </section>

        <section class="portfolio-detail-section" id="apresentacao">
          <div class="container portfolio-detail-split">
            <div>
              <p class="eyebrow">Apresentação</p>
              <h2>${escapeHtml(sections.presentation?.title || "Uma presença digital pensada para converter")}</h2>
              <p>${escapeHtml(sections.presentation?.text || project.objective)}</p>
            </div>
            <div class="portfolio-detail-card">
              <span>Objetivo</span>
              <h3>O que o projeto resolve</h3>
              <p>${escapeHtml(project.objective)}</p>
            </div>
          </div>
        </section>

        <section class="portfolio-detail-section portfolio-detail-about" id="sobre">
          <div class="container portfolio-detail-split">
            <article class="portfolio-detail-card">
              <span>Sobre</span>
              <h2>${escapeHtml(sections.about?.title || cardTitle)}</h2>
              <p>${escapeHtml(sections.about?.text || project.description)}</p>
            </article>
            <article class="portfolio-detail-card">
              <span>Recursos</span>
              <h2>Principais entregas</h2>
              <ul class="feature-list">${renderList(project.features)}</ul>
            </article>
          </div>
        </section>

        <section class="portfolio-detail-section portfolio-detail-areas" id="areas">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">Serviços</p>
              <h2>Seções pensadas para este segmento</h2>
            </div>
            <div class="portfolio-detail-areas-grid">
              ${areas.map((area, index) => `
                <article class="portfolio-detail-card">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <h3>${escapeHtml(area.title)}</h3>
                  <p>${escapeHtml(area.description)}</p>
                </article>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="portfolio-detail-section portfolio-detail-diferenciais" id="diferenciais">
          <div class="container portfolio-detail-split">
            <div>
              <p class="eyebrow">Diferenciais</p>
              <h2>Por que esse modelo funciona?</h2>
              <p>O conteúdo, os blocos e os botões foram pensados para reduzir dúvidas e conduzir o visitante para uma conversa qualificada.</p>
            </div>
            <div class="portfolio-detail-diferenciais-grid">
              ${project.differentials.map((item) => `
                <article class="portfolio-detail-card">
                  <span aria-hidden="true"></span>
                  <h3>${escapeHtml(item)}</h3>
                </article>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="portfolio-detail-section portfolio-detail-processo" id="processo">
          <div class="container portfolio-detail-processo-grid">
            <div>
              <p class="eyebrow">Processo</p>
              <h2>Como criamos seu site</h2>
            </div>
            <div class="portfolio-detail-steps">
              ${processSteps.map((step, index) => `
                <article class="portfolio-detail-card">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <h3>${escapeHtml(step)}</h3>
                </article>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="portfolio-detail-section project-gallery-section">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">Galeria</p>
              <h2>Referências visuais do projeto</h2>
            </div>
            <div class="gallery-grid">
              ${project.gallery.map((image, index) => `
                <figure class="gallery-card">
                  <img src="${escapeHtml(image)}" alt="Imagem ${index + 1} do projeto ${escapeHtml(cardTitle)}" loading="lazy" />
                </figure>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="portfolio-detail-section">
          <div class="container project-detail-grid">
            <article class="portfolio-detail-card">
              <span>Tecnologias</span>
              <h2>Base técnica</h2>
              <div class="tech-list">
                ${project.technologies.map((technology) => `<span>${escapeHtml(technology)}</span>`).join("")}
              </div>
            </article>
            <article class="portfolio-detail-card">
              <span>Contato</span>
              <h2>Mensagem personalizada</h2>
              <p>${escapeHtml(whatsappMessage)}</p>
            </article>
          </div>
        </section>

        <section class="portfolio-detail-cta" id="contato">
          <div class="container">
            <div class="portfolio-detail-cta-box conversion-box">
              <p class="eyebrow">Projeto sob medida</p>
              <h2>${escapeHtml(finalCta.title)}</h2>
              <p>${escapeHtml(finalCta.text)}</p>
              <a class="btn btn-primary btn-large" href="${buildWhatsAppUrl(whatsappMessage)}" target="_blank" rel="noopener">${escapeHtml(finalCta.button)}</a>
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
            <p>O modelo que você está procurando não está disponível no momento.</p>
            <a class="btn btn-primary" href="/portfolio">Voltar para o portfólio</a>
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
    sendHtml(response, renderPortfolioIndexPage());
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
