/* Narimatsu Advogados — interações do site */
(function () {
  "use strict";

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    // Fecha o menu ao clicar em um link (navegação mobile)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Ano atual no rodapé ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Animação de entrada (reveal) ---- */
  var revealEls = document.querySelectorAll(
    ".section-head, .prose, .area-card, .diff-item, .contact-info, .contact-form, .map-wrap, .hero-inner"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Formulário de contato ---- */
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = form.nome.value.trim();
      var email = form.email.value.trim();
      var mensagem = form.mensagem.value.trim();

      if (!nome || !email || !mensagem) {
        showNote("Por favor, preencha nome, e-mail e mensagem.", "err");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNote("Informe um e-mail válido.", "err");
        return;
      }

      // Sem backend configurado: encaminhamos a mensagem via WhatsApp.
      // Para receber por e-mail, integre um serviço (ex.: Formspree) — veja o README.
      var telefone = form.telefone.value.trim();
      var assunto = form.assunto.value;
      var texto =
        "Olá, sou " + nome + "." +
        (assunto ? "\nAssunto: " + assunto : "") +
        "\nE-mail: " + email +
        (telefone ? "\nTelefone: " + telefone : "") +
        "\n\n" + mensagem;

      var WHATSAPP = "5511000000000"; // ⚠️ Substitua pelo número real (DDI+DDD+número)
      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);

      showNote("Redirecionando para o WhatsApp para concluir o envio…", "ok");
      window.open(url, "_blank", "noopener");
      form.reset();
    });
  }

  function showNote(msg, type) {
    if (!note) return;
    note.textContent = msg;
    note.className = "form-note " + type;
  }

  /* ---- Notícias / artigos ---- */
  var grid = document.getElementById("news-grid");
  var posts = Array.isArray(window.POSTS) ? window.POSTS.slice() : [];

  function formatDate(iso) {
    var parts = (iso || "").split("-");
    if (parts.length !== 3) return iso || "";
    var meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    return parseInt(parts[2], 10) + " de " + meses[parseInt(parts[1], 10) - 1] + ". de " + parts[0];
  }

  function paragraphs(text) {
    return (text || "")
      .split(/\n\n+/)
      .map(function (p) {
        var el = document.createElement("p");
        el.textContent = p.trim();
        return el;
      });
  }

  if (grid) {
    // Ordena do mais recente para o mais antigo
    posts.sort(function (a, b) { return (b.data || "").localeCompare(a.data || ""); });

    if (!posts.length) {
      grid.innerHTML = '<p class="news-empty">Em breve, novos conteúdos.</p>';
    } else {
      grid.innerHTML = "";
      posts.forEach(function (post, i) {
        var card = document.createElement("article");
        card.className = "news-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Ler: " + post.titulo);

        var inner = "";
        if (post.imagem) {
          inner += '<div class="news-thumb"><img src="' + post.imagem + '" alt="" loading="lazy"></div>';
        }
        inner += '<div class="news-body">';
        inner += '<time class="news-date">' + formatDate(post.data) + "</time>";
        inner += "<h3>" + escapeHtml(post.titulo) + "</h3>";
        inner += '<p class="news-summary">' + escapeHtml(post.resumo || "") + "</p>";
        inner += '<span class="news-readmore">Ler artigo →</span>';
        inner += "</div>";
        card.innerHTML = inner;

        card.addEventListener("click", function () { openPost(i, posts); });
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPost(i, posts); }
        });
        grid.appendChild(card);
      });
    }
  }

  /* ---- Modal de leitura ---- */
  var modal = document.getElementById("news-modal");

  function openPost(index, list) {
    if (!modal) return;
    var post = list[index];
    document.getElementById("news-modal-date").textContent = formatDate(post.data);
    document.getElementById("news-modal-title").textContent = post.titulo;
    var body = document.getElementById("news-modal-body");
    body.innerHTML = "";
    if (post.imagem) {
      var img = document.createElement("img");
      img.src = post.imagem; img.alt = ""; img.className = "news-modal-img";
      body.appendChild(img);
    }
    paragraphs(post.conteudo).forEach(function (p) { body.appendChild(p); });
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
})();
