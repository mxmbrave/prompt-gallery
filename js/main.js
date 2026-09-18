"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search-input");
  const clearSearchButton = document.getElementById("clear-search");
  const moreButton = document.getElementById("load-more");
  const loadEnd = document.getElementById("load-end");
  const themeButton = document.getElementById("theme-toggle");
  const errorMessage = document.getElementById("load-error");
  const colorPanel = document.getElementById("color-panel");
  const colorHex = document.getElementById("color-hex");
  const colorNative = document.getElementById("color-native");
  const themeKey = "prompt-gallery-theme";
  const urlFilters = [
    ["type", "type"], ["category", "category"], ["tag", "tag"],
    ["color", "color"], ["model", "model"], ["fav", "favorite"], ["q", "query"]
  ];
  let searchTimer;
  let loadMoreTimer;
  let loadingMore = false;
  let ready = false;
  let displayedPages = 1;

  document.title = CONFIG.siteName;
  document.getElementById("site-name").textContent = CONFIG.siteName;

  function updateSearchClear() {
    clearSearchButton.hidden = searchInput.value.length === 0;
  }

  // 不校验参数是否存在于数据中；未知值保留，由筛选返回空结果。
  function restoreFiltersFromURL() {
    const params = new URLSearchParams(location.search);
    Store.clearFilters();
    urlFilters.forEach(([parameter, key]) => {
      const value = params.get(parameter);
      if (value === null || (key === "favorite" && value !== "1")) return;
      Store.setFilter(key, key === "type" ? value || "all" : value);
    });
    searchInput.value = Store.getFilters().query;
    updateSearchClear();
  }

  function syncFiltersToURL() {
    const filters = Store.getFilters();
    const query = urlFilters.flatMap(([parameter, key]) => {
      const value = filters[key];
      // Store 用 all 表示全部类型，网址中省略这个默认值。
      if (!value || (key === "type" && value === "all")) return [];
      return [`${encodeURIComponent(parameter)}=${encodeURIComponent(value)}`];
    }).join("&");
    const url = new URL(location.href);
    url.search = query ? `?${query}` : "";
    if (url.href === location.href) return;
    try {
      history.replaceState(history.state, "", url.href);
    } catch {
      // 部分浏览器限制 file:// 修改历史记录，失败时仍可正常筛选。
    }
  }

  restoreFiltersFromURL();

  function resetLoadMoreButton() {
    clearTimeout(loadMoreTimer);
    loadMoreTimer = undefined;
    loadingMore = false;
    moreButton.disabled = false;
    moreButton.textContent = moreButton.dataset.defaultLabel || "加载更多";
  }

  // 所有数据重新渲染统一从这里进入；追加时只读取下一页。
  function render(append = false, preserveCards = false) {
    if (!ready) return;
    // 数据首次到位后，筛选和分页直接更新卡片，避免本地数据切换时再次闪骨架屏。
    if (!append) resetLoadMoreButton();
    closeColorPanel(false);
    UI.renderFilters();
    // 展示集只应用其他条件；颜色用 class 标识，保留未命中的卡片。
    const page = Store.getPage(preserveCards ? displayedPages : (append ? undefined : 1), {
      ignoreColor: true
    });
    if (!preserveCards) {
      if (append) UI.appendCards(page.items);
      else UI.renderCards(page.items);
    }
    displayedPages = Store.getLoadedPages();
    UI.updateColorFeedback();
    const matchedTotal = Store.getFiltered().length;
    // 分母与分页使用同一集合：忽略颜色，但保留收藏及其他筛选条件。
    const visibleTotal = Store.getFiltered("color").length;
    UI.updateResultCount(matchedTotal, visibleTotal);
    document.getElementById("color-no-results").hidden = !Store.getFilters().color
      || matchedTotal > 0 || visibleTotal === 0;
    moreButton.hidden = !page.hasMore;
    loadEnd.hidden = page.hasMore || visibleTotal === 0;
    updateSearchClear();
    syncFiltersToURL();
  }

  function closeColorPanel(restoreFocus = true) {
    const wasOpen = !colorPanel.hidden;
    colorPanel.hidden = true;
    const toggle = document.getElementById("custom-color-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      if (wasOpen && restoreFocus) toggle.focus();
    }
  }

  function openColorPanel() {
    colorHex.value = Store.getFilters().color || "#FF2D95";
    UI.updateColorDraft(colorHex.value);
    colorPanel.hidden = false;
    document.getElementById("custom-color-toggle").setAttribute("aria-expanded", "true");
    colorHex.focus();
  }

  // 预览只更新面板草稿；应用才改变筛选，取消无需回滚 Store。
  UI.renderColorPresets();
  colorHex.addEventListener("input", () => UI.updateColorDraft(colorHex.value));
  colorNative.addEventListener("input", () => {
    colorHex.value = colorNative.value.toUpperCase();
    UI.updateColorDraft(colorHex.value);
  });
  colorPanel.addEventListener("click", (event) => {
    const preset = event.target.closest("button[data-color-preset]");
    if (!preset || !colorPanel.contains(preset)) return;
    colorHex.value = preset.dataset.colorPreset;
    UI.updateColorDraft(colorHex.value);
  });
  document.getElementById("color-cancel").addEventListener("click", () => closeColorPanel());
  document.getElementById("color-apply").addEventListener("click", () => {
    const hex = UI.updateColorDraft(colorHex.value);
    if (!hex) {
      colorHex.focus();
      return;
    }
    clearTimeout(searchTimer);
    const queryChanged = Store.getFilters().query !== searchInput.value;
    Store.setFilter("query", searchInput.value);
    Store.setFilter("color", hex);
    render(false, !queryChanged);
    document.getElementById("custom-color-toggle").focus();
  });

  // 面板内部及开关本身的点击都不按“外部点击”处理。
  document.addEventListener("click", (event) => {
    if (colorPanel.hidden) return;
    const toggle = document.getElementById("custom-color-toggle");
    if (colorPanel.contains(event.target) || (toggle && toggle.contains(event.target))) return;
    closeColorPanel(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || event.isComposing || colorPanel.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    closeColorPanel();
  }, true);

  const cardsGrid = document.getElementById("cards-grid");

  // 收藏只更新当前星标，不触发卡片详情，也不重置已加载页数。
  cardsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-favorite]");
    if (!button || !cardsGrid.contains(button)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    UI.toggleFavorite(button.dataset.favorite, button);
  }, true);

  // inert 与 CSS 禁用之外再加事件保护，后续详情监听也不能打开未命中项。
  function blockMutedCard(event) {
    if (!event.target.closest(".card-color-muted")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  cardsGrid.addEventListener("click", blockMutedCard, true);
  cardsGrid.addEventListener("keydown", blockMutedCard, true);

  // 普通冒泡监听：未命中颜色的卡片仍由已有捕获层统一拦截。
  function openCard(event) {
    const card = event.target.closest(".card[data-id]");
    if (!card || !cardsGrid.contains(card)) return;
    clearTimeout(searchTimer);
    closeColorPanel(false);
    Detail.open(card.dataset.id);
  }
  cardsGrid.addEventListener("click", openCard);
  cardsGrid.addEventListener("keydown", (event) => {
    if (event.isComposing || (event.key !== "Enter" && event.key !== " ")) return;
    if (!event.target.matches(".card[data-id]")) return;
    event.preventDefault();
    if (!event.repeat) openCard(event);
  });

  document.addEventListener("gallery:filter", (event) => {
    const { key, value } = event.detail || {};
    if (!Object.prototype.hasOwnProperty.call(Store.getFilters(), key)
      || typeof value !== "string") return;
    clearTimeout(searchTimer);
    Store.setFilter("query", searchInput.value);
    Store.setFilter(key, value);
    if (key === "query") searchInput.value = value;
    render();
    // 原卡片可能被标签筛选替换，将焦点交给新结果或搜索框。
    const nextCard = cardsGrid.querySelector('.card:not([inert])');
    (nextCard || searchInput).focus({ preventScroll: true });
  });

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === "dark";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.textContent = dark ? "切换浅色" : "切换深色";
  }

  let initialTheme = "light";
  try {
    initialTheme = localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
  } catch {
    // 本地存储不可用时使用浅色，按钮切换仍然有效。
  }
  setTheme(initialTheme);
  themeButton.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    try {
      localStorage.setItem(themeKey, theme);
    } catch {
      // 保存失败不影响当前页面主题。
    }
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    resetLoadMoreButton();
    updateSearchClear();
    searchTimer = setTimeout(() => {
      Store.setFilter("query", searchInput.value);
      render();
    }, 300);
  });

  function clearSearch() {
    clearTimeout(searchTimer);
    searchInput.value = "";
    Store.setFilter("query", "");
    updateSearchClear();
    render();
    searchInput.focus();
  }
  clearSearchButton.addEventListener("click", clearSearch);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || event.isComposing) return;
    event.preventDefault();
    clearSearch();
  });

  // 筛选项由渲染生成，统一委托到固定容器。
  function onFilterClick(event) {
    const toggle = event.target.closest("#custom-color-toggle");
    if (toggle && event.currentTarget.contains(toggle)) {
      if (colorPanel.hidden) openColorPanel();
      else closeColorPanel();
      return;
    }
    const button = event.target.closest("button[data-filter]");
    if (!button || !event.currentTarget.contains(button)) return;
    clearTimeout(searchTimer);
    const { filter: key, value } = button.dataset;
    const selected = Store.getFilters()[key];
    const queryChanged = Store.getFilters().query !== searchInput.value;
    const isSelected = key === "color"
      ? (Store.normalizeHex(selected) || selected.toUpperCase())
        === (Store.normalizeHex(value) || value.toUpperCase())
      : selected === value;
    Store.setFilter("query", searchInput.value);
    // 再次点击已选项即可取消；类型的未筛选值沿用 all。
    Store.setFilter(key, isSelected ? (key === "type" ? "all" : "") : value);
    render(false, key === "color" && !queryChanged);
  }
  document.getElementById("type-filters").addEventListener("click", onFilterClick);
  document.getElementById("filters").addEventListener("click", onFilterClick);

  document.getElementById("clear-filters").addEventListener("click", () => {
    clearTimeout(searchTimer);
    searchInput.value = "";
    Store.clearFilters();
    updateSearchClear();
    render();
  });

  moreButton.addEventListener("click", () => {
    if (loadingMore) return;
    // 搜索尚在防抖等待期间点击加载更多时，先应用最新搜索。
    if (searchInput.value !== Store.getFilters().query) {
      clearTimeout(searchTimer);
      Store.setFilter("query", searchInput.value);
      render();
      return;
    }
    loadingMore = true;
    moreButton.disabled = true;
    moreButton.textContent = "加载中…";
    loadMoreTimer = setTimeout(() => {
      try {
        render(true);
      } finally {
        resetLoadMoreButton();
      }
    }, 300);
  });

  moreButton.dataset.defaultLabel = moreButton.textContent;
  UI.renderSkeleton(CONFIG.pageSize);
  try {
    const items = await getPrompts();
    Store.setData(items);
    ready = true;
    render();
  } catch {
    // 接口异常也结束骨架屏，并给出可读提示。
    Store.setData([]);
    ready = true;
    render();
    errorMessage.textContent = "提示词加载失败，请检查数据文件后刷新页面。";
    errorMessage.hidden = false;
  }
});
