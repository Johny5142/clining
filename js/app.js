/* ============================================================================
   ДВИЖОК САЙТА — читает js/config.js и оживляет все страницы.
   Обычно этот файл редактировать не нужно — всё меняется в config.js.
============================================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const CFG = window.SITE_CONFIG;
  if (!CFG) return;

  /* --- Утилиты ------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const get = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

  const money = (n) =>
    Math.round(n).toLocaleString("ru-RU") + " " + (CFG.calculator.currency || "₽");

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const icon = (name) => ICONS[name] || ICONS.sparkles;

  /* --- Набор иконок (inline SVG) ------------------------------------------ */
  const S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const ICONS = {
    sparkles: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11 2l2.2 5.8L19 10l-5.8 2.2L11 18l-2.2-5.8L3 10l5.8-2.2z"/><path d="M19 13l1.1 2.9L23 17l-2.9 1.1L19 21l-1.1-2.9L15 17l2.9-1.1z"/></svg>`,
    home: `<svg ${S}><path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5"/><path d="M10 21v-6h4v6"/></svg>`,
    roller: `<svg ${S}><rect x="2.5" y="3" width="14" height="6" rx="2"/><path d="M16.5 5h2.5A2.5 2.5 0 0 1 21.5 7.5v2A2.5 2.5 0 0 1 19 12h-8.5"/><path d="M10.5 12v3"/><rect x="8.5" y="15" width="4" height="6" rx="1.5"/></svg>`,
    building: `<svg ${S}><rect x="4.5" y="3" width="15" height="18" rx="2"/><path d="M9 7.5h1.5M13.5 7.5H15M9 11.5h1.5M13.5 11.5H15M9 15.5h1.5M13.5 15.5H15"/><path d="M10.5 21v-2.5h3V21"/></svg>`,
    window: `<svg ${S}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 4v16M4 12h16"/></svg>`,
    sofa: `<svg ${S}><path d="M6.5 10.5V8a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v2.5"/><path d="M3 14a2.25 2.25 0 0 1 4.5 0v2h9v-2a2.25 2.25 0 0 1 4.5 0v4.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 18.5z"/><path d="M6 21v-1M18 21v-1"/></svg>`,
    shield: `<svg ${S}><path d="M12 3l7 2.8v5.1c0 4.6-3 7.6-7 9.1-4-1.5-7-4.5-7-9.1V5.8z"/><path d="M9.3 11.6l2 2 3.6-3.6"/></svg>`,
    leaf: `<svg ${S}><path d="M5.5 20.5C4 12.5 9 5.5 20 4.5c.8 9.6-4.7 14.8-12 15.2"/><path d="M5.5 20.5C7.5 14 11 10.5 16 8"/></svg>`,
    check: `<svg ${S}><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.8-4.8"/></svg>`,
    checkSimple: `<svg ${S}><path d="M4.5 12.5l5 5L20 7"/></svg>`,
    wallet: `<svg ${S}><path d="M17 7V5.5A1.5 1.5 0 0 0 15.5 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><circle cx="16.5" cy="14" r="1.2" fill="currentColor" stroke="none"/></svg>`,
    phone: `<svg ${S}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2.1z"/></svg>`,
    calendar: `<svg ${S}><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10.5h17"/></svg>`,
    mail: `<svg ${S}><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7.5L12 13l8.5-5.5"/></svg>`,
    pin: `<svg ${S}><path d="M12 21.5s-7-5.8-7-11.2A7 7 0 0 1 19 10.3c0 5.4-7 11.2-7 11.2z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
    clock: `<svg ${S}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3L2.8 9.5l6.4-.9z"/></svg>`,
    arrowRight: `<svg ${S}><path d="M4.5 12h15M13.5 6l6 6-6 6"/></svg>`,
    chevronLeft: `<svg ${S}><path d="M15 5l-7 7 7 7"/></svg>`,
    chevronRight: `<svg ${S}><path d="M9 5l7 7-7 7"/></svg>`,
    compare: `<svg ${S}><path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/></svg>`,
    send: `<svg ${S}><path d="M21.5 2.5L11 13M21.5 2.5l-7 19-3.5-8.5L2.5 9.5z"/></svg>`,
    info: `<svg ${S}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 11.5V16"/></svg>`,
    telegram: `<svg ${S}><path d="M21 4L3 11l6 2.5L11.5 20l3-4.5L21 4z"/><path d="M9 13.5L21 4"/></svg>`,
    whatsapp: `<svg ${S}><path d="M21 12a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.2-4.6A8.5 8.5 0 1 1 21 12z"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 6.3L20.8 11l-6.4 2.7L12 20l-2.4-6.3L3.2 11l6.4-2.7z"/></svg>`,
    brush: `<svg ${S}><rect x="3" y="3" width="18" height="8" rx="2"/><path d="M12 11v4"/><rect x="10" y="15" width="4" height="6" rx="1.5"/></svg>`
  };

  /* --- 1. Тема (цвета из конфига) ------------------------------------------ */
  (function applyTheme() {
    const t = CFG.theme || {};
    const root = document.documentElement;
    if (t.primary) root.style.setProperty("--primary", t.primary);
    if (t.accent) root.style.setProperty("--accent", t.accent);
  })();

  /* --- 2. Подстановка значений конфига в HTML (data-config="...") ---------- */
  (function applyConfigTexts() {
    $$("[data-config]").forEach((el) => {
      const path = el.dataset.config;
      let val;
      if (path === "__year__") val = new Date().getFullYear();
      else val = get(CFG, path);
      if (val == null) return;
      const attr = el.dataset.configAttr;
      if (attr) el.setAttribute(attr, val);
      else el.textContent = val;
    });

    // Логотип-картинка вместо значка (если задан brand.logoImage)
    if (CFG.brand.logoImage) {
      $$(".logo-mark").forEach((el) => {
        el.innerHTML = `<img src="${esc(CFG.brand.logoImage)}" alt="${esc(CFG.brand.name)}">`;
      });
    }
  })();

  /* --- 3. SEO-заголовки страниц --------------------------------------------- */
  (function applySeo() {
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const page = (CFG.seo && CFG.seo.pages && CFG.seo.pages[file]) || null;
    if (!page) return;
    if (page.title) document.title = page.title;
    if (page.description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", page.description);
    }
  })();

  /* --- 4. Активный пункт меню ------------------------------------------------ */
  (function markActiveNav() {
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav-link").forEach((link) => {
      const href = (link.getAttribute("href") || "").toLowerCase();
      if (href === file || (file === "" && href === "index.html")) link.classList.add("active");
    });
  })();

  /* --- 5. Мобильное меню ------------------------------------------------------ */
  (function initBurger() {
    const header = $(".header");
    const burger = $("[data-burger]");
    if (!header || !burger) return;
    burger.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-link").forEach((l) =>
      l.addEventListener("click", () => header.classList.remove("nav-open"))
    );
    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) header.classList.remove("nav-open");
    });
  })();

  /* --- 6. Тень шапки при прокрутке -------------------------------------------- */
  (function initHeaderScroll() {
    const header = $(".header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* --- 7. Рендер блоков из конфига --------------------------------------------- */

  // Цифры на главном экране
  (function renderStats() {
    const mount = $('[data-mount="stats"]');
    if (!mount || !CFG.hero.stats) return;
    mount.innerHTML = CFG.hero.stats
      .map(
        (s) => `<div class="stat"><div class="stat-value">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`
      )
      .join("");
  })();

  // Преимущества
  (function renderAdvantages() {
    const mount = $('[data-mount="advantages"]');
    if (!mount || !CFG.advantages) return;
    mount.innerHTML = CFG.advantages
      .map(
        (a) => `
        <div class="card adv-card reveal">
          <div class="adv-icon">${icon(a.icon)}</div>
          <h3 class="adv-title">${esc(a.title)}</h3>
          <p class="adv-text">${esc(a.text)}</p>
        </div>`
      )
      .join("");
  })();

  // Карточки услуг (главная и подвал)
  (function renderServiceCards() {
    const mount = $('[data-mount="services"]');
    if (!mount) return;
    const count = +mount.dataset.count || CFG.services.length;
    mount.innerHTML = CFG.services.slice(0, count)
      .map(
        (s) => `
        <article class="card service-card reveal">
          <div class="service-top">
            <div class="service-icon">${icon(s.icon)}</div>
            <span class="chip">${esc(s.price)}</span>
          </div>
          <h3 class="service-name">${esc(s.name)}</h3>
          <p class="service-text">${esc(s.short)}</p>
          <div class="service-meta"><span class="chip chip-neutral">${esc(s.time)}</span></div>
          <a class="service-more" href="services.html#${esc(s.id)}">Подробнее ${ICONS.arrowRight}</a>
        </article>`
      )
      .join("");
  })();

  // Подробные услуги (страница «Услуги»)
  (function renderServicesDetailed() {
    const mount = $('[data-mount="services-detailed"]');
    if (!mount) return;
    mount.innerHTML = CFG.services
      .map(
        (s) => `
        <article class="card service-detail reveal" id="${esc(s.id)}">
          <div class="sd-side">
            <div class="sd-icon">${icon(s.icon)}</div>
            <h2 class="sd-name">${esc(s.name)}</h2>
            <p class="sd-desc">${esc(s.desc)}</p>
            <div class="sd-tags">
              <span class="chip">${esc(s.price)}</span>
              <span class="chip chip-neutral">${esc(s.time)}</span>
            </div>
          </div>
          <div>
            <ul class="sd-includes">
              ${(s.includes || [])
                .map((i) => `<li class="include-item">${ICONS.checkSimple}<span>${esc(i)}</span></li>`)
                .join("")}
            </ul>
            <div class="sd-cta">
              <a class="btn btn-primary" href="contacts.html?service=${esc(s.id)}">Заказать уборку</a>
              <span class="hint">Перезвоним в течение 15 минут</span>
            </div>
          </div>
        </article>`
      )
      .join("");

    // Прокрутка к якорю (#general и т.п.) после того, как карточки созданы JS-ом
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        setTimeout(() => target.scrollIntoView({ block: "start" }), 150);
      }
    }
  })();

  // Шаги работы
  (function renderSteps() {
    const mount = $('[data-mount="steps"]');
    if (!mount || !CFG.steps) return;
    mount.innerHTML = CFG.steps
      .map(
        (st, i) => `
        <div class="step reveal">
          <div class="step-num">${String(i + 1).padStart(2, "0")}</div>
          <div class="step-icon">${icon(st.icon)}</div>
          <h3 class="step-name">${esc(st.title)}</h3>
          <p class="step-text">${esc(st.text)}</p>
        </div>`
      )
      .join("");
  })();

  // Отзывы
  (function renderReviews() {
    const mount = $('[data-mount="reviews"]');
    if (!mount || !CFG.reviews) return;
    mount.innerHTML = CFG.reviews
      .map((r) => {
        const initials = r.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
        const stars = Array.from({ length: 5 }, (_, i) =>
          `<span class="${i < r.rating ? "star" : "star star-empty"}">${ICONS.star}</span>`
        ).join("");
        return `
        <article class="card review-card reveal">
          <div class="review-head">
            <div class="review-avatar">${esc(initials)}</div>
            <div>
              <div class="review-name">${esc(r.name)}</div>
              <div class="review-meta">${esc(r.date)}</div>
            </div>
            <div class="stars" aria-label="Оценка ${r.rating} из 5">${stars}</div>
          </div>
          <p class="review-text">${esc(r.text)}</p>
          <div class="review-service"><span class="chip chip-neutral">${esc(r.service)}</span></div>
        </article>`;
      })
      .join("");
  })();

  // Слайдер отзывов
  (function initReviewsSlider() {
    const track = $("[data-reviews-track]");
    const prev = $("[data-reviews-prev]");
    const next = $("[data-reviews-next]");
    if (!track || !prev || !next) return;
    const step = () => {
      const card = track.querySelector(".review-card");
      return card ? card.getBoundingClientRect().width + 20 : 360;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  })();

  // Таблица цен
  (function renderPriceTable() {
    const mount = $('[data-mount="price-table"]');
    if (!mount) return;
    mount.innerHTML = CFG.services
      .map(
        (s) => `
        <tr>
          <td>${esc(s.name)}</td>
          <td class="td-muted">${esc(s.short)}</td>
          <td class="td-muted">${esc(s.time)}</td>
          <td class="td-price">${esc(s.price)}</td>
        </tr>`
      )
      .join("");
  })();

  // Списки услуг в калькуляторе и в форме
  (function renderCalcOptions() {
    const typesMount = $('[data-mount="calc-types"]');
    if (typesMount && CFG.calculator.types) {
      typesMount.innerHTML = CFG.calculator.types
        .map(
          (t, i) => `
          <label class="calc-type">
            <input type="radio" name="calcType" value="${esc(t.id)}" ${i === 0 ? "checked" : ""}>
            <span class="calc-type-body">
              <span class="ct-name">${esc(t.name)}</span>
              <span class="ct-desc" style="display:block">${esc(t.desc)}</span>
              <span class="ct-price" style="display:block">${esc(t.pricePerM2)} ₽/м² · мин. ${esc(t.minOrder.toLocaleString("ru-RU"))} ₽</span>
            </span>
          </label>`
        )
        .join("");
    }

    const extrasMount = $('[data-mount="calc-extras"]');
    if (extrasMount && CFG.calculator.extras) {
      extrasMount.innerHTML = CFG.calculator.extras
        .map(
          (e) => `
          <label class="calc-extra">
            <input type="checkbox" name="calcExtra" value="${esc(e.id)}">
            <span class="calc-extra-body"><span>${esc(e.name)}</span><span class="calc-extra-price">+${esc(e.price.toLocaleString("ru-RU"))} ₽</span></span>
          </label>`
        )
        .join("");
    }

    const select = $('[data-mount="form-services"]');
    if (select) {
      select.innerHTML =
        `<option value="">Выберите услугу…</option>` +
        CFG.services
          .map((s) => `<option value="${esc(s.id)}">${esc(s.name)} — ${esc(s.price)}</option>`)
          .join("");
    }
  })();

  // Галерея «До / После»
  (function renderBeforeAfter() {
    const mount = $('[data-mount="ba-list"]');
    if (!mount) return;
    mount.innerHTML = (CFG.gallery.beforeAfter || [])
      .map(
        (item) => `
        <div class="ba-item reveal">
          <div class="ba-title-row">
            <h3 class="ba-title">${esc(item.title)}</h3>
            <span class="ba-subtitle">${esc(item.subtitle)}</span>
          </div>
          <div class="ba-slider" data-ba style="--pos:50%">
            <img class="ba-img" src="${esc(item.after)}" alt="${esc(item.title)} — после уборки" draggable="false">
            <img class="ba-img ba-top" src="${esc(item.before)}" alt="${esc(item.title)} — до уборки" draggable="false">
            <span class="ba-label ba-label-before">До</span>
            <span class="ba-label ba-label-after">После</span>
            <div class="ba-handle">
              <button class="ba-grip" type="button" aria-label="Потяните, чтобы сравнить до и после" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">${ICONS.compare}</button>
            </div>
          </div>
        </div>`
      )
      .join("");
  })();

  // Сетка фотографий
  (function renderPhotoGrid() {
    const mount = $('[data-mount="photo-grid"]');
    if (!mount) return;
    mount.innerHTML = (CFG.gallery.photos || [])
      .map(
        (p) => `
        <figure class="photo-card reveal">
          <img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy">
          <figcaption class="photo-caption">${esc(p.caption)}</figcaption>
        </figure>`
      )
      .join("");
  })();

  // Ссылки на услуги в подвале
  (function renderFooterServices() {
    const mount = $('[data-mount="footer-services"]');
    if (!mount) return;
    mount.innerHTML = CFG.services
      .map((s) => `<li><a href="services.html#${esc(s.id)}">${esc(s.name)}</a></li>`)
      .join("");
  })();

  /* --- 8. Калькулятор стоимости -------------------------------------------------- */
  (function initCalculator() {
    const root = $("[data-calc]");
    if (!root) return;
    const calc = CFG.calculator;

    const areaRange = $("[data-calc-area]", root);
    const areaNum = $("[data-calc-area-num]", root);
    const areaDisplay = $("[data-calc-area-display]", root);
    const discountInput = $("[data-calc-discount]", root);
    const discountLabel = $("[data-calc-discount-label]", root);
    const submitBtn = $("[data-calc-submit]", root);

    const rows = {
      base: $("[data-result-base]"),
      extras: $("[data-result-extras-row]"),
      discount: $("[data-result-discount-row]"),
      total: $("[data-result-total]"),
      note: $("[data-result-note]")
    };

    if (discountLabel && calc.discount.label) discountLabel.textContent = calc.discount.label;

    function currentType() {
      const checked = root.querySelector('input[name="calcType"]:checked');
      return calc.types.find((t) => t.id === (checked && checked.value)) || calc.types[0];
    }

    function clampArea(v) {
      return Math.min(calc.maxArea, Math.max(calc.minArea, v || calc.defaultArea));
    }

    function updateFill() {
      const pct = ((+areaRange.value - calc.minArea) / (calc.maxArea - calc.minArea)) * 100;
      areaRange.style.setProperty("--fill", pct + "%");
    }

    function selectedExtras() {
      return $$('input[name="calcExtra"]:checked', root)
        .map((ch) => calc.extras.find((e) => e.id === ch.value))
        .filter(Boolean);
    }

    function recalc() {
      const type = currentType();
      const area = clampArea(+areaRange.value);
      areaNum.value = area;
      if (areaDisplay) areaDisplay.textContent = area + " м²";

      let base = area * type.pricePerM2;
      const minApplied = base < type.minOrder;
      if (minApplied) base = type.minOrder;

      const extras = selectedExtras();
      const extrasSum = extras.reduce((sum, e) => sum + e.price, 0);

      const disc = calc.discount.enabled && discountInput.checked ? calc.discount.percent : 0;
      const total = Math.round((base + extrasSum) * (1 - disc / 100));

      rows.base.innerHTML =
        `<span>Уборка: ${esc(type.name)}, ${area} м²${minApplied ? " <em class=\"result-muted\">(минимальный заказ)</em>" : ""}</span>` +
        `<span class="result-value">${money(base)}</span>`;

      rows.extras.style.display = extras.length ? "" : "none";
      rows.extras.innerHTML =
        `<span>Доп. опции: ${extras.map((e) => esc(e.name)).join(", ")}</span>` +
        `<span class="result-value">${money(extrasSum)}</span>`;

      rows.discount.style.display = disc ? "" : "none";
      rows.discount.innerHTML = `<span>Скидка за регулярность</span><span class="result-value">−${disc}%</span>`;

      rows.total.textContent = money(total);
      rows.note.textContent = minApplied
        ? `Для «${type.name}» действует минимальная стоимость заказа ${money(type.minOrder)}.`
        : `Точная стоимость подтверждается перед началом работы и не меняется в процессе.`;

      updateFill();
    }

    areaRange.addEventListener("input", recalc);
    areaNum.addEventListener("input", () => {
      areaRange.value = clampArea(+areaNum.value || calc.minArea);
      recalc();
    });
    root.addEventListener("change", recalc);

    // Кнопка «Оставить заявку» — сохранить расчёт и перейти к форме
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const type = currentType();
        const area = clampArea(+areaRange.value);
        const extras = selectedExtras();
        const disc = calc.discount.enabled && discountInput.checked ? calc.discount.percent : 0;
        const totalText = $("[data-result-total]").textContent;

        const summary =
          `Расчёт с сайта: ${type.name} уборка, площадь ${area} м²` +
          (extras.length ? `, доп. опции: ${extras.map((e) => e.name).join(", ")}` : "") +
          (disc ? `, скидка ${disc}%` : "") +
          `. Итого ≈ ${totalText}.`;

        localStorage.setItem(
          "cleaning_calc_request",
          JSON.stringify({ serviceId: type.id, text: summary })
        );
      });
    }

    recalc();
  })();

  /* --- 9. Слайдеры «До / После» ---------------------------------------------------- */
  (function initCompareSliders() {
    $$(".ba-slider").forEach((el) => {
      const grip = $(".ba-grip", el);
      let dragging = false;

      const setPos = (clientX) => {
        const rect = el.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        const clamped = Math.min(100, Math.max(0, pct));
        el.style.setProperty("--pos", clamped + "%");
        if (grip) {
          grip.setAttribute("aria-valuenow", String(Math.round(clamped)));
        }
      };

      const start = (e) => {
        dragging = true;
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        setPos(e.clientX);
      };
      const move = (e) => { if (dragging) setPos(e.clientX); };
      const stop = () => { dragging = false; };

      el.addEventListener("pointerdown", start);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", stop);
      el.addEventListener("pointercancel", stop);

      // Клавиатура: стрелки на ручке
      if (grip) {
        grip.addEventListener("keydown", (e) => {
          const stepSize = e.shiftKey ? 10 : 2;
          const current = parseFloat(getComputedStyle(el).getPropertyValue("--pos")) || 50;
          let next = current;
          if (e.key === "ArrowLeft") next = current - stepSize;
          else if (e.key === "ArrowRight") next = current + stepSize;
          else return;
          e.preventDefault();
          next = Math.min(100, Math.max(0, next));
          el.style.setProperty("--pos", next + "%");
          grip.setAttribute("aria-valuenow", String(Math.round(next)));
        });
      }
    });
  })();

  /* --- 10. Форма заявки -------------------------------------------------------------- */
  (function initForm() {
    const form = $("[data-form]");
    if (!form) return;

    const phoneInput = form.querySelector('input[type="tel"]');
    const dateInput = form.querySelector('input[type="date"]');
    const statusBox = $("[data-form-status]");
    const successBox = $("[data-form-success]");

    // Минимальная дата — сегодня
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
    }

    // Маска телефона +7 (___) ___-__-__
    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        let d = phoneInput.value.replace(/\D/g, "");
        if (d.length === 0) { phoneInput.value = ""; return; }
        if (d[0] === "8") d = "7" + d.slice(1);
        else if (d[0] !== "7") d = "7" + d;
        d = d.slice(0, 11);
        let out = "+7";
        if (d.length > 1) out += " (" + d.slice(1, 4);
        if (d.length >= 5) out += ") " + d.slice(4, 7);
        if (d.length >= 8) out += "-" + d.slice(7, 9);
        if (d.length >= 10) out += "-" + d.slice(9, 11);
        phoneInput.value = out;
      });
    }

    // Предзаполнение из калькулятора (?service=...) или из расчёта
    (function prefill() {
      const select = form.querySelector("select");
      const comment = form.querySelector("textarea");
      const params = new URLSearchParams(location.search);
      const urlService = params.get("service");

      let saved = null;
      try { saved = JSON.parse(localStorage.getItem("cleaning_calc_request") || "null"); } catch (_) {}

      if (saved && select) {
        if (saved.text && comment) comment.value = saved.text;
        if (saved.serviceId && select.querySelector(`option[value="${saved.serviceId}"]`)) {
          select.value = saved.serviceId;
        }
        localStorage.removeItem("cleaning_calc_request");
      } else if (urlService && select && select.querySelector(`option[value="${urlService}"]`)) {
        select.value = urlService;
      }
    })();

    // Ошибки валидации
    function setError(fieldEl, hasError) {
      const field = fieldEl.closest(".field, .form-consent");
      if (field) field.classList.toggle("error", hasError);
    }
    ["input", "change"].forEach((evt) =>
      form.addEventListener(evt, (e) => {
        const t = e.target;
        if (t.matches("input, select, textarea")) setError(t, false);
      })
    );

    function validate() {
      let firstInvalid = null;
      const name = form.querySelector("[data-field-name]");
      const phone = form.querySelector("[data-field-phone]");
      const consent = form.querySelector("[data-field-consent]");

      if (!name.value.trim() || name.value.trim().length < 2) {
        setError(name, true); firstInvalid = firstInvalid || name;
      }
      const digits = phone.value.replace(/\D/g, "");
      if (digits.length !== 11) {
        setError(phone, true); firstInvalid = firstInvalid || phone;
      }
      if (!consent.checked) {
        setError(consent, true); firstInvalid = firstInvalid || consent;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        return false;
      }
      return true;
    }

    function showSuccess() {
      form.hidden = true;
      if (successBox) {
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    if (successBox) {
      const againBtn = successBox.querySelector("[data-form-again]");
      if (againBtn) {
        againBtn.addEventListener("click", () => {
          form.reset();
          form.hidden = false;
          successBox.hidden = true;
          if (statusBox) statusBox.innerHTML = "";
        });
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const serviceSelect = form.querySelector("select");
      const payload = {
        name: form.querySelector("[data-field-name]").value.trim(),
        phone: phoneInput.value,
        service: serviceSelect ? serviceSelect.value : "",
        serviceText: serviceSelect && serviceSelect.selectedOptions[0]
          ? serviceSelect.selectedOptions[0].textContent.trim() : "",
        date: dateInput ? dateInput.value : "",
        comment: form.querySelector("textarea") ? form.querySelector("textarea").value.trim() : "",
        source: document.title
      };

      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = "Отправляем…";

      let ok = true;
      try {
        if (CFG.form.endpoint) {
          const resp = await fetch(CFG.form.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload)
          });
          ok = resp.ok;
        } else {
          // Демо-режим: заявка никуда не отправляется
          await new Promise((r) => setTimeout(r, 700));
          console.log("[Демо-режим] Заявка:", payload);
        }
      } catch (err) {
        ok = false;
      }

      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText;

      if (ok) {
        showSuccess();
      } else if (statusBox) {
        statusBox.innerHTML =
          `<p class="field-msg" style="display:block">Не удалось отправить заявку. Позвоните нам — ${esc(CFG.contact.phone)}</p>`;
      }
    });
  })();

  /* --- 10a. Карта на странице контактов -------------------------------------------- */
  (function initMap() {
    const iframe = $("[data-map-iframe]");
    const placeholder = $("[data-map-placeholder]");
    if (!iframe || !placeholder) return;
    if (!CFG.contact.mapEmbed) {
      iframe.style.display = "none";
      placeholder.hidden = false;
    }
  })();

  /* --- 11. Анимации появления при прокрутке --------------------------------------------- */
  (function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    // Ступенчатая задержка для карточек в одной сетке
    const groups = new Map();
    items.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach((list) =>
      list.forEach((el, i) => { el.style.transitionDelay = Math.min(i * 70, 350) + "ms"; })
    );

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  })();
})();
