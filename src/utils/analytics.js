const GTAG_SCRIPT_ID = "servicos-tech-ga4";
const GTAG_SCRIPT_BASE_URL = "https://www.googletagmanager.com/gtag/js";
const COOKIE_CONSENT_KEY = "cookieConsent";

let analyticsInitialized = false;
let scriptLoadingPromise = null;

function canUseBrowserApis() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getRuntimeMeasurementId() {
  if (!canUseBrowserApis()) return "";

  const config = window.SERVICOS_TECH_CONFIG || {};
  return (
    config.gaMeasurementId ||
    window.VITE_GA_MEASUREMENT_ID ||
    window.SERVICOS_TECH_GA_MEASUREMENT_ID ||
    ""
  ).trim();
}

function getViteMeasurementId() {
  try {
    return (import.meta.env && import.meta.env.VITE_GA_MEASUREMENT_ID) || "";
  } catch (error) {
    return "";
  }
}

export function getMeasurementId() {
  return (getRuntimeMeasurementId() || getViteMeasurementId()).trim();
}

export function hasAnalyticsConsent() {
  if (!canUseBrowserApis()) return false;

  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
  } catch (error) {
    return false;
  }
}

export function loadGoogleAnalyticsScript(measurementId = getMeasurementId()) {
  if (!canUseBrowserApis() || !measurementId) {
    return Promise.resolve(false);
  }

  const existingScript = document.getElementById(GTAG_SCRIPT_ID);
  if (existingScript) {
    return Promise.resolve(true);
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = GTAG_SCRIPT_ID;
    script.async = true;
    script.src = `${GTAG_SCRIPT_BASE_URL}?id=${encodeURIComponent(measurementId)}`;

    script.addEventListener("load", () => resolve(true), { once: true });
    script.addEventListener(
      "error",
      () => {
        script.remove();
        scriptLoadingPromise = null;
        resolve(false);
      },
      { once: true }
    );

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

function setupDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
}

export async function initializeAnalytics() {
  if (!canUseBrowserApis() || !hasAnalyticsConsent() || analyticsInitialized) {
    return analyticsInitialized;
  }

  const measurementId = getMeasurementId();
  if (!measurementId) {
    return false;
  }

  setupDataLayer();

  const scriptLoaded = await loadGoogleAnalyticsScript(measurementId);
  if (!scriptLoaded || !hasAnalyticsConsent() || typeof window.gtag !== "function") {
    disableAnalytics();
    return false;
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId);
  analyticsInitialized = true;

  return true;
}

export function isAnalyticsInitialized() {
  return analyticsInitialized;
}

export function disableAnalytics() {
  if (!canUseBrowserApis()) {
    analyticsInitialized = false;
    scriptLoadingPromise = null;
    return;
  }

  const script = document.getElementById(GTAG_SCRIPT_ID);
  if (script) {
    script.remove();
  }

  analyticsInitialized = false;
  scriptLoadingPromise = null;
  window.dataLayer = [];
  window.gtag = undefined;
}

export function trackPageView(params = {}) {
  if (
    !canUseBrowserApis() ||
    !hasAnalyticsConsent() ||
    !analyticsInitialized ||
    typeof window.gtag !== "function"
  ) {
    return false;
  }

  window.gtag("event", "page_view", {
    page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    page_title: document.title,
    page_location: window.location.href,
    ...params
  });

  return true;
}

export function trackEvent(eventName, params = {}) {
  if (
    !canUseBrowserApis() ||
    !hasAnalyticsConsent() ||
    !eventName ||
    !analyticsInitialized ||
    typeof window.gtag !== "function"
  ) {
    return false;
  }

  window.gtag("event", eventName, params);
  return true;
}
