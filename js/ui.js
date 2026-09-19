"use strict";

const UI = (() => {
  // 数据进入 HTML 文本或属性之前，统一转义。
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function filterButton(key, value, label, selected, extraClass = "") {
    return `<button type="button" class="filter-button ${escapeHTML(extraClass)}"
      data-filter="${escapeHTML(key)}" data-value="${escapeHTML(value)}"
      aria-pressed="${selected === value}">${escapeHTML(label)}</button>`;
  }

  function renderFilters() {
    const selected = Store.getFilters();
    // 保留面板节点及其监听器，重新渲染后放回颜色行。
    const panel = document.getElementById("color-panel");

    function valuesFor(dimension, getValues) {
      // 忽略当前维度，其他条件使用 Store 的统一规则（含近似色差）。
      const values = Store.getFiltered(dimension).flatMap(getValues);
      // 即使没有匹配结果，也保留已选项，供用户查看和取消。
      if (selected[dimension]) values.push(selected[dimension]);
      const normalized = dimension === "color"
        ? values.map((value) => Store.normalizeHex(value) || value.toUpperCase()) : values;
      return [...new Set(normalized)].sort((a, b) => a.localeCompare(b, "zh-CN"));
    }

    const options = {
      types: [...new Set([...CONFIG.types, selected.type].filter(Boolean))],
      categories: valuesFor("category", (item) => [item.category]),
      tags: valuesFor("tag", (item) => Store.normalizeTags(item.tags)),
      colors: valuesFor("color", (item) => item.colors),
      models: valuesFor("model", (item) => [item.model])
    };
    document.getElementById("type-filters").innerHTML = `<span class="filter-label">类型</span>
      <div class="filter-options"><div class="filter-scroll">${options.types.map((type) =>
        filterButton("type", type, CONFIG.typeLabels[type] || type, selected.type)).join("")}</div></div>`;

    const groups = [
      ["category", "分类", options.categories],
      ["tag", "标签", options.tags],
      ["color", "颜色", options.colors],
      ["model", "模型", options.models]
    ];
    document.getElementById("filters").innerHTML = groups.map(([key, label, values]) => {
      const buttons = values.map((value) => {
        if (key !== "color") return filterButton(key, value, value, selected[key]);
        // SVG 颜色先校验并规范化，禁止任意属性或样式注入。
        const color = Store.normalizeHex(value) || "#808080";
        const selectedColor = Store.normalizeHex(selected.color) || selected.color.toUpperCase();
        return `<button type="button" class="filter-button color-option"
          data-filter="color" data-value="${escapeHTML(value)}"
          aria-pressed="${selectedColor === value.toUpperCase()}">
          <svg class="color-swatch" viewBox="0 0 16 16" aria-hidden="true">
            <rect width="16" height="16" fill="${escapeHTML(color)}"/>
          </svg>${escapeHTML(value)}</button>`;
      }).join("");
      const currentColor = Store.normalizeHex(selected.color);
      const customButton = key === "color" ? `<button id="custom-color-toggle" type="button"
        class="filter-button color-option" aria-expanded="${!panel.hidden}" aria-controls="color-panel">
        <svg class="color-swatch" viewBox="0 0 16 16" aria-hidden="true" ${currentColor ? "" : "hidden"}>
          <rect width="16" height="16" fill="${escapeHTML(currentColor || "#808080")}"/>
        </svg>自定义颜色</button>` : "";
      return `<div ${key === "color" ? 'id="color-filter-row"' : ""}
        class="filter-row" role="group" aria-label="${escapeHTML(label)}">
        <span class="filter-label">${escapeHTML(label)}</span>
        <div class="filter-options"><div class="filter-scroll">${filterButton(key, "", "全部", selected[key])}${buttons}${customButton}</div></div></div>`;
    }).join("");
    document.getElementById("filters").insertAdjacentHTML("beforeend",
      `<div class="filter-row favorite-filter-row" role="group" aria-label="收藏">
        <span class="filter-label">收藏</span>
        <div class="filter-options"><div class="filter-scroll">
          ${filterButton("favorite", "1", "只看收藏", selected.favorite)}
        </div></div>
      </div>`);
    document.getElementById("color-filter-row").append(panel);
    updateFilterOverflowHints();
  }

  function updateFilterOverflowHints() {
    document.querySelectorAll(".filter-options").forEach((wrapper) => {
      const scrollArea = wrapper.querySelector(".filter-scroll");
      const hasOverflow = Boolean(scrollArea && scrollArea.scrollWidth > scrollArea.clientWidth + 1);
      wrapper.classList.toggle("has-overflow", hasOverflow);
    });
  }

  function renderColorPresets() {
    // 12 组色相各深浅两档，共 24 色；另加黑、白、灰。
    const presets = [
      ["深红", "#B91C1C"], ["浅红", "#FCA5A5"],
      ["深橙", "#C2410C"], ["浅橙", "#FDBA74"],
      ["深黄", "#A16207"], ["浅黄", "#FDE047"],
      ["深黄绿", "#4D7C0F"], ["浅黄绿", "#BEF264"],
      ["深绿", "#15803D"], ["浅绿", "#86EFAC"],
      ["深碧绿", "#047857"], ["浅碧绿", "#6EE7B7"],
      ["深青", "#0E7490"], ["浅青", "#67E8F9"],
      ["深蓝", "#1D4ED8"], ["浅蓝", "#93C5FD"],
      ["深靛", "#4338CA"], ["浅靛", "#A5B4FC"],
      ["深紫", "#7E22CE"], ["浅紫", "#D8B4FE"],
      ["深粉", "#BE185D"], ["浅粉", "#F9A8D4"],
      ["深棕", "#78350F"], ["浅棕", "#D6A77A"],
      ["黑", "#000000"], ["白", "#FFFFFF"], ["灰", "#808080"]
    ];
    document.getElementById("color-presets").innerHTML = presets.map(([label, color]) =>
      `<button class="color-preset" type="button" data-color-preset="${escapeHTML(color)}"
        aria-label="${escapeHTML(label + " " + color)}" aria-pressed="false" title="${escapeHTML(label)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="${escapeHTML(color)}"/></svg>
      </button>`).join("");
  }

  function updateColorDraft(value) {
    const hex = Store.normalizeHex(value);
    const input = document.getElementById("color-hex");
    input.setAttribute("aria-invalid", String(!hex));
    document.getElementById("color-error").hidden = Boolean(hex);
    document.getElementById("color-apply").disabled = !hex;
    document.getElementById("color-preview-fill").setAttribute("fill", hex || "none");
    document.getElementById("color-preview-value").textContent = hex || "等待有效颜色";
    if (hex) document.getElementById("color-native").value = hex.toLowerCase();
    document.querySelectorAll("[data-color-preset]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.colorPreset === hex));
    });
    return hex;
  }

  function updateColorFeedback() {
    const selectedColor = Store.getFilters().color;
    const items = new Map(Store.getData().map((item) => [item.id, item]));
    document.querySelectorAll("#cards-grid .card[data-id]").forEach((card) => {
      const item = items.get(card.dataset.id);
      const muted = Boolean(selectedColor) && (!item || !Store.matchesColor(item.colors, selectedColor));
      // 每次都重新计算、增减 class，避免清空或切换条件后残留。
      card.classList.toggle("card-color-muted", muted);
      card.inert = muted;
      if (muted) card.setAttribute("aria-disabled", "true");
      else card.removeAttribute("aria-disabled");
    });
  }

  const starPath = "M12 2.8l2.8 5.7 6.3.9-4.55 4.43 1.08 6.25L12 17.1l-5.63 2.98 1.08-6.25L1.82 9.4l6.3-.9Z";

  function favoriteIcon(favorite) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="${starPath}" fill="${favorite ? "currentColor" : "none"}"
        stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  function favoriteButtonHTML(item) {
    const favorite = Favorites.isFavorite(item.id);
    const label = favorite ? `取消收藏：《${item.title}》` : `收藏：《${item.title}》`;
    return `<button class="favorite-button" type="button" data-favorite="${escapeHTML(item.id)}"
      data-title="${escapeHTML(item.title)}" aria-pressed="${String(favorite)}"
      aria-label="${escapeHTML(label)}">${favoriteIcon(favorite)}</button>`;
  }

  function updateFavoriteButton(button, id, favorite = Favorites.isFavorite(id)) {
    if (!button) return;
    const title = button.dataset.title || "";
    button.setAttribute("aria-pressed", String(favorite));
    button.setAttribute("aria-label",
      favorite ? `取消收藏：《${title}》` : `收藏：《${title}》`);
    button.innerHTML = favoriteIcon(favorite);
  }

  function toggleFavorite(id, button) {
    const favorite = Favorites.toggle(id).includes(id);
    updateFavoriteButton(button, id, favorite);
    if (button) {
      button.classList.remove("favorite-button-feedback");
      void button.offsetWidth;
      button.classList.add("favorite-button-feedback");
      window.setTimeout(() => button.classList.remove("favorite-button-feedback"), 280);
    }
    const status = document.getElementById("favorite-status");
    if (status) {
      status.textContent = "";
      window.setTimeout(() => {
        status.textContent = favorite ? "已收藏" : "已取消收藏";
      }, 0);
    }
    return favorite;
  }

  function handleCardImageError(event) {
    const image = event.target;
    if (!image || image.tagName !== "IMG" || image.dataset.coverFallback === "true") return;
    const card = image.closest("#cards-grid .card[data-id]");
    if (!card) return;
    const item = Store.getData().find((entry) => entry.id === card.dataset.id) || {};
    image.dataset.coverFallback = "true";
    image.src = getCoverPlaceholder(item);
    image.alt = `${String(item.title || "提示词")}的配色占位封面`;
    const label = card.querySelector(".cover-label");
    if (label) label.hidden = false;
  }

  function cardHTML(item) {
    const placeholder = getCoverPlaceholder(item);
    const hasCover = typeof item.cover === "string" && item.cover.trim() !== "";
    const cover = hasCover ? item.cover : placeholder;
    return `<article class="card" data-id="${escapeHTML(item.id)}" tabindex="0" role="button"
      aria-label="${escapeHTML("查看详情：" + item.title)}" aria-haspopup="dialog">
      <div class="card-cover">
        <img src="${escapeHTML(cover)}" data-cover="${escapeHTML(item.cover)}"
          data-cover-fallback="${String(!hasCover)}" alt="${escapeHTML(item.title)}的配色封面"
          loading="lazy" width="640" height="480">
        ${favoriteButtonHTML(item)}
        <span class="cover-label"${hasCover ? " hidden" : ""}>封面待添加</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span>${escapeHTML(CONFIG.typeLabels[item.type] || item.type)}</span>
          <span>${escapeHTML(item.category)}</span><span>${escapeHTML(item.model)}</span></div>
        <h3>${escapeHTML(item.title)}</h3>
        <p class="card-description">${escapeHTML(item.promptZh)}</p>
        <div class="tags">${Store.normalizeTags(item.tags).map((tag) =>
          `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>
      </div>
    </article>`;
  }

  function renderCards(items) {
    const grid = document.getElementById("cards-grid");
    grid.setAttribute("aria-busy", "false");
    if (!items.length) {
      const favoriteIds = new Set(Favorites.getAll());
      const favoriteEmpty = Store.getFilters().favorite === "1"
        && !Store.getData().some((item) => favoriteIds.has(item.id));
      renderEmpty(favoriteEmpty
        ? "还没有收藏任何提示词，请先收藏一些提示词。"
        : "没有找到匹配的提示词，请调整或清空筛选。");
      return;
    }
    grid.innerHTML = items.map(cardHTML).join("");
  }

  function appendCards(items) {
    const grid = document.getElementById("cards-grid");
    grid.setAttribute("aria-busy", "false");
    grid.insertAdjacentHTML("beforeend", items.map(cardHTML).join(""));
  }

  function renderSkeleton(count = CONFIG.pageSize) {
    const grid = document.getElementById("cards-grid");
    grid.setAttribute("aria-busy", "true");
    const safeCount = Number.isInteger(count) ? Math.max(0, Math.min(count, 100)) : CONFIG.pageSize;
    grid.innerHTML = Array.from({ length: safeCount }, () =>
      `<div class="card skeleton" aria-hidden="true">
        <div class="card-cover skeleton-block"></div>
        <div class="card-body">
          <div class="skeleton-line skeleton-meta skeleton-block"></div>
          <div class="skeleton-line skeleton-title skeleton-block"></div>
          <div class="skeleton-line skeleton-title-short skeleton-block"></div>
          <div class="skeleton-line skeleton-description skeleton-block"></div>
          <div class="skeleton-line skeleton-description skeleton-block"></div>
          <div class="skeleton-line skeleton-description-short skeleton-block"></div>
          <div class="skeleton-tags"><span class="skeleton-tag skeleton-block"></span>
            <span class="skeleton-tag skeleton-block"></span></div>
        </div>
      </div>`).join("");
    document.getElementById("result-count").textContent = "正在加载…";
  }

  function renderEmpty(message = "没有找到匹配的提示词，请调整或清空筛选。") {
    const grid = document.getElementById("cards-grid");
    grid.setAttribute("aria-busy", "false");
    grid.innerHTML = `<div class="empty-state">${escapeHTML(message)}</div>`;
  }

  function updateResultCount(n, distributionTotal = n) {
    document.getElementById("result-count").textContent = Store.getFilters().color
      ? `颜色匹配 ${Number(n) || 0} / ${Number(distributionTotal) || 0} 条提示词`
      : `共 ${Number(n) || 0} 条提示词`;
  }

  // 浏览器通常会自动保证焦点按钮可见；这里补一层兼容，避免滚动容器只滚页面不滚自身。
  document.addEventListener("focusin", (event) => {
    const button = event.target.closest?.(".filter-scroll .filter-button");
    if (!button) return;
    const scrollArea = button.parentElement;
    if (scrollArea && scrollArea.scrollWidth > scrollArea.clientWidth) {
      button.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  });
  window.addEventListener("resize", updateFilterOverflowHints);
  const cardsGrid = document.getElementById("cards-grid");
  if (cardsGrid) cardsGrid.addEventListener("error", handleCardImageError, true);

  return Object.freeze({
    renderFilters, renderCards, appendCards, renderSkeleton, renderEmpty, updateResultCount,
    renderColorPresets, updateColorDraft, updateColorFeedback, toggleFavorite,
    updateFavoriteButton, getPlaceholder: getCoverPlaceholder
  });
})();
