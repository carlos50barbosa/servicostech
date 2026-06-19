const WHATSAPP_NUMBER = "5521992465732";
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Carl%C3%A3o+BigFly+-+Parapente+-+Rio+de+Janeiro/@-23.001269,-43.2759591,763m/data=!3m2!1e3!4b1!4m6!3m5!1s0x9bd6c9b3e470a1:0xac0a94e05da96418!8m2!3d-23.001274!4d-43.2733842!16s%2Fg%2F11cl_fzskn?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D";
const GALLERY_IMAGE_COUNT = Number(window.BIGFLY_GALLERY_IMAGE_COUNT) || 14;
const DESKTOP_GALLERY_ITEMS_PER_PAGE = 3;
const MOBILE_GALLERY_ITEMS_PER_PAGE = 1;
const DEFAULT_LANGUAGE = "pt";
const LANGUAGE_STORAGE_KEY = "bigfly-language";
const COOKIE_CONSENT_STORAGE_KEY = "bigfly_cookie_consent";
const SEO_LOCALES = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
};

const translations = window.BIGFLY_TRANSLATIONS || {};
const supportedLanguages = Object.keys(translations);

const googleReviews = [
  {
    nome: "Guilherme Ribeiro de Melo",
    nota: 5,
    texto: "Muito bom, o melhor profissional do Rio de Janeiro. Show de bola recomendo!!",
    origem: "Google",
  },
  {
    nome: "Vania Mendes",
    nota: 5,
    texto: "Muito bacana nota 10!",
    origem: "Google",
  },
  {
    nome: "Filipe Guimarães",
    nota: 5,
    texto: "Muito bacana!!!",
    origem: "Google",
  },
  {
    nome: "Luiz Gibra",
    nota: 5,
    texto: "Boa equipe de vôo.",
    origem: "Google",
  },
  {
    nome: "Alessandra Olivares",
    nota: 5,
    texto:
      "Altamente recomendado! Carlos é um ótimo instrutor, muito paciente e dedicado.\n\nEsta é uma experiência única, que vale a pena vivenciar pelo menos uma vez na vida, especialmente com um instrutor como ele.\n\n100% recomendado!",
    origem: "Google",
  },
  {
    nome: "Gerardo Bordon",
    nota: 5,
    texto:
      "Experiência excelente. O piloto foi muito profissional e me fez sentir segura o tempo todo. O voo foi espetacular e verdadeiramente inesquecível. Recomendo muito!",
    origem: "Google",
  },
];

const galleryImages = Array.from({ length: GALLERY_IMAGE_COUNT }, (_, index) => ({
  number: index + 1,
  src: `assets/images/album/${index + 1}.jpeg`,
}));

let currentGalleryStartIndex = 0;
let currentGoogleReviewIndex = 0;

const safeLocalStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      // localStorage can be unavailable in restricted browsing modes.
    }
  },
};

const normalizeLanguage = (language) =>
  supportedLanguages.includes(language) ? language : DEFAULT_LANGUAGE;

let currentLanguage = normalizeLanguage(safeLocalStorage.get(LANGUAGE_STORAGE_KEY));

const getDictionary = (language = currentLanguage) =>
  translations[normalizeLanguage(language)] || translations[DEFAULT_LANGUAGE] || {};

const getValueFromDictionary = (dictionary, key) =>
  key.split(".").reduce((value, keyPart) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    return value[keyPart];
  }, dictionary);

const formatValue = (value, replacements = {}) => {
  if (typeof value !== "string") {
    return value;
  }

  return Object.entries(replacements).reduce(
    (text, [key, replacement]) => text.replaceAll(`{${key}}`, String(replacement)),
    value
  );
};

const t = (key, replacements = {}) => {
  const activeValue = getValueFromDictionary(getDictionary(), key);
  const fallbackValue = getValueFromDictionary(getDictionary(DEFAULT_LANGUAGE), key);
  const value = activeValue ?? fallbackValue ?? "";

  return formatValue(value, replacements);
};

const updateWhatsappLinks = () => {
  const message = t("whatsappMessage");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.setAttribute("href", whatsappUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  });
};

