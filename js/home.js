"use strict";

// 首页只负责展示与跳转；筛选和详情仍由 library.html 处理。
document.addEventListener("DOMContentLoaded", async () => {
  const searchForm = document.getElementById("home-search-form");
  const searchInput = document.getElementById("home-search-input");
  const quickTags = document.getElementById("home-quick-tags");
  const categoryTabs = document.getElementById("home-category-tabs");
  const featuredGrid = document.getElementById("home-featured-grid");
  const browseList = document.getElementById("home-browse-list");
  const errorMessage = document.getElementById("home-error");
  const categoryOrder = ["场景", "人物", "动物", "产品", "食物", "建筑"];
  let activeCategory = "all";
  let itemById = new Map();

  const libraryURL = (key, value) => `library.html?${key}=${encodeURIComponent(value)}`;

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    location.href = query ? libraryURL("q", query) : "library.html";
  });

  function categoriesFrom(items) {
    const counts = new Map();
    items.forEach((item) => {
      if (typeof item.category !== "string" || !item.category.trim()) return;
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    });
    const categories = [...counts.keys()];
    categories.sort((a, b) => {
      const left = categoryOrder.indexOf(a);
      const right = categoryOrder.indexOf(b);
      if (left !== -1 && right !== -1) return left - right;
      if (left !== -1) return -1;
      if (right !== -1) return 1;
      return a.localeCompare(b, "zh-CN");
    });
    return { categories, counts };
  }

  function renderQuickTags(items) {
    const counts = new Map();
    items.forEach((item) => {
      Store.normalizeTags(item.tags).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    const popular = [...counts].sort((a, b) => b[1] - a[1]
      || a[0].localeCompare(b[0], "zh-CN")).slice(0, 6);
    quickTags.replaceChildren(...popular.map(([tag]) => {
      const link = document.createElement("a");
      link.className = "home-quick-tag";
      link.href = libraryURL("tag", tag);
      link.textContent = `# ${tag}`;
      return link;
    }));
  }

  function renderCategoryTabs(categories) {
    const choices = [["all", "推荐"], ...categories.map((category) => [category, category])];
    categoryTabs.replaceChildren(...choices.map(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "home-category-button";
      button.dataset.category = value;
      button.setAttribute("aria-pressed", String(activeCategory === value));
      button.textContent = label;
      return button;
    }));
  }

  function createFeaturedCard(item) {
    const link = document.createElement("a");
    link.className = "home-card";
    link.dataset.id = item.id;
    link.href = libraryURL("id", item.id);

    const cover = document.createElement("div");
    cover.className = "home-card-cover";
    const image = document.createElement("img");
    const hasCover = typeof item.cover === "string" && item.cover.trim() !== "";
    image.src = hasCover ? item.cover : getCoverPlaceholder(item);
    image.dataset.coverFallback = String(!hasCover);
    image.alt = `${item.title}的封面`;
    image.loading = "lazy";
    image.width = 640;
    image.height = 480;
    const type = document.createElement("span");
    type.className = "home-card-type";
    type.textContent = CONFIG.typeLabels[item.type] || item.type;
    cover.append(image, type);

    const title = document.createElement("h3");
    title.textContent = item.title;
    link.append(cover, title);
    return link;
  }

  function renderFeatured() {
    const items = Store.getFeatured(activeCategory, 8);
    featuredGrid.replaceChildren(...items.map(createFeaturedCard));
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "这个分类暂时没有提示词。";
      featuredGrid.append(empty);
    }
    featuredGrid.setAttribute("aria-busy", "false");
  }

  function renderBrowse(categories, counts) {
    browseList.replaceChildren(...categories.map((category) => {
      const link = document.createElement("a");
      link.className = "home-browse-card";
      link.href = libraryURL("category", category);
      const name = document.createElement("strong");
      name.textContent = category;
      const count = document.createElement("span");
      count.textContent = `${counts.get(category)} 条`;
      link.append(name, count);
      return link;
    }));
  }

  categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button || !categoryTabs.contains(button)) return;
    activeCategory = button.dataset.category;
    categoryTabs.querySelectorAll("button[data-category]").forEach((tab) => {
      tab.setAttribute("aria-pressed", String(tab === button));
    });
    renderFeatured();
  });

  // IMG 的 error 不冒泡，必须在网格捕获阶段处理；占位图自身失败不再重试。
  featuredGrid.addEventListener("error", (event) => {
    const image = event.target;
    if (image.tagName !== "IMG" || image.dataset.coverFallback === "true") return;
    const card = image.closest(".home-card[data-id]");
    const item = card && itemById.get(card.dataset.id);
    if (!item) return;
    image.dataset.coverFallback = "true";
    image.src = getCoverPlaceholder(item);
    image.alt = `${item.title}的配色占位封面`;
  }, true);

  try {
    const items = await getPrompts();
    Store.setData(items);
    const records = Store.getData();
    itemById = new Map(records.map((item) => [item.id, item]));
    const { categories, counts } = categoriesFrom(records);
    renderQuickTags(records);
    renderCategoryTabs(categories);
    renderFeatured();
    renderBrowse(categories, counts);
  } catch {
    featuredGrid.setAttribute("aria-busy", "false");
    errorMessage.textContent = "推荐内容暂时无法加载，请稍后刷新页面重试。";
    errorMessage.hidden = false;
  }
});
