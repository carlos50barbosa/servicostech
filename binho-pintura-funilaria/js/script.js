/* =====================================================================
   Binho Pinturas Automotivas e Funilaria — Interações (JS vanilla)
   - Número/WhatsApp centralizado (fácil de trocar)
   - Links de WhatsApp com mensagem pré-preenchida
   - Navbar com fundo ao rolar + link ativo
   - Menu mobile (hambúrguer)
   - Animações de scroll (IntersectionObserver)
   - FAQ acordeão
   - Ano automático no rodapé
   ===================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     CONFIG — altere o número aqui se necessário (formato: 55 + DDD + número)
  ---------------------------------------------------------------- */
  var WHATSAPP_NUMBER = '5582999946480';

  /* ----------------------------------------------------------------
     1) Links de WhatsApp com mensagem pré-preenchida
        Cada <a class="wa-link"> pode ter data-wa="mensagem".
        Isso mantém o HTML limpo e os links sempre corretos/codificados.
  ---------------------------------------------------------------- */
  function buildWhatsAppLinks() {
    var defaultMsg = 'Olá! Vim pelo site e quero fazer um orçamento.';
    document.querySelectorAll('a.wa-link').forEach(function (a) {
      var msg = a.getAttribute('data-wa') || defaultMsg;
      a.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  /* ----------------------------------------------------------------
     2) Navbar: fundo sólido ao rolar
  ---------------------------------------------------------------- */
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    function onScroll() {
      if (window.scrollY > 24) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------------
     3) Menu mobile (abrir/fechar)
  ---------------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    var iconOpen = document.getElementById('icon-open');
    var iconClose = document.getElementById('icon-close');
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      if (iconOpen) iconOpen.classList.toggle('hidden', open);
      if (iconClose) iconClose.classList.toggle('hidden', !open);
    }

    toggle.addEventListener('click', function () {
      setOpen(menu.classList.contains('hidden'));
    });

    // Fecha ao clicar em qualquer link do menu
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    // Fecha com a tecla ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) setOpen(false);
    });
  }

  /* ----------------------------------------------------------------
     4) Animações de entrada ao rolar (IntersectionObserver)
  ---------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    // Aplica atraso opcional (data-reveal-delay em ms)
    items.forEach(function (el) {
      var delay = el.getAttribute('data-reveal-delay');
      if (delay) el.style.transitionDelay = delay + 'ms';
    });

    if (!('IntersectionObserver' in window)) {
      // Fallback: mostra tudo
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------------
     5) FAQ acordeão
  ---------------------------------------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var answer = item.querySelector('.faq-a');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Fecha os demais (comportamento de acordeão)
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            var oa = other.querySelector('.faq-a');
            var ob = other.querySelector('.faq-q');
            if (oa) oa.style.maxHeight = null;
            if (ob) ob.setAttribute('aria-expanded', 'false');
          }
        });

        // Alterna o atual
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = null;
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ----------------------------------------------------------------
     6) Link ativo na navbar conforme a seção visível
  ---------------------------------------------------------------- */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id], footer[id]');
    var links = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (l) {
      var href = l.getAttribute('href');
      if (href && href.indexOf('#') === 0) map[href.slice(1)] = l;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var active = map[entry.target.id];
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ----------------------------------------------------------------
     7) Ano automático no rodapé
  ---------------------------------------------------------------- */
  function initYear() {
    var el = document.getElementById('ano');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------
     Inicialização
  ---------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    buildWhatsAppLinks();
    initNavbarScroll();
    initMobileMenu();
    initReveal();
    initFaq();
    initActiveNav();
    initYear();
  });
})();