const updateSeo = () => {
  const dictionary = getDictionary();
  const description = document.querySelector('meta[name="description"]');
  const setMetaContent = (selector, content) => {
    const element = document.querySelector(selector);

    if (element && content) {
      element.setAttribute("content", content);
    }
  };

  document.documentElement.lang = dictionary.lang || "pt-BR";
  document.title = t("seo.title");

  if (description) {
    description.setAttribute("content", t("seo.description"));
  }

  setMetaContent('meta[property="og:locale"]', SEO_LOCALES[currentLanguage]);
  setMetaContent('meta[property="og:title"]', t("seo.title"));
  setMetaContent('meta[property="og:description"]', t("seo.description"));
  setMetaContent('meta[name="twitter:title"]', t("seo.title"));
  setMetaContent('meta[name="twitter:description"]', t("seo.description"));
};

const updateStaticTranslations = () => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = t(element.dataset.i18n);

    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(";").forEach((definition) => {
      const [attribute, key] = definition.split(":").map((part) => part.trim());
      const value = t(key);

      if (attribute && key && typeof value === "string") {
        element.setAttribute(attribute, value);
      }
    });
  });
};

const updateLanguageSwitcher = () => {
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === currentLanguage;
    const label = t(button.dataset.languageLabel);

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));

    if (label) {
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    }
  });
};

const getLocalizedReviewText = (review) => {
  if (typeof review.texto === "object" && review.texto !== null) {
    return review.texto[currentLanguage] || review.texto[DEFAULT_LANGUAGE] || "";
  }

  const languageField = `texto${currentLanguage[0].toUpperCase()}${currentLanguage.slice(1)}`;

  return review[languageField] || review.texto || "";
};

const getLocalizedOrigin = (review) => {
  if (typeof review.origem === "object" && review.origem !== null) {
    return review.origem[currentLanguage] || review.origem[DEFAULT_LANGUAGE] || "Google";
  }

  return review.origem || "Google";
};

const renderGoogleReviewsCarousel = () => {
  const reviewsContainer = document.querySelector("[data-google-reviews]");
  const googleReviewsLink = document.querySelector("[data-google-reviews-link]");
  const previousButton = document.querySelector("[data-google-review-prev]");
  const nextButton = document.querySelector("[data-google-review-next]");

  if (googleReviewsLink) {
    googleReviewsLink.setAttribute("href", GOOGLE_REVIEWS_URL);

    if (GOOGLE_REVIEWS_URL !== "#") {
      googleReviewsLink.setAttribute("target", "_blank");
      googleReviewsLink.setAttribute("rel", "noreferrer");
    }
  }

  if (!reviewsContainer) {
    return;
  }

  reviewsContainer.replaceChildren();

  if (!googleReviews.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "reviews-empty";
    emptyMessage.textContent = t("googleReviews.empty");
    reviewsContainer.classList.add("is-empty");
    reviewsContainer.append(emptyMessage);
    previousButton?.setAttribute("disabled", "");
    nextButton?.setAttribute("disabled", "");
    return;
  }

  reviewsContainer.classList.remove("is-empty");
  previousButton?.removeAttribute("disabled");
  nextButton?.removeAttribute("disabled");

  currentGoogleReviewIndex =
    ((currentGoogleReviewIndex % googleReviews.length) + googleReviews.length) % googleReviews.length;

  const review = googleReviews[currentGoogleReviewIndex];
  const rating = Math.max(0, Math.min(5, Math.round(Number(review.nota) || 0)));
  const card = document.createElement("article");
  card.className = "google-review-card";

  const top = document.createElement("div");
  top.className = "google-review-top";

  const profile = document.createElement("div");
  profile.className = "google-review-profile";

  const avatar = document.createElement("div");
  avatar.className = "google-review-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = (review.nome || t("googleReviews.customerFallback"))
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join("")
    .toUpperCase();

  const person = document.createElement("div");
  person.className = "google-review-person";

  const name = document.createElement("h3");
  name.textContent = review.nome || t("googleReviews.customerFallback");

  const origin = document.createElement("span");
  origin.textContent = getLocalizedOrigin(review);

  person.append(name, origin);
  profile.append(avatar, person);

  const badge = document.createElement(GOOGLE_REVIEWS_URL === "#" ? "div" : "a");
  badge.className = "google-badge";
  badge.setAttribute("aria-label", t("googleReviews.badgeAria"));

  if (GOOGLE_REVIEWS_URL !== "#") {
    badge.setAttribute("href", GOOGLE_REVIEWS_URL);
    badge.setAttribute("target", "_blank");
    badge.setAttribute("rel", "noreferrer");
  }

  const badgeIcon = document.createElement("span");
  badgeIcon.textContent = "G";

  badge.append(badgeIcon, "Google");
  top.append(profile, badge);

  const stars = document.createElement("div");
  stars.className = "review-stars";
  stars.setAttribute("aria-label", t("googleReviews.starsAria", { rating }));
  stars.textContent = `${"\u2605".repeat(rating)}${"\u2606".repeat(5 - rating)}`;

  const text = document.createElement("p");
  const reviewText = getLocalizedReviewText(review).trim();
  text.textContent = reviewText ? `"${reviewText}"` : "";

  card.append(top, stars, text);
  reviewsContainer.append(card);
};

