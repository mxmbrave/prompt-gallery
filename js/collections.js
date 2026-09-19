"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const listView = document.getElementById("collection-list-view");
  const detailView = document.getElementById("collection-detail-view");
  const tabs = document.getElementById("collection-tabs");
  const tagFilters = document.getElementById("collection-tag-filters");
  const collectionGrid = document.getElementById("collection-grid");
  const collectionEmpty = document.getElementById("collection-empty");
  const loadError = document.getElementById("collection-load-error");
  const detailGrid = document.getElementById("collection-items-grid");
  const saveAllButton = document.getElementById("collection-save-all");
  const saveStatus = document.getElementById("collection-save-status");
  const coverSources = new WeakMap();
  const starPath = "M12 2.8l2.8 5.7 6.3.9-4.55 4.43 1.08 6.25L12 17.1l-5.63 2.98 1.08-6.25L1.82 9.4l6.3-.9Z";
  let collections = [];
  let activeTab = "featured";
  let selectedTag = "";
  let currentCollection = null;
  let listScrollY = 0;

  // 动态文字只用 textContent 写入 DOM，不拼接未经转义的数据。
  function element(tag, className = "", value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = String(value);
    return node;
  }

  function starIcon(favorite) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="${starPath}" fill="${favorite ? "currentColor" : "none"}"
        stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  function setStar(button, favorite, title, isCollection) {
    button.setAttribute("aria-pressed", String(favorite));
    button.setAttribute("aria-label", `${favorite ? "取消收藏" : "收藏"}${isCollection ? "合集" : "提示词"}：《${title}》`);
    button.innerHTML = starIcon(favorite); // SVG 为固定模板，不含数据文本。
  }

  function imageFor(record, colors, className) {
    const image = element("img", className);
    const hasCover = typeof record.cover === "string" && record.cover.trim() !== "";
    image.src = hasCover ? record.cover : getCoverPlaceholder({ colors });
    image.dataset.coverFallback = String(!hasCover);
    image.alt = `${record.title}的封面`;
    image.loading = "lazy";
    image.width = 640;
    image.height = 480;
    coverSources.set(image, { colors, title: record.title });
    return image;
  }

  function urlWith(key, value) {
    const url = new URL(location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    return url;
  }

  function writeURL(url, mode) {
    try {
      history[mode](history.state, "", url.href);
    } catch {
      // 少数 file:// 环境限制 History API；当前页视图仍可正常切换。
    }
  }

  function popularTags() {
    const counts = new Map();
    collections.forEach((collection) => {
      Store.normalizeTags(collection.tags).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    const tags = [...counts].sort((a, b) => b[1] - a[1]
      || a[0].localeCompare(b[0], "zh-CN")).slice(0, 8).map(([tag]) => tag);
    if (selectedTag && !tags.includes(selectedTag)) tags.push(selectedTag);
    return tags;
  }

  function renderTagFilters() {
    const values = ["", ...popularTags()];
    tagFilters.replaceChildren(...values.map((value) => {
      const button = element("button", "filter-button", value || "全部");
      button.type = "button";
      button.dataset.tag = value;
      button.setAttribute("aria-pressed", String(selectedTag === value));
      return button;
    }));
  }

  function collectionCard(collection) {
    const article = element("article", "collection-card");
    article.dataset.id = collection.id;
    const link = element("a", "collection-card-link");
    link.dataset.collectionLink = collection.id;
    link.href = urlWith("col", collection.id).href;
    const cover = element("div", "collection-card-cover");
    cover.append(imageFor(collection, collection.coverColors, "collection-cover-image"));
    if (collection.featured === true) cover.append(element("span", "collection-featured-label", "精选"));

    const body = element("div", "collection-card-body");
    body.append(element("h2", "collection-card-title", collection.title));
    body.append(element("p", "collection-card-description", collection.description));
    body.append(element("p", "collection-author", `由 ${collection.author} 整理`));
    const meta = element("div", "collection-card-meta");
    meta.append(element("span", "collection-item-count", `${CollectionStore.getItemCount(collection)} 条提示词`));
    Store.normalizeTags(collection.tags).slice(0, 3).forEach((tag) => {
      meta.append(element("span", "collection-tag", tag));
    });
    body.append(meta);
    link.append(cover, body);

    const favorite = CollectionStore.isCollectionFavorite(collection.id);
    const button = element("button", "favorite-button collection-favorite-button");
    button.type = "button";
    button.dataset.collectionFavorite = collection.id;
    setStar(button, favorite, collection.title, true);
    article.append(link, button);
    return article;
  }

  function renderList() {
    const favoriteIds = new Set(CollectionStore.getCollections()
      .filter((collection) => CollectionStore.isCollectionFavorite(collection.id))
      .map((collection) => collection.id));
    const visible = collections.filter((collection) =>
      (activeTab !== "mine" || favoriteIds.has(collection.id))
      && (!selectedTag || Store.normalizeTags(collection.tags).includes(selectedTag)));
    collectionGrid.replaceChildren(...visible.map(collectionCard));
    collectionGrid.setAttribute("aria-busy", "false");
    const noFavorites = activeTab === "mine" && favoriteIds.size === 0;
    collectionEmpty.textContent = noFavorites
      ? "还没有收藏任何合集。去「精选合集」的卡片右上角点击星标，就能在这里找到它。"
      : (collections.length ? "没有找到匹配的合集，请更换标签。" : "合集暂时没有可用内容。 ");
    collectionEmpty.hidden = visible.length > 0;
  }

  function promptCard(item) {
    const article = element("article", "card collection-item-card");
    const link = element("a", "collection-item-link");
    link.href = `library.html?id=${encodeURIComponent(item.id)}`;
    const cover = element("div", "card-cover");
    cover.append(imageFor(item, item.colors, "collection-item-image"));
    cover.append(element("span", "collection-item-type", CONFIG.typeLabels[item.type] || item.type));
    const body = element("div", "card-body");
    body.append(element("h3", "", item.title));
    if (item.promptZh) body.append(element("p", "card-description", item.promptZh));
    const tags = element("div", "tags");
    Store.normalizeTags(item.tags).forEach((tag) => tags.append(element("span", "tag", tag)));
    body.append(tags);
    link.append(cover, body);
    const button = element("button", "favorite-button collection-prompt-favorite");
    button.type = "button";
    button.dataset.promptFavorite = item.id;
    setStar(button, Favorites.isFavorite(item.id), item.title, false);
    article.append(link, button);
    return article;
  }

  function updateSaveAllButton() {
    if (!currentCollection) return;
    const items = CollectionStore.getItems(currentCollection);
    const allSaved = items.length > 0 && items.every((item) => Favorites.isFavorite(item.id));
    saveAllButton.disabled = items.length === 0 || allSaved;
    saveAllButton.textContent = items.length === 0 ? "暂无可收藏内容"
      : (allSaved ? `已收藏 ${items.length} 条` : "全部收藏");
  }

  function renderDetail(collection) {
    currentCollection = collection;
    document.getElementById("collection-detail-title").textContent = collection.title;
    document.getElementById("collection-detail-description").textContent = collection.description;
    document.getElementById("collection-detail-meta").textContent =
      `${collection.author} · ${CollectionStore.getItemCount(collection)} 条提示词`;
    const items = CollectionStore.getItems(collection);
    detailGrid.replaceChildren(...items.map(promptCard));
    if (!items.length) detailGrid.append(element("p", "empty-state", "这个合集暂时没有可用内容"));
    saveStatus.textContent = "";
    updateSaveAllButton();
  }

  function showList() {
    currentCollection = null;
    detailView.hidden = true;
    listView.hidden = false;
    renderTagFilters();
    renderList();
  }

  function showDetail(collection) {
    renderDetail(collection);
    listView.hidden = true;
    detailView.hidden = false;
  }

  function readURL() {
    const params = new URLSearchParams(location.search);
    selectedTag = params.get("ctag") || "";
    const id = params.get("col");
    const collection = id ? CollectionStore.getCollection(id) : null;
    if (id && !collection) writeURL(urlWith("col", ""), "replaceState");
    if (collection) {
      showDetail(collection);
      return;
    }
    const wasDetail = Boolean(currentCollection);
    showList();
    if (wasDetail) window.scrollTo(0, listScrollY);
  }

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-collection-tab]");
    if (!button || !tabs.contains(button)) return;
    activeTab = button.dataset.collectionTab;
    tabs.querySelectorAll("button[data-collection-tab]").forEach((tab) => {
      tab.setAttribute("aria-pressed", String(tab === button));
    });
    renderList();
  });

  tagFilters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-tag]");
    if (!button || !tagFilters.contains(button)) return;
    selectedTag = selectedTag === button.dataset.tag ? "" : button.dataset.tag;
    writeURL(urlWith("ctag", selectedTag), "replaceState");
    renderTagFilters();
    renderList();
  });

  collectionGrid.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("button[data-collection-favorite]");
    if (favoriteButton && collectionGrid.contains(favoriteButton)) {
      event.preventDefault();
      event.stopPropagation();
      const id = favoriteButton.dataset.collectionFavorite;
      const collection = CollectionStore.getCollection(id);
      if (!collection) return;
      const favorite = CollectionStore.toggleCollectionFavorite(id);
      setStar(favoriteButton, favorite, collection.title, true);
      if (activeTab === "mine") renderList();
      return;
    }
    const link = event.target.closest("a[data-collection-link]");
    if (!link || !collectionGrid.contains(link)
      || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const collection = CollectionStore.getCollection(link.dataset.collectionLink);
    if (!collection) return;
    listScrollY = window.scrollY;
    writeURL(urlWith("col", collection.id), "pushState");
    showDetail(collection);
    window.scrollTo(0, 0);
    document.getElementById("collection-detail-title").focus({ preventScroll: true });
  });

  document.getElementById("collection-back").addEventListener("click", () => {
    writeURL(urlWith("col", ""), "pushState");
    showList();
    window.scrollTo(0, listScrollY);
    document.getElementById("collections-title").focus({ preventScroll: true });
  });

  detailGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-prompt-favorite]");
    if (!button || !detailGrid.contains(button)) return;
    event.preventDefault();
    event.stopPropagation();
    const item = CollectionStore.getItems(currentCollection)
      .find((entry) => entry.id === button.dataset.promptFavorite);
    if (!item) return;
    const favorite = Favorites.toggle(item.id).includes(item.id);
    setStar(button, favorite, item.title, false);
    updateSaveAllButton();
    Nav.updateFavoriteCount();
    saveStatus.textContent = favorite ? "已收藏提示词" : "已取消收藏提示词";
  });

  saveAllButton.addEventListener("click", () => {
    if (!currentCollection || saveAllButton.disabled) return;
    const items = CollectionStore.getItems(currentCollection);
    let added = 0;
    items.forEach((item) => {
      if (Favorites.isFavorite(item.id)) return;
      Favorites.add(item.id);
      added += 1;
    });
    detailGrid.querySelectorAll("button[data-prompt-favorite]").forEach((button) => {
      const item = items.find((entry) => entry.id === button.dataset.promptFavorite);
      if (item) setStar(button, true, item.title, false);
    });
    updateSaveAllButton();
    Nav.updateFavoriteCount();
    saveStatus.textContent = `已新增收藏 ${added} 条，合集共 ${items.length} 条已收藏。`;
  });

  // 两种封面共用同一个占位图函数；捕获 IMG error，并只尝试回退一次。
  document.querySelector("main").addEventListener("error", (event) => {
    const image = event.target;
    if (image.tagName !== "IMG" || image.dataset.coverFallback === "true") return;
    const source = coverSources.get(image);
    if (!source) return;
    image.dataset.coverFallback = "true";
    image.src = getCoverPlaceholder({ colors: source.colors });
    image.alt = `${source.title}的配色占位封面`;
  }, true);

  window.addEventListener("popstate", readURL);

  try {
    const [promptResult, collectionResult] = await Promise.allSettled([getPrompts(), getCollections()]);
    if (promptResult.status === "fulfilled") Store.setData(promptResult.value);
    else {
      Store.setData([]);
      loadError.textContent = "提示词暂时无法加载，合集中的内容可能不完整。";
      loadError.hidden = false;
    }
    CollectionStore.setCollections(collectionResult.status === "fulfilled" ? collectionResult.value : []);
    collections = CollectionStore.getCollections().sort((a, b) =>
      Number(b.featured === true) - Number(a.featured === true)
      || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    if (!collections.length && loadError.hidden) {
      loadError.textContent = "合集暂时无法加载，请稍后刷新页面重试。";
      loadError.hidden = false;
    }
    readURL();
  } catch {
    collectionGrid.setAttribute("aria-busy", "false");
    loadError.textContent = "合集暂时无法加载，请稍后刷新页面重试。";
    loadError.hidden = false;
  }
});
