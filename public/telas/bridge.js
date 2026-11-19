/*
 * Ponte entre as telas exportadas do Google Stitch e o portal Next.js.
 *
 * Só atua quando a tela é carregada pelo portal (?embed=1):
 *  - remove header, rodapé e trilha próprios da tela (o portal usa os globais);
 *  - exibe apenas os blocos da subtela (?only=id1,id2 ou ?hide=id1,id2);
 *  - informa a altura do conteúdo para o iframe crescer sem barra de rolagem;
 *  - encaminha cliques de links/âncoras/busca para o roteador do portal;
 *  - adiciona validação e feedback aos formulários das telas.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  if (!params.has("embed") || window.parent === window) return;

  function send(message) {
    message.source = "stitch-bridge";
    window.parent.postMessage(message, location.origin);
  }

  function list(name) {
    return (params.get(name) || "")
      .split(",")
      .map(function (value) {
        return value.trim();
      })
      .filter(Boolean);
  }

  function normalize(text) {
    return (text || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  }

  function textOf(element) {
    var clone = element.cloneNode(true);
    clone.querySelectorAll(".material-symbols-outlined").forEach(function (icon) {
      icon.remove();
    });
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  /* ------------------------------------------------------------ */
  /* Layout                                                        */
  /* ------------------------------------------------------------ */

  var style = document.createElement("style");
  style.textContent =
    "html{overflow-y:hidden!important;height:auto!important;min-height:0!important}body{overflow:visible!important;height:auto!important;min-height:0!important}" +
    "main,.min-h-screen{min-height:0!important}" +
    "[data-bridge-hidden]{display:none!important}" +
    "[data-bridge-link]{cursor:pointer}" +
    "[data-bridge-link]:focus-visible{outline:2px solid #7B357D;outline-offset:2px}" +
    // Algumas telas originais são mais largas que celulares: mantém a rolagem horizontal
    // do original (sem cortar conteúdo); a vertical continua sendo a da página do portal.
    "html{overflow-x:auto!important}";
  document.head.appendChild(style);

  function hide(element) {
    if (element) element.setAttribute("data-bridge-hidden", "");
  }

  function removeChrome() {
    document.querySelectorAll("body > header, body > footer").forEach(hide);
    document.querySelectorAll("nav").forEach(function (nav) {
      var label = nav.getAttribute("aria-label") || "";
      if (label === "Trilha de navegação" || label === "Breadcrumb") hide(nav);
    });
    document.querySelectorAll("main").forEach(function (main) {
      main.style.paddingTop = "0";
      main.style.marginTop = "0";
    });
    // Barras "sticky" das telas foram pensadas para o header fixo do Stitch
    document.querySelectorAll('[class*="sticky"]').forEach(function (element) {
      element.style.position = "static";
    });
  }

  function applyVisibility() {
    list("hide").forEach(function (id) {
      hide(document.getElementById(id));
    });

    var only = list("only")
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);
    if (only.length === 0) return;

    var keep = new Set();
    only.forEach(function (element) {
      var node = element;
      while (node && node !== document.body) {
        keep.add(node);
        node = node.parentElement;
      }
    });
    keep.forEach(function (node) {
      if (!node.parentElement) return;
      Array.prototype.forEach.call(node.parentElement.children, function (sibling) {
        if (!keep.has(sibling) && sibling.tagName !== "SCRIPT" && sibling.tagName !== "STYLE") hide(sibling);
      });
    });
  }

  function isVisible(element) {
    return !!element && !element.closest("[data-bridge-hidden]") && element.getClientRects().length > 0;
  }

  /* ------------------------------------------------------------ */
  /* Altura                                                        */
  /* ------------------------------------------------------------ */

  var lastHeight = 0;
  var scheduled = false;

  function measure() {
    scheduled = false;
    // soma a barra de rolagem horizontal, quando houver
    var scrollbar = Math.max(0, window.innerHeight - document.documentElement.clientHeight);
    var height = Math.ceil(document.body.getBoundingClientRect().height) + scrollbar;
    if (height > 0 && Math.abs(height - lastHeight) > 1) {
      lastHeight = height;
      send({ type: "height", height: height });
    }
  }

  function scheduleMeasure() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(measure);
  }

  /* ------------------------------------------------------------ */
  /* Navegação                                                     */
  /* ------------------------------------------------------------ */

  function scrollToElement(element) {
    send({ type: "scroll", top: element.getBoundingClientRect().top + window.scrollY });
  }

  function cardTitle(control, selector) {
    var card = control.closest(selector);
    var heading = card && card.querySelector("h3, h4");
    return heading ? textOf(heading) : "";
  }

  /**
   * Botões e links das telas que abrem recursos do portal (documentos, detalhes
   * de unidade, rotas no mapa). Retorna true quando a ação foi tratada.
   */
  function handleAction(control, event) {
    var text = textOf(control);
    var message = null;

    if (/^PDF \(/.test(text)) {
      var row = control.closest("tr");
      var title = row && row.querySelector("td div > span");
      message = { type: "document", id: title ? textOf(title) : "" };
    } else if (/^Acessar Reposit/.test(text)) {
      message = { type: "repository", year: "" };
    } else if (/^Filtrar por Ano/.test(text)) {
      var year = (text.match(/\d{4}/) || [""])[0];
      message = { type: "repository", year: year };
    } else if (text === "Detalhes" || text === "Ver detalhes da unidade") {
      message = { type: "unit", name: cardTitle(control, "article, .unit-card") };
    } else if (text === "Traçar rota no mapa") {
      message = { type: "route", name: cardTitle(control, "div.rounded-xl, div.rounded-2xl") };
    } else if (control.tagName === "BUTTON" && control.type !== "submit" && /^(consulta|vacina|remédio|posto de saúde|UPA 24h)$/i.test(text)) {
      // Atalhos de busca da Home (tema roxo)
      message = { type: "search", query: text };
    }

    if (!message) return false;
    event.preventDefault();
    event.stopImmediatePropagation();
    send(message);
    return true;
  }

  // Prevenção: alternância "Sede Urbana" / "Costa (Orla)" nas salas de vacina
  function setupVaccineToggle() {
    var buttons = Array.prototype.filter.call(document.querySelectorAll("button"), function (button) {
      return /^(Sede Urbana|Costa \(Orla\))$/.test(textOf(button));
    });
    if (buttons.length !== 2) return;
    var activeClasses = buttons[0].className;
    var idleClasses = buttons[1].className;
    var list = buttons[0].parentElement.nextElementSibling;
    if (!list) return;
    var units = Array.prototype.slice.call(list.children);
    function isCoast(unit) {
      return /Costa|Orla|Arembepe|Monte Gordo|Jacu[ií]pe|Guarajuba/i.test(unit.textContent);
    }
    function select(index) {
      buttons.forEach(function (button, i) {
        button.className = i === index ? activeClasses : idleClasses;
        button.setAttribute("aria-pressed", String(i === index));
      });
      units.forEach(function (unit) {
        unit.style.display = isCoast(unit) === (index === 1) ? "" : "none";
      });
      scheduleMeasure();
    }
    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        select(index);
      });
    });
    buttons[0].parentElement.setAttribute("role", "group");
    buttons[0].parentElement.setAttribute("aria-label", "Região das salas de vacina");
    select(0);
  }

  // Home (tema roxo): formulário de busca
  function setupRoxoSearch() {
    var form = document.querySelector('main form[role="search"]');
    if (!form) return;
    var searchInput = form.querySelector("input");
    if (searchInput && !searchInput.id) searchInput.id = "busca-servicos";
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var input = form.querySelector("input");
        var query = input ? input.value.trim() : "";
        if (query.length < 2) {
          if (input) {
            input.setAttribute("aria-invalid", "true");
            input.focus();
          }
          fieldError(input, " Digite ao menos 2 caracteres para buscar.");
          return;
        }
        fieldError(input, "");
        send({ type: "search", query: query });
      },
      true,
    );
  }

  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      if (!(target instanceof Element)) return;

      var card = target.closest("[data-bridge-link]");
      var anchor = target.closest("a");

      if (card && !anchor) {
        event.preventDefault();
        send({ type: "link", path: "", text: card.getAttribute("data-bridge-link") });
        return;
      }

      var searchButton = target.closest("[data-bridge-search]");
      if (searchButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        submitHomeSearch();
        return;
      }

      var control = target.closest("a, button");
      if (control && handleAction(control, event)) return;

      if (!anchor) return;
      var href = anchor.getAttribute("href") || "";

      if (/^(mailto:|tel:)/i.test(href)) return;
      if (/^https?:/i.test(href)) {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
        return;
      }

      event.preventDefault();

      if (href.length > 1 && href.charAt(0) === "#") {
        var id = href.slice(1);
        var element = document.getElementById(id);
        if (isVisible(element)) scrollToElement(element);
        else send({ type: "anchor", id: id });
        return;
      }

      send({ type: "link", path: anchor.getAttribute("data-path") || "", text: textOf(anchor) });
    },
    true,
  );

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    var card = event.target instanceof Element && event.target.closest("[data-bridge-link]");
    if (card && !event.target.closest("a, button")) {
      event.preventDefault();
      send({ type: "link", path: "", text: card.getAttribute("data-bridge-link") });
    }
  });

  window.addEventListener("message", function (event) {
    if (event.origin !== location.origin || !event.data || event.data.source !== "stitch-host") return;
    if (event.data.type === "hello") {
      lastHeight = 0;
      measure();
      send({ type: "ready" });
      return;
    }
    if (event.data.type === "reveal") {
      var element = document.getElementById(event.data.id);
      if (isVisible(element)) scrollToElement(element);
    }
  });

  /* ------------------------------------------------------------ */
  /* Busca da Home                                                 */
  /* ------------------------------------------------------------ */

  function showSearchFeedback(message) {
    var feedback = document.getElementById("search-feedback");
    if (!feedback) return;
    feedback.classList.remove("hidden");
    var label = feedback.querySelector("span");
    if (label) {
      label.innerHTML = "";
      var icon = document.createElement("span");
      icon.className = "material-symbols-outlined text-[18px]";
      icon.textContent = "error";
      label.appendChild(icon);
      label.appendChild(document.createTextNode(" " + message));
    }
    scheduleMeasure();
  }

  function submitHomeSearch() {
    var input = document.getElementById("search-input");
    if (!input) return;
    var query = input.value.trim();
    if (query.length < 2) {
      input.setAttribute("aria-invalid", "true");
      showSearchFeedback("Digite ao menos 2 caracteres para buscar um serviço.");
      input.focus();
      return;
    }
    input.removeAttribute("aria-invalid");
    send({ type: "search", query: query });
  }

  function setupHomeSearch() {
    var input = document.getElementById("search-input");
    if (!input) return;
    input.setAttribute("aria-label", "Qual serviço de saúde você está procurando?");
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        submitHomeSearch();
      }
    });
  }

  /* ------------------------------------------------------------ */
  /* Formulários                                                   */
  /* ------------------------------------------------------------ */

  function fieldError(field, message) {
    var wrapper = field.closest("div") ? field.closest("div").parentElement : field.parentElement;
    var id = field.id + "-erro";
    var existing = document.getElementById(id);
    if (!message) {
      if (existing) existing.remove();
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
      field.classList.remove("!border-[#ba1a1a]", "!ring-[#ba1a1a]");
      scheduleMeasure();
      return;
    }
    if (!existing) {
      existing = document.createElement("p");
      existing.id = id;
      existing.setAttribute("role", "alert");
      existing.className = "mt-2 flex items-center gap-1 text-sm font-semibold text-[#ba1a1a]";
      wrapper.appendChild(existing);
    }
    existing.innerHTML = "";
    var icon = document.createElement("span");
    icon.className = "material-symbols-outlined text-[18px]";
    icon.textContent = "error";
    existing.appendChild(icon);
    existing.appendChild(document.createTextNode(message));
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", id);
    field.classList.add("!border-[#ba1a1a]", "!ring-[#ba1a1a]");
    scheduleMeasure();
  }

  // Remédios nos Postos: validação + filtro dos resultados exibidos
  function setupMedicineForm() {
    var form = document.getElementById("medicamento-search-form");
    if (!form) return;
    var field = document.getElementById("campo-remedio");
    var cards = document.getElementById("cards-container");
    var badge = document.getElementById("badge-total");
    var submit = form.querySelector('button[type="submit"]');

    var empty = document.createElement("div");
    empty.className = "hidden flex-col items-center text-center gap-2 py-10 px-6 rounded-xl border border-dashed border-purple-200 bg-white";
    empty.setAttribute("role", "status");
    if (cards) cards.parentElement.insertBefore(empty, cards.nextSibling);

    field.addEventListener("input", function () {
      if (field.value.trim().length >= 3) fieldError(field, "");
    });

    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var query = field.value.trim();
        if (query.length < 3) {
          fieldError(field, " Informe o nome do remédio ou princípio ativo (mínimo de 3 letras).");
          field.focus();
          return;
        }
        fieldError(field, "");

        var label = submit ? submit.querySelector("span") : null;
        var original = label ? label.textContent : "";
        if (submit) submit.disabled = true;
        if (label) label.textContent = "Buscando...";

        setTimeout(function () {
          if (typeof window.executarBusca === "function") window.executarBusca();
          var terms = normalize(query);
          var visible = 0;
          if (cards) {
            cards.querySelectorAll("article").forEach(function (article) {
              var match = normalize(article.textContent).indexOf(terms) !== -1;
              article.classList.toggle("hidden", !match);
              if (match) visible += 1;
            });
          }
          if (badge) badge.textContent = visible + (visible === 1 ? " unidade" : " unidades");
          empty.classList.toggle("hidden", visible > 0);
          empty.classList.toggle("flex", visible === 0);
          if (visible === 0) {
            empty.innerHTML = "";
            var icon = document.createElement("span");
            icon.className = "material-symbols-outlined text-[32px] text-[#7B357D]";
            icon.textContent = "search_off";
            var title = document.createElement("p");
            title.className = "font-bold text-[#4A154D]";
            title.textContent = "Nenhuma orientação encontrada para “" + query + "”.";
            var hint = document.createElement("p");
            hint.className = "text-sm text-[#68586E]";
            hint.textContent = "Confira a grafia, busque pelo princípio ativo ou procure a Farmácia Central / Policlínica.";
            empty.appendChild(icon);
            empty.appendChild(title);
            empty.appendChild(hint);
          }
          if (submit) submit.disabled = false;
          if (label) label.textContent = original;
          scheduleMeasure();
          var results = cards || empty;
          if (results) setTimeout(function () { scrollToElement(results.parentElement); }, 50);
        }, 350);
      },
      true,
    );

    var reset = form.querySelector('button[onclick*="limparBusca"]');
    if (reset) {
      reset.addEventListener("click", function () {
        fieldError(field, "");
        empty.classList.add("hidden");
        empty.classList.remove("flex");
        if (cards) cards.querySelectorAll("article").forEach(function (article) { article.classList.remove("hidden"); });
        if (badge) badge.textContent = "3 unidades";
        scheduleMeasure();
      });
    }
  }

  // Farmácia: os filtros rápidos usam acentos ("Hipertensão") e os dados não ("hipertensao")
  function setupMedicineTable() {
    if (!document.getElementById("medicines-table") || typeof window.filterMedicineTable !== "function") return;
    window.filterMedicineTable = function () {
      var query = normalize(document.getElementById("filter-med").value);
      var district = document.getElementById("filter-district").value;
      var rows = document.querySelectorAll("#medicines-table tbody tr");
      var visible = 0;
      rows.forEach(function (row) {
        var text = normalize((row.getAttribute("data-med") || "") + " " + row.textContent);
        var districts = row.getAttribute("data-district") || "";
        var match = (query === "" || text.indexOf(query) !== -1) && (district === "todos" || districts.indexOf(district) !== -1);
        row.style.display = match ? "" : "none";
        if (match) visible += 1;
      });
      var emptyState = document.getElementById("empty-state");
      var count = document.getElementById("results-count");
      if (emptyState) {
        emptyState.classList.toggle("hidden", visible !== 0);
        emptyState.classList.toggle("flex", visible === 0);
      }
      if (count) {
        count.textContent =
          visible === 0 ? "Nenhum resultado" : visible + " registro" + (visible > 1 ? "s" : "") + " mostrado" + (visible > 1 ? "s" : "");
      }
      scheduleMeasure();
    };
  }

  // Postos de Saúde: busca sem diferenciar acentos
  function setupUnitsForm() {
    var form = document.getElementById("search-form");
    if (!form || typeof window.filterUnits !== "function") return;
    var input = document.getElementById("input-bairro");
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var query = normalize(input.value);
        var region = document.getElementById("select-regiao").value;
        var cards = document.querySelectorAll(".unit-card");
        var visible = 0;
        cards.forEach(function (card) {
          var text = normalize((card.getAttribute("data-name") || "") + " " + card.textContent);
          var match = (query === "" || text.indexOf(query) !== -1) && (region === "todos" || card.getAttribute("data-region") === region);
          card.classList.toggle("hidden", !match);
          if (match) visible += 1;
        });
        var count = document.getElementById("results-count");
        if (count) count.textContent = visible + " encontrada" + (visible !== 1 ? "s" : "");
        var emptyState = document.getElementById("empty-state");
        if (emptyState) emptyState.classList.toggle("hidden", visible !== 0);
        scheduleMeasure();
      },
      true,
    );
  }

  /* ------------------------------------------------------------ */
  /* Inicialização                                                 */
  /* ------------------------------------------------------------ */

  function init() {
    removeChrome();
    applyVisibility();
    setupHomeSearch();
    setupMedicineForm();
    setupMedicineTable();
    setupUnitsForm();
    setupVaccineToggle();
    setupRoxoSearch();

    if ("ResizeObserver" in window) new ResizeObserver(scheduleMeasure).observe(document.body);
    new MutationObserver(scheduleMeasure).observe(document.body, { attributes: true, childList: true, subtree: true });
    window.addEventListener("load", scheduleMeasure);
    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("load", scheduleMeasure);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleMeasure);

    measure();
    send({ type: "ready" });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