const renderGallery = () => {
  const gallery = document.querySelector("[data-gallery]");
  const previousButton = document.querySelector("[data-gallery-prev]");
  const nextButton = document.querySelector("[data-gallery-next]");
  const status = document.querySelector("[data-gallery-status]");

  if (!gallery) {
    return;
  }

  const fragment = document.createDocumentFragment();
  const itemsPerPage = window.matchMedia("(max-width: 680px)").matches
    ? MOBILE_GALLERY_ITEMS_PER_PAGE
    : DESKTOP_GALLERY_ITEMS_PER_PAGE;
  const lastStartIndex = Math.max(0, galleryImages.length - itemsPerPage);

  if (itemsPerPage > 1) {
    currentGalleryStartIndex =
      Math.floor(currentGalleryStartIndex / itemsPerPage) * itemsPerPage;
  }

  currentGalleryStartIndex = Math.min(currentGalleryStartIndex, lastStartIndex);

  const visibleImages = galleryImages.slice(
    currentGalleryStartIndex,
    currentGalleryStartIndex + itemsPerPage
  );

  visibleImages.forEach((image) => {
    const item = document.createElement("figure");
    item.className = "gallery-item";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = t("gallery.imageAlt", { number: image.number });
    img.loading = "lazy";
    img.decoding = "async";

    item.append(img);
    fragment.append(item);
  });

  gallery.replaceChildren(fragment);

  if (previousButton) {
    previousButton.disabled = currentGalleryStartIndex === 0;
  }

  if (nextButton) {
    nextButton.disabled = currentGalleryStartIndex >= lastStartIndex;
  }

  if (status) {
    const endIndex = Math.min(currentGalleryStartIndex + visibleImages.length, galleryImages.length);
    status.textContent =
      itemsPerPage === 1
        ? t("gallery.statusSingle", {
            current: currentGalleryStartIndex + 1,
            total: galleryImages.length,
          })
        : t("gallery.statusRange", {
            start: currentGalleryStartIndex + 1,
            end: endIndex,
            total: galleryImages.length,
          });
  }
};

const bindFaqToggles = () => {
  document.querySelectorAll(".faq-list details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) {
        return;
      }

      document.querySelectorAll(".faq-list details").forEach((otherDetail) => {
        if (otherDetail !== detail) {
          otherDetail.removeAttribute("open");
        }
      });
    });
  });
};

const renderFaq = () => {
  const faqList = document.querySelector("[data-faq-list]");
  const items = t("faq.items");

  if (!faqList || !Array.isArray(items)) {
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const detail = document.createElement("details");
    const summary = document.createElement("summary");
    const answer = document.createElement("p");

    summary.textContent = item.question;
    answer.textContent = item.answer;
    detail.append(summary, answer);
    fragment.append(detail);
  });

  faqList.replaceChildren(fragment);
  bindFaqToggles();
};

