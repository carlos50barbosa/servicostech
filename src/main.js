import {
  initializeAnalytics,
  isAnalyticsInitialized,
  trackEvent,
  trackPageView
} from "./utils/analytics.js";

const COOKIE_CONSENT_KEY = "cookieConsent";

function safeStorage(action, value) {
  try {
    if (action === "get") return window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (action === "remove") return window.localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch (error) {}

  return null;
}

function getConsent() {
  return safeStorage("get");
}

function setConsent(value) {
  safeStorage("set", value);
}

function clearConsent() {
  safeStorage("remove");
}

function showBanner(banner) {
  if (banner) banner.hidden = false;
}

function hideBanner(banner) {
  if (banner) banner.hidden = true;
}

async function acceptCookies(banner) {
  setConsent("accepted");
  hideBanner(banner);
  await initializeAnalytics();
}

function rejectCookies(banner) {
  setConsent("rejected");
  hideBanner(banner);
}

function setupCookieConsent() {
  const banner = document.querySelector("[data-cookie-consent]");
  const acceptButton = document.querySelector("[data-cookie-accept]");
  const rejectButton = document.querySelector("[data-cookie-reject]");
  const preferenceButtons = document.querySelectorAll("[data-cookie-preferences]");
  const consent = getConsent();

  if (consent === "accepted") {
    initializeAnalytics();
  } else if (!consent) {
    showBanner(banner);
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", () => acceptCookies(banner));
  }

  if (rejectButton) {
    rejectButton.addEventListener("click", () => rejectCookies(banner));
  }

  preferenceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      clearConsent();
      showBanner(banner);
      if (acceptButton) acceptButton.focus();
    });
  });
}

function getElementText(element) {
  return (element.getAttribute("aria-label") || element.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getEventLocation(element) {
  const locations = [
    [".site-header", "header"],
    [".mobile-menu", "mobile_menu"],
    [".hero", "hero"],
    ["#beneficios", "benefits"],
    ["#portfolio", "portfolio"],
    [".project-card", "portfolio_card"],
    ["#oferta", "offer"],
    [".final-cta", "final_cta"],
    ["#contato", "contact"],
    [".whatsapp-float", "floating_whatsapp"],
    [".site-footer", "footer"]
  ];

  const match = locations.find(([selector]) => element.closest(selector));
  return match ? match[1] : "site";
}

function getLinkUrl(element) {
  return element.href || element.getAttribute("href") || "";
}

function setupImportantClickTracking() {
  document.addEventListener("click", (event) => {
    if (!event.target || typeof event.target.closest !== "function") return;

    const target = event.target.closest("a, button");
    if (!target) return;

    const text = getElementText(target);
    const url = getLinkUrl(target);
    const location = getEventLocation(target);
    const payload = {
      location,
      link_text: text || undefined,
      link_url: url || undefined
    };

    if (url.includes("wa.me") || /whatsapp/i.test(text)) {
      trackEvent("click_whatsapp", payload);
    }

    if (/solicitar|or[cç]amento|proposta|quero um site/i.test(text)) {
      trackEvent("click_solicitar_orcamento", payload);
    }

    if (/ver planos/i.test(text) || url.includes("#oferta") || url.includes("/#oferta")) {
      trackEvent("click_ver_planos", payload);
    }

    if (
      /portf[oó]lio|portfolio|ver detalhes/i.test(text) ||
      url.includes("#portfolio") ||
      url.includes("/portfolio")
    ) {
      trackEvent("click_ver_portfolio", payload);
    }
  });
}

function setupRouteTracking() {
  let currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  function trackRouteChange() {
    const nextUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl === currentUrl) return;

    currentUrl = nextUrl;
    trackPageView();
  }

  ["pushState", "replaceState"].forEach((methodName) => {
    const original = window.history[methodName];
    window.history[methodName] = function patchedHistoryMethod() {
      const result = original.apply(this, arguments);
      window.setTimeout(trackRouteChange, 0);
      return result;
    };
  });

  window.addEventListener("popstate", trackRouteChange);
  window.addEventListener("hashchange", trackRouteChange);
}

function exposeAnalyticsHelpers() {
  window.servicosTechAnalytics = {
    initializeAnalytics,
    isAnalyticsInitialized,
    trackEvent,
    trackPageView
  };
}

function init() {
  exposeAnalyticsHelpers();
  setupCookieConsent();
  setupImportantClickTracking();
  setupRouteTracking();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}
