const http = require("node:http");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const { projects, getProjectBySlug } = require("./projects");

// Carrega o .env ANTES de exigir o blog-app, que le BLOG_ADMIN_* no require.
loadEnvFile(path.join(__dirname, ".env"));

const blogApp = require("./blog-app");

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = __dirname;
const LOG_STATIC = process.env.LOG_STATIC === "true";
let requestSequence = 0;

// Reverse proxy do webscraper (app Flask/Playwright em Python).
const WEBSCRAPER_PREFIX = "/webscraper-estabelecimentos";
const WEBSCRAPER_TARGET = {
  host: process.env.WEBSCRAPER_HOST || "127.0.0.1",
  port: Number(process.env.WEBSCRAPER_PORT) || 5000
};

// Blog dinamico servido quando o Host e o subdominio do blog.
const BLOG_HOST = (process.env.BLOG_HOST || "blog.servicostech.com.br").toLowerCase();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf"
};

function loadEnvFile(filePath) {
  if (!fsSync.existsSync(filePath)) {
    return;
  }

  const lines = fsSync.readFileSync(filePath, "utf-8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || process.env[key] !== undefined) {
      return;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

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

function getAnalyticsMeasurementId() {
  return (process.env.VITE_GA_MEASUREMENT_ID || "").trim();
}

function renderAnalyticsConfig() {
  const measurementId = getAnalyticsMeasurementId();

  return [
    "window.SERVICOS_TECH_CONFIG = Object.assign({}, window.SERVICOS_TECH_CONFIG, {",
    `  gaMeasurementId: ${JSON.stringify(measurementId)}`,
    "});",
    `window.SERVICOS_TECH_GA_MEASUREMENT_ID = ${JSON.stringify(measurementId)};`,
    `window.VITE_GA_MEASUREMENT_ID = ${JSON.stringify(measurementId)};`
  ].join("\n");
}

const legalInfo = {
  businessName: "Serviços Tech",
  website: "servicostech.com.br",
  contactEmail: "contato@servicostech.com.br",
  contactWhatsApp: "(11) 91515-5349",
  dataController: "José Carlos Barbosa, profissional autônomo responsável pela Serviços Tech.",
  location: "Osasco/SP, Brasil — Atendimento online para todo o Brasil.",
  lastUpdated: "15 de junho de 2026"
};

function renderCookieConsent() {
  return `
    <div class="cookie-consent" data-cookie-consent hidden role="region" aria-label="Aviso de cookies">
      <div class="cookie-consent-inner">
        <p>Nós usamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdos. Você pode aceitar ou recusar os cookies não essenciais. Para saber mais, acesse nossa <a href="/politica-de-privacidade">Política de Privacidade</a>.</p>
        <div class="cookie-consent-actions" aria-label="Preferências de cookies">
          <button type="button" class="cookie-btn cookie-btn-secondary" data-cookie-reject>Recusar</button>
          <button type="button" class="cookie-btn cookie-btn-primary" data-cookie-accept>Aceitar</button>
        </div>
      </div>
    </div>`;
}

function renderCookieConsentScript() {
  return `
    (function () {
      var storageKey = "cookieConsent";
      var banner = document.querySelector("[data-cookie-consent]");
      var acceptButton = document.querySelector("[data-cookie-accept]");
      var rejectButton = document.querySelector("[data-cookie-reject]");
      var preferenceButtons = document.querySelectorAll("[data-cookie-preferences]");

      function getConsent() {
        try {
          return window.localStorage.getItem(storageKey);
        } catch (error) {
          return null;
        }
      }

      function setConsent(value) {
        try {
          window.localStorage.setItem(storageKey, value);
        } catch (error) {}
      }

      function clearConsent() {
        try {
          window.localStorage.removeItem(storageKey);
        } catch (error) {}
      }

      function showBanner() {
        if (!banner) return;
        banner.hidden = false;
      }

      function hideBanner() {
        if (!banner) return;
        banner.hidden = true;
      }

      function loadOptionalAnalytics() {
        if (window.servicosTechAnalyticsLoaded) return;
        window.servicosTechAnalyticsLoaded = true;
        // Futuro: carregar Google Analytics, Meta Pixel ou scripts de marketing somente após consentimento aceito.
      }

      if (getConsent() === "accepted") {
        loadOptionalAnalytics();
      } else if (!getConsent()) {
        showBanner();
      }

      if (acceptButton) {
        acceptButton.addEventListener("click", function () {
          setConsent("accepted");
          hideBanner();
          loadOptionalAnalytics();
        });
      }

      if (rejectButton) {
        rejectButton.addEventListener("click", function () {
          setConsent("rejected");
          hideBanner();
        });
      }

      preferenceButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          clearConsent();
          showBanner();
          if (acceptButton) acceptButton.focus();
        });
      });
    })();`;
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderSiteHeader(options = {}) {
  const config = typeof options === "string" ? { variant: options } : options;
  const defaultLinks = [
    { href: "/#inicio", label: "Início" },
    { href: "/#beneficios", label: "Benefícios" },
    { href: "/#portfolio", label: "Portfólio" },
    { href: "https://blog.servicostech.com.br", label: "Blog" },
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
          <span class="brand-logo" aria-hidden="true">
            <img src="/assets/logo-azul.png?v=20260614-brand-palette" alt="" width="205" height="74" />
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
            <div class="mobile-menu-links">
              ${navLinks.map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join("")}
            </div>
            <div class="mobile-menu-extras">
              <p>Redes Sociais</p>
              <div class="mobile-menu-social" aria-label="Redes sociais">
                <a href="https://www.instagram.com/servicostech.br/" target="_blank" rel="noopener" aria-label="Instagram da Serviços Tech">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><path d="M17.2 6.8h.1" /></svg>
                </a>
                <a href="${buildWhatsAppUrl(quoteMessage)}" target="_blank" rel="noopener" aria-label="WhatsApp da Serviços Tech">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19l1.2-3.8A7.2 7.2 0 1 1 9 18.6z" /><path d="M9 9.5c.7 2.5 2.2 4 5 5" /></svg>
                </a>
              </div>
              <div class="mobile-menu-languages language-switcher" aria-label="Idiomas">
                <details class="language-menu mobile-language-menu">
                  <summary class="language-current" aria-label="Alterar idioma">
                    <svg class="language-globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" /></svg>
                    <span data-current-language-name>Português</span>
                    <svg class="language-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                  </summary>
                  <div class="language-options">
                    <a href="?lang=pt" data-lang-option="pt" lang="pt-BR" aria-current="true"><span>Português</span></a>
                    <a href="?lang=en" data-lang-option="en" lang="en"><span>English</span></a>
                    <a href="?lang=es" data-lang-option="es" lang="es"><span>Español</span></a>
                  </div>
                </details>
              </div>
            </div>
          </nav>
        </details>
        <a class="header-action quote-action" href="${buildWhatsAppUrl(quoteMessage)}" target="_blank" rel="noopener">
          <span class="quote-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12h12" /><path d="m13 6 6 6-6 6" /></svg>
          </span>
          ${escapeHtml(ctaText)}
        </a>
        <div class="desktop-language-switcher language-switcher" aria-label="Idiomas">
          <details class="language-menu">
            <summary class="language-current" aria-label="Alterar idioma">
              <svg class="language-globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" /></svg>
              <span data-current-language-name>Português</span>
              <svg class="language-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </summary>
            <div class="language-options">
              <a href="?lang=pt" data-lang-option="pt" lang="pt-BR" aria-current="true"><span>Português</span></a>
              <a href="?lang=en" data-lang-option="en" lang="en"><span>English</span></a>
              <a href="?lang=es" data-lang-option="es" lang="es"><span>Español</span></a>
            </div>
          </details>
        </div>
      </div>
    </header>`;
}

function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid footer-grid-reference">
          <section class="footer-column footer-brand-column" aria-label="Serviços Tech">
            <a class="brand footer-brand" href="/" aria-label="Serviços Tech">
              <span class="brand-logo footer-brand-logo" aria-hidden="true">
                <img src="/assets/logo-branca.png?v=20260614-brand-palette" alt="" width="280" height="102" loading="lazy" decoding="async" />
              </span>
            </a>
            <p>Sites profissionais para empresas que querem transmitir mais confiança e gerar mais contatos.</p>
            <div class="footer-social" aria-label="Redes sociais">
              <a href="https://www.instagram.com/servicostech.br/" target="_blank" rel="noopener" aria-label="Instagram da Serviços Tech">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><path d="M17.2 6.8h.1" /></svg>
              </a>
              <a href="${buildWhatsAppUrl("Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.")}" target="_blank" rel="noopener" aria-label="WhatsApp da Serviços Tech">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"><path d="M5 19l1.2-3.8A7.2 7.2 0 1 1 9 18.6z" /><path d="M9 9.5c.7 2.5 2.2 4 5 5" /></svg>
              </a>
            </div>
          </section>

          <nav class="footer-column footer-links" aria-label="Links do rodapé">
            <h2>Menu</h2>
            <a href="/#inicio">Início</a>
            <a href="/#beneficios">Benefícios</a>
            <a href="/#oferta">Oferta</a>
            <a href="/#portfolio">Portfólio</a>
            <a href="https://blog.servicostech.com.br">Blog</a>
            <a href="/#contato">Contato</a>
          </nav>

          <section class="footer-column footer-legal" aria-label="Informações legais">
            <h2>Legal</h2>
            <a href="/termos-de-uso">Termos de Uso</a>
            <a href="/politica-de-privacidade">Política de Privacidade</a>
            <button type="button" data-cookie-preferences>Preferências de cookies</button>
          </section>

          <section class="footer-column footer-contact" aria-label="Contato">
            <h2>Contato</h2>
            <a href="${buildWhatsAppUrl("Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.")}" target="_blank" rel="noopener">WhatsApp: (11) 91515-5349</a>
            <a href="https://www.instagram.com/servicostech.br/" target="_blank" rel="noopener">Instagram</a>
            <a href="mailto:contato@servicostech.com.br">contato@servicostech.com.br</a>
          </section>
        </div>

        <div class="footer-bottom">
          <p>© 2026 Serviços Tech. Todos os direitos reservados.</p>
        </div>
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
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Serviços Tech" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Serviços Tech" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${escapeHtml(image || "https://servicostech.com.br/og-image.jpg")}" />
  <meta property="og:image:alt" content="${escapeHtml(title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image || "https://servicostech.com.br/og-image.jpg")}" />
  <meta name="theme-color" content="#0F2A3D" />
  <link rel="icon" href="/favicon.ico?v=20260614-favicon-bigger" type="image/x-icon" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/style.css?v=20260616-portfolio-demos" />
</head>
<body>
  ${renderSiteHeader(headerOptions || headerVariant)}
  ${content}
  <a class="whatsapp-float" href="${buildWhatsAppUrl("Olá! Vim pelo site da Serviços Tech e gostaria de solicitar um orçamento para criação de site.")}" target="_blank" rel="noopener" aria-label="Falar com a Serviços Tech no WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 18.7 6.2 15A7.8 7.8 0 1 1 9 17.8l-3.6.9Z"></path><path d="M9.3 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.4.5c.5.9 1.3 1.7 2.3 2.1l.6-.7c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.5.3-1 .5-1.7.5-1.6 0-3.3-.9-4.6-2.2C9.2 12 8.4 10.4 8.4 9.3c0-.2.4-.6.9-.7Z"></path></svg>
    <span>
      <strong>Falar agora</strong>
      <small>WhatsApp</small>
    </span>
  </a>
  ${renderSiteFooter()}
  ${renderCookieConsent()}
  <script src="/analytics-config.js"></script>
  <script type="module" src="/src/main.js"></script>
  <script>
    ${renderCookieConsentScript()}

    (function () {
      var supportedLanguages = {
        pt: "pt-BR",
        en: "en",
        es: "es"
      };

      function safeStorage(action, value) {
        try {
          if (action === "get") return window.localStorage.getItem("servicosTechLang");
          window.localStorage.setItem("servicosTechLang", value);
        } catch (error) {}
        return null;
      }

      function getCurrentLanguage() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get("lang") || safeStorage("get") || "pt";
        return supportedLanguages[lang] ? lang : "pt";
      }

      var languageMeta = {
        pt: { code: "PT", name: "Português", flagClass: "language-flag-br" },
        en: { code: "US", name: "English", flagClass: "language-flag-us" },
        es: { code: "ES", name: "Español", flagClass: "language-flag-es" }
      };

      function syncLanguageLinks(lang) {
        var currentLanguage = languageMeta[lang] || languageMeta.pt;
        document.documentElement.lang = supportedLanguages[lang];
        document.querySelectorAll("[data-lang-option]").forEach((link) => {
          var option = link.getAttribute("data-lang-option");
          var target = new URL(window.location.href);
          target.searchParams.set("lang", option);
          link.href = target.href;
          if (option === lang) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
        document.querySelectorAll("[data-current-language-flag]").forEach((element) => {
          element.classList.remove("language-flag-br", "language-flag-us", "language-flag-es");
          element.classList.add(currentLanguage.flagClass);
        });
        document.querySelectorAll("[data-current-language-code]").forEach((element) => {
          element.textContent = currentLanguage.code;
        });
        document.querySelectorAll("[data-current-language-name]").forEach((element) => {
          element.textContent = currentLanguage.name;
        });
      }

      document.querySelectorAll("[data-lang-option]").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          var lang = link.getAttribute("data-lang-option");
          var target = new URL(window.location.href);
          target.searchParams.set("lang", lang);
          safeStorage("set", lang);
          try {
            window.history.replaceState(null, "", target.href);
          } catch (error) {
            window.location.href = target.href;
            return;
          }
          syncLanguageLinks(lang);
          var languageMenu = link.closest(".language-menu");
          if (languageMenu) languageMenu.removeAttribute("open");
        });
      });

      document.addEventListener("click", (event) => {
        document.querySelectorAll(".language-menu[open]").forEach((menu) => {
          if (!menu.contains(event.target)) menu.removeAttribute("open");
        });
      });

      syncLanguageLinks(getCurrentLanguage());
    })();

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
      ".not-found-box",
      ".legal-card",
      ".footer-column",
      ".footer-bottom"
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
        <img src="${escapeHtml(project.image)}" alt="Mockup do projeto ${escapeHtml(project.cardTitle || project.name)}" width="900" height="600" loading="lazy" decoding="async" />
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
              <img src="${escapeHtml(projects[0].image)}" alt="Exemplo de projeto profissional da Serviços Tech" width="900" height="600" fetchpriority="high" decoding="async" />
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
      <main class="portfolio-detail-page project-detail-page ${project.slug === "site-para-advogado" ? "portfolio-detail-lawyer" : ""}" style="--portfolio-accent: ${escapeHtml(project.accentColor || "#1E88E5")}">
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
                <img src="${escapeHtml(project.image)}" alt="Imagem principal do projeto ${escapeHtml(cardTitle)}" width="1100" height="734" fetchpriority="high" decoding="async" />
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
                  <img src="${escapeHtml(image)}" alt="Tela demonstrativa ${index + 1} do projeto ${escapeHtml(cardTitle)}" width="900" height="600" loading="lazy" decoding="async" />
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

function renderPrivacyPolicyPage() {
  return renderLayout({
    title: "Política de Privacidade | Serviços Tech",
    description: "Política de Privacidade da Serviços Tech, com informações sobre coleta, uso, compartilhamento, segurança, cookies e direitos dos titulares de dados.",
    canonicalPath: "/politica-de-privacidade",
    content: `
      <main class="legal-page">
        <section class="legal-hero">
          <div class="container legal-hero-inner">
            <p class="eyebrow">Privacidade e proteção de dados</p>
            <h1>Política de Privacidade</h1>
            <p>Esta política explica como a Serviços Tech trata dados pessoais em seus canais digitais, formulários, atendimentos e comunicações comerciais.</p>
          </div>
        </section>

        <section class="legal-content">
          <div class="container legal-card">
            <section class="legal-section">
              <h2>1. Quem somos</h2>
              <p>A Serviços Tech é uma iniciativa profissional voltada à criação de sites, landing pages, sistemas, automações e soluções digitais para empresas, profissionais autônomos e prestadores de serviço.</p>
              <p><strong>Site:</strong> ${escapeHtml(legalInfo.website)}</p>
              <p><strong>Responsável pelo tratamento dos dados:</strong><br>${escapeHtml(legalInfo.dataController)}</p>
              <p><strong>Contato:</strong><br><a href="mailto:${escapeHtml(legalInfo.contactEmail)}">${escapeHtml(legalInfo.contactEmail)}</a> e ${escapeHtml(legalInfo.contactWhatsApp)}</p>
              <p><strong>Localidade:</strong><br>${escapeHtml(legalInfo.location)}</p>
            </section>

            <section class="legal-section">
              <h2>2. Quais dados podemos coletar</h2>
              <p>Podemos coletar dados fornecidos diretamente pelo usuário ou gerados durante a navegação no site, incluindo:</p>
              <ul>
                <li>Nome;</li>
                <li>Telefone e WhatsApp;</li>
                <li>E-mail;</li>
                <li>Nome da empresa ou negócio;</li>
                <li>Mensagem enviada em formulário, WhatsApp, e-mail ou outro canal de atendimento;</li>
                <li>Informações de navegação, como páginas acessadas, origem do acesso, dispositivo, navegador, endereço IP e cookies.</li>
              </ul>
            </section>

            <section class="legal-section">
              <h2>3. Finalidades do uso dos dados</h2>
              <p>Usamos os dados pessoais para finalidades legítimas e relacionadas ao atendimento solicitado, tais como:</p>
              <ul>
                <li>Responder contatos, dúvidas e solicitações enviadas pelo site;</li>
                <li>Enviar orçamentos, propostas comerciais e informações sobre serviços;</li>
                <li>Prestar serviços contratados e acompanhar demandas do cliente;</li>
                <li>Melhorar a experiência, desempenho, segurança e conteúdo do site;</li>
                <li>Realizar comunicações comerciais quando houver autorização ou relação prévia compatível;</li>
                <li>Prevenir fraudes, incidentes de segurança e uso indevido dos canais digitais.</li>
              </ul>
            </section>

            <section class="legal-section">
              <h2>4. Base legal para tratamento</h2>
              <p>Tratamos dados pessoais com base na LGPD, de forma simples e proporcional. Dependendo da situação, o tratamento pode ocorrer para executar medidas solicitadas pelo próprio usuário, cumprir obrigações legais, atender interesses legítimos da Serviços Tech ou com consentimento, especialmente para cookies não essenciais e comunicações opcionais.</p>
            </section>

            <section class="legal-section">
              <h2>5. Compartilhamento de dados</h2>
              <p>Podemos compartilhar dados com ferramentas e fornecedores necessários para funcionamento do negócio, como serviços de hospedagem, e-mail, WhatsApp, formulários, analytics, automações e ferramentas de atendimento, sempre de forma compatível com as finalidades desta política.</p>
              <p>A Serviços Tech não vende dados pessoais.</p>
            </section>

            <section class="legal-section">
              <h2>6. Direitos do titular</h2>
              <p>O titular dos dados pode solicitar, nos termos da LGPD:</p>
              <ul>
                <li>Acesso aos dados pessoais tratados;</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Exclusão de dados pessoais quando aplicável;</li>
                <li>Revogação de consentimento;</li>
                <li>Informações sobre uso, compartilhamento e critérios de tratamento.</li>
              </ul>
            </section>

            <section class="legal-section">
              <h2>7. Como solicitar atendimento sobre dados pessoais</h2>
              <p>Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato pelos canais oficiais:</p>
              <p><strong>Contato:</strong><br><a href="mailto:${escapeHtml(legalInfo.contactEmail)}">${escapeHtml(legalInfo.contactEmail)}</a> e ${escapeHtml(legalInfo.contactWhatsApp)}</p>
            </section>

            <section class="legal-section">
              <h2>8. Segurança dos dados</h2>
              <p>Adotamos medidas técnicas e organizacionais razoáveis para proteger dados pessoais contra acessos não autorizados, perda, alteração, divulgação indevida ou uso incompatível com as finalidades informadas.</p>
            </section>

            <section class="legal-section">
              <h2>9. Tempo de armazenamento</h2>
              <p>Os dados são mantidos pelo tempo necessário para atendimento, envio de propostas, execução de serviços, cumprimento de obrigações legais, defesa de direitos ou enquanto houver finalidade legítima relacionada ao relacionamento com o usuário ou cliente.</p>
            </section>

            <section class="legal-section">
              <h2>10. Uso de cookies</h2>
              <p>Usamos cookies essenciais para funcionamento do site e podemos usar cookies não essenciais para análise de tráfego, melhoria da experiência e personalização de conteúdo. O usuário pode aceitar ou recusar cookies não essenciais no aviso exibido no site.</p>
              <p>Scripts de analytics, marketing, Meta Pixel ou Google Analytics só devem ser carregados quando houver consentimento aceito.</p>
            </section>

            <section class="legal-section">
              <h2>11. Alterações nesta política</h2>
              <p>Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças legais, técnicas ou operacionais. A versão mais recente estará sempre disponível nesta página.</p>
              <p class="legal-updated"><strong>Última atualização:</strong> ${escapeHtml(legalInfo.lastUpdated)}.</p>
            </section>
          </div>
        </section>
      </main>`
  });
}

function renderTermsPage() {
  return renderLayout({
    title: "Termos de Uso | Serviços Tech",
    description: "Termos de Uso do site Serviços Tech, com regras sobre navegação, orçamentos, prestação de serviços digitais, propriedade intelectual e responsabilidades.",
    canonicalPath: "/termos-de-uso",
    content: `
      <main class="legal-page">
        <section class="legal-hero">
          <div class="container legal-hero-inner">
            <p class="eyebrow">Condições de uso</p>
            <h1>Termos de Uso</h1>
            <p>Estes termos orientam o uso do site da Serviços Tech e a relação inicial com usuários interessados em soluções digitais.</p>
          </div>
        </section>

        <section class="legal-content">
          <div class="container legal-card">
            <section class="legal-section">
              <h2>1. Aceitação dos termos</h2>
              <p>Ao acessar ou utilizar o site ${escapeHtml(legalInfo.website)}, o usuário declara estar ciente e de acordo com estes Termos de Uso. Caso não concorde com alguma condição, recomenda-se não utilizar o site.</p>
            </section>

            <section class="legal-section">
              <h2>2. Serviços oferecidos</h2>
              <p>A Serviços Tech oferece criação de sites profissionais, landing pages, sistemas, automações, páginas comerciais, integrações e outras soluções digitais para empresas, profissionais autônomos e prestadores de serviço.</p>
            </section>

            <section class="legal-section">
              <h2>3. Uso correto do site</h2>
              <p>O usuário se compromete a utilizar o site de forma lícita, ética e compatível com sua finalidade informativa e comercial. É proibido tentar violar a segurança, explorar falhas, enviar conteúdo malicioso, usar dados de terceiros sem autorização ou praticar qualquer ato que prejudique o funcionamento do site.</p>
            </section>

            <section class="legal-section">
              <h2>4. Solicitação de orçamento</h2>
              <p>O envio de formulário, mensagem por WhatsApp, e-mail ou outro canal não gera contratação automática. A contratação depende de análise da demanda, alinhamento de escopo, confirmação de valores, prazos e condições comerciais.</p>
            </section>

            <section class="legal-section">
              <h2>5. Prazos, valores e condições comerciais</h2>
              <p>Prazos, valores, formas de pagamento, entregáveis, revisões, manutenção e demais condições são definidos individualmente por proposta comercial, contrato, pedido aprovado ou comunicação formal entre as partes.</p>
            </section>

            <section class="legal-section">
              <h2>6. Responsabilidades do cliente</h2>
              <p>Quando houver contratação, o cliente é responsável por fornecer informações corretas, textos, imagens, logotipos, dados de acesso, aprovações e demais materiais necessários ao desenvolvimento do projeto. Atrasos no envio ou aprovação de materiais podem impactar os prazos combinados.</p>
            </section>

            <section class="legal-section">
              <h2>7. Limitações de responsabilidade</h2>
              <p>A Serviços Tech atua para entregar soluções digitais funcionais, profissionais e compatíveis com o escopo aprovado. Ainda assim, não garante resultados comerciais específicos, volume de vendas, posicionamento definitivo em buscadores ou desempenho dependente de fatores externos, como mercado, anúncios, oferta, conteúdo, infraestrutura de terceiros e ações do próprio cliente.</p>
            </section>

            <section class="legal-section">
              <h2>8. Propriedade intelectual</h2>
              <p>Layouts, códigos, textos, imagens, marcas, materiais e conteúdos apresentados no site são protegidos por direitos de propriedade intelectual. O uso, cópia, reprodução ou adaptação sem autorização é proibido, salvo quando expressamente permitido em proposta ou contrato.</p>
              <p>Materiais fornecidos pelo cliente permanecem sob responsabilidade do cliente, que declara possuir autorização para uso.</p>
            </section>

            <section class="legal-section">
              <h2>9. Portfólio</h2>
              <p>A Serviços Tech poderá exibir projetos entregues, telas, descrições, resultados visuais, segmento de atuação e nome comercial do cliente em seu portfólio, site, redes sociais e materiais de apresentação, salvo solicitação contrária do cliente por escrito.</p>
            </section>

            <section class="legal-section">
              <h2>10. Links externos</h2>
              <p>O site pode conter links para WhatsApp, Instagram, ferramentas de terceiros ou páginas externas. A Serviços Tech não se responsabiliza por conteúdo, políticas, disponibilidade ou práticas de privacidade desses ambientes externos.</p>
            </section>

            <section class="legal-section">
              <h2>11. Alterações nos termos</h2>
              <p>Estes Termos de Uso podem ser atualizados a qualquer momento para refletir mudanças no site, nos serviços, nas práticas comerciais ou na legislação aplicável. A versão vigente estará disponível nesta página.</p>
            </section>

            <section class="legal-section">
              <h2>12. Legislação e foro</h2>
              <p>Estes termos são regidos pela legislação brasileira. Eventuais conflitos deverão ser resolvidos preferencialmente por diálogo entre as partes e, quando necessário, perante o foro competente conforme a legislação aplicável.</p>
              <p><strong>Responsável pelo tratamento dos dados:</strong><br>${escapeHtml(legalInfo.dataController)}</p>
              <p><strong>Contato:</strong><br><a href="mailto:${escapeHtml(legalInfo.contactEmail)}">${escapeHtml(legalInfo.contactEmail)}</a> e ${escapeHtml(legalInfo.contactWhatsApp)}</p>
              <p><strong>Localidade:</strong><br>${escapeHtml(legalInfo.location)}</p>
              <p class="legal-updated"><strong>Última atualização:</strong> ${escapeHtml(legalInfo.lastUpdated)}.</p>
            </section>
          </div>
        </section>
      </main>`
  });
}

function renderSitemap() {
  const urls = [
    "https://servicostech.com.br/",
    "https://servicostech.com.br/portfolio",
    "https://servicostech.com.br/politica-de-privacidade",
    "https://servicostech.com.br/termos-de-uso",
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

// Encaminha /webscraper-estabelecimentos/* para o app Flask (porta 5000),
// removendo o prefixo. Faz streaming (SSE do /scrape) e repassa POST (/export/xlsx).
function proxyToWebscraper(request, response) {
  let upstreamPath = request.url.slice(WEBSCRAPER_PREFIX.length) || "/";
  if (!upstreamPath.startsWith("/")) {
    upstreamPath = "/" + upstreamPath;
  }

  const headers = {
    ...request.headers,
    host: `${WEBSCRAPER_TARGET.host}:${WEBSCRAPER_TARGET.port}`
  };

  const proxyReq = http.request(
    {
      host: WEBSCRAPER_TARGET.host,
      port: WEBSCRAPER_TARGET.port,
      method: request.method,
      path: upstreamPath,
      headers
    },
    (proxyRes) => {
      // Repassa status e cabeçalhos como vieram (inclui text/event-stream do SSE).
      response.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(response);
    }
  );

  proxyReq.on("error", (error) => {
    log("ERROR", "webscraper_proxy_error", {
      code: error.code || "UNKNOWN",
      message: error.message,
      target: `${WEBSCRAPER_TARGET.host}:${WEBSCRAPER_TARGET.port}`
    });
    if (!response.headersSent) {
      response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    }
    response.end(
      `Webscraper indisponivel. Inicie o app Flask em ${WEBSCRAPER_TARGET.host}:${WEBSCRAPER_TARGET.port}.`
    );
  });

  // Encaminha o corpo (POST /export/xlsx); GETs finalizam automaticamente.
  request.pipe(proxyReq);
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

  const blogHostName = (request.headers.host || "").split(":")[0].toLowerCase();
  if (blogHostName === BLOG_HOST) {
    route = "blog";
    blogApp.handle(request, response).catch((error) => {
      log("ERROR", "blog_error", { message: error.message, path: request.url });
      if (!response.headersSent) {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Erro interno");
      }
    });
    return;
  }

  if (
    request.url &&
    (request.url === WEBSCRAPER_PREFIX ||
      request.url.startsWith(WEBSCRAPER_PREFIX + "/") ||
      request.url.startsWith(WEBSCRAPER_PREFIX + "?"))
  ) {
    route = "proxy.webscraper";
    pathname = request.url.split("?")[0];
    proxyToWebscraper(request, response);
    return;
  }

  if (!request.url || request.method !== "GET") {
    route = "method_not_allowed";
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Metodo nao permitido");
    return;
  }

  const url = new URL(request.url, `http://localhost:${PORT}`);
  pathname = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";

  if (pathname === "/analytics-config.js") {
    route = "asset.analytics_config";
    sendText(response, renderAnalyticsConfig(), "text/javascript; charset=utf-8");
    return;
  }

  if (pathname === "/politica-de-privacidade") {
    route = "page.privacy";
    sendHtml(response, renderPrivacyPolicyPage());
    return;
  }

  if (pathname === "/termos-de-uso") {
    route = "page.terms";
    sendHtml(response, renderTermsPage());
    return;
  }

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

  if (pathname === "/bigfly-paragliding") {
    // Garante a barra final para que os assets relativos (styles.css, assets/...) resolvam sob /bigfly-paragliding/.
    if (!url.pathname.endsWith("/")) {
      route = "page.bigfly_redirect";
      response.writeHead(301, { Location: "/bigfly-paragliding/" });
      response.end();
      return;
    }

    route = "page.bigfly";
    await sendFile(response, path.join(PUBLIC_DIR, "bigfly-paragliding", "index.html"));
    return;
  }

  if (pathname === "/narimatsu-advogados") {
    // Garante a barra final para que os assets relativos (styles.css, logo.svg, ...) resolvam sob /narimatsu-advogados/.
    if (!url.pathname.endsWith("/")) {
      route = "page.narimatsu_redirect";
      response.writeHead(301, { Location: "/narimatsu-advogados/" });
      response.end();
      return;
    }

    route = "page.narimatsu";
    await sendFile(response, path.join(PUBLIC_DIR, "narimatsu-advogados", "index.html"));
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
    await sendFile(response, path.join(PUBLIC_DIR, "favicon.ico"));
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