const initCookieBanner = () => {
  const banner = document.querySelector("[data-cookie-banner]");
  const acceptButton = document.querySelector("[data-cookie-accept]");
  const rejectButton = document.querySelector("[data-cookie-reject]");

  if (!banner) {
    return;
  }

  const currentConsent = safeLocalStorage.get(COOKIE_CONSENT_STORAGE_KEY);

  if (currentConsent === "accepted" || currentConsent === "rejected") {
    banner.hidden = true;
    return;
  }

  const setConsent = (value) => {
    safeLocalStorage.set(COOKIE_CONSENT_STORAGE_KEY, value);
    banner.hidden = true;
  };

  acceptButton?.addEventListener("click", () => {
    // Se Google Analytics, Meta Pixel ou Tag Manager forem adicionados futuramente,
    // carregue esses scripts somente depois deste aceite.
    setConsent("accepted");
  });

  rejectButton?.addEventListener("click", () => {
    setConsent("rejected");
  });

  banner.hidden = false;
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const menuBackdrop = document.querySelector("[data-menu-backdrop]");
const menuToggleLabel = document.querySelector("[data-menu-toggle-label]");

const syncMenuToggleLabel = () => {
  const isOpen = navLinks?.classList.contains("is-open") || false;

  if (menuToggleLabel) {
    menuToggleLabel.textContent = isOpen ? t("menu.close") : t("menu.open");
  }
};

const setMenuState = (isOpen) => {
  navLinks?.classList.toggle("is-open", isOpen);
  menuBackdrop?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  syncMenuToggleLabel();
};

const closeMenu = () => {
  setMenuState(false);
};

const applyLanguage = () => {
  updateSeo();
  updateStaticTranslations();
  updateLanguageSwitcher();
  syncMenuToggleLabel();
  updateWhatsappLinks();
  renderGoogleReviewsCarousel();
  renderGallery();
  renderFaq();
};

const setLanguage = (language) => {
  currentLanguage = normalizeLanguage(language);
  safeLocalStorage.set(LANGUAGE_STORAGE_KEY, currentLanguage);
  applyLanguage();
};

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.language);
  });
});

applyLanguage();
initCookieBanner();

document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
  const itemsPerPage = window.matchMedia("(max-width: 680px)").matches
    ? MOBILE_GALLERY_ITEMS_PER_PAGE
    : DESKTOP_GALLERY_ITEMS_PER_PAGE;

  currentGalleryStartIndex = Math.max(0, currentGalleryStartIndex - itemsPerPage);
  renderGallery();
});

document.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
  const itemsPerPage = window.matchMedia("(max-width: 680px)").matches
    ? MOBILE_GALLERY_ITEMS_PER_PAGE
    : DESKTOP_GALLERY_ITEMS_PER_PAGE;
  const lastStartIndex = Math.max(0, galleryImages.length - itemsPerPage);

  currentGalleryStartIndex = Math.min(lastStartIndex, currentGalleryStartIndex + itemsPerPage);
  renderGallery();
});

window.matchMedia("(max-width: 680px)").addEventListener("change", renderGallery);

document.querySelector("[data-google-review-prev]")?.addEventListener("click", () => {
  currentGoogleReviewIndex -= 1;
  renderGoogleReviewsCarousel();
});

document.querySelector("[data-google-review-next]")?.addEventListener("click", () => {
  currentGoogleReviewIndex += 1;
  renderGoogleReviewsCarousel();
});

menuToggle?.addEventListener("click", () => {
  setMenuState(!navLinks?.classList.contains("is-open"));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  if (!navLinks?.classList.contains("is-open")) {
    return;
  }

  const clickedInsideMenu = navLinks.contains(event.target);
  const clickedToggle = menuToggle?.contains(event.target);

  if (!clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
});

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll("[data-slide-dot]"));
let currentSlide = 0;
let slideTimer;

const showSlide = (index) => {
  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentSlide);
  });
};

const startSlider = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || slides.length < 2) {
    return;
  }

  slideTimer = window.setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5200);
};

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    window.clearInterval(slideTimer);
    showSlide(Number(dot.dataset.slideDot));
    startSlider();
  });
});

startSlider();
