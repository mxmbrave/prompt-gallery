"use strict";

// 纯数据层：保存筛选条件与已加载页数，不依赖页面环境。
const Store = (() => {
  const defaults = Object.freeze({
    query: "", type: "all", category: "", tag: "", color: "", model: "", favorite: ""
  });
  let data = [];
  let filters = { ...defaults };
  let loadedPages = 0;

  // 数据入口和渲染层共用：非数组视为空，过滤无效标签并去重。
  function normalizeTags(tags) {
    if (!Array.isArray(tags)) return [];
    return [...new Set(tags
      .filter((tag) => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter(Boolean))];
  }

  const cloneItem = (item) => ({
    ...item, tags: normalizeTags(item.tags), colors: [...item.colors]
  });

  // 颜色计算均为纯函数；支持三位与六位 HEX，非法输入不抛异常。
  function hexToRgb(hex) {
    if (typeof hex !== "string") return null;
    let value = hex.trim();
    if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return null;
    value = value.slice(1);
    if (value.length === 3) value = [...value].map((char) => char + char).join("");
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function normalizeHex(hex) {
    const rgb = hexToRgb(hex);
    return rgb ? "#" + [rgb.r, rgb.g, rgb.b]
      .map((channel) => channel.toString(16).padStart(2, "0")).join("").toUpperCase() : null;
  }

  function rgbToLab(rgb) {
    if (!rgb || ![rgb.r, rgb.g, rgb.b].every((value) =>
      Number.isFinite(value) && value >= 0 && value <= 255)) return null;
    // sRGB 先线性化，再转 XYZ；统一采用 D65 参考白点。
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047;
    const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
    const z = (0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.08883;
    const f = (value) => value > (6 / 29) ** 3
      ? Math.cbrt(value) : value / (3 * (6 / 29) ** 2) + 4 / 29;
    const [fx, fy, fz] = [x, y, z].map(f);
    return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
  }

  function colorDistance(hex1, hex2) {
    const first = rgbToLab(hexToRgb(hex1));
    const second = rgbToLab(hexToRgb(hex2));
    if (!first || !second) return 100;
    // CIE76 的原始色差可能超过 100；按接口要求截断，不影响阈值 22。
    return Math.min(100, Math.hypot(
      first.l - second.l, first.a - second.a, first.b - second.b
    ));
  }

  function matchesColor(colors, selectedColor) {
    if (!selectedColor) return true;
    if (!hexToRgb(selectedColor) || !Array.isArray(colors)) return false;
    return colors.some((color) => hexToRgb(color)
      && colorDistance(selectedColor, color) < CONFIG.colorThreshold);
  }

  function setData(items) {
    // 赋值前检查重复 ID；只警告，不修改传入数据。
    if (Array.isArray(items)) {
      const counts = new Map();
      items.forEach((item) => {
        const id = item?.id;
        if (id === undefined || id === null) return;
        counts.set(id, (counts.get(id) || 0) + 1);
      });
      const duplicates = [...counts]
        .filter(([, count]) => count > 1)
        .map(([id, count]) => `${id}（${count} 次）`);
      if (duplicates.length > 0) {
        console.warn(
          `提示词数据存在重复 id：${duplicates.join("、")}。` +
          "这可能导致详情打开错误记录、颜色反馈与收藏状态混淆。" +
          "请同步修正 data/prompts.json 和 js/data.js 中的 window.PROMPTS_DATA。" +
          "本次仍按原顺序加载全部数据，未自动去重。"
        );
      }
    }
    data = Array.isArray(items) ? items.map(cloneItem) : [];
    loadedPages = 0;
  }

  function getData() {
    return data.map(cloneItem);
  }

  function getFeatured(category, limit) {
    const matching = data.filter((item) => !category || category === "all"
      || item.category === category);
    const newestFirst = (first, second) =>
      String(second.createdAt || "").localeCompare(String(first.createdAt || ""));
    const featured = matching.filter((item) => item.featured === true).sort(newestFirst);
    const others = matching.filter((item) => item.featured !== true).sort(newestFirst);
    const count = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : matching.length;
    return [...featured, ...others].slice(0, count).map(cloneItem);
  }

  function setFilter(key, value) {
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) return;
    filters[key] = typeof value === "string" ? value : defaults[key];
    loadedPages = 0;
  }

  function getFilters() {
    return { ...filters };
  }

  function clearFilters() {
    filters = { ...defaults };
    loadedPages = 0;
  }

  // 可忽略一个维度，供联动选项和保留颜色未命中卡片的视图复用。
  function getFiltered(excludeDimension = "") {
    const query = filters.query.trim().toLocaleLowerCase();
    const favoriteIds = filters.favorite && typeof Favorites !== "undefined"
      ? new Set(Favorites.getAll()) : null;
    return data.filter((item) => {
      const searchable = [
        item.title, item.prompt, item.promptZh, item.model,
        item.category, item.author, ...item.tags
      ].join(" ").toLocaleLowerCase();
      return (excludeDimension === "query" || !query || searchable.includes(query))
        && (excludeDimension === "type" || filters.type === "all" || item.type === filters.type)
        && (excludeDimension === "category" || !filters.category || item.category === filters.category)
        && (excludeDimension === "tag" || !filters.tag || item.tags.includes(filters.tag))
        && (excludeDimension === "color" || matchesColor(item.colors, filters.color))
        && (excludeDimension === "model" || !filters.model || item.model === filters.model)
        && (excludeDimension === "favorite" || !filters.favorite
          || Boolean(favoriteIds && favoriteIds.has(item.id)));
    }).map(cloneItem);
  }

  // 页码从 1 开始；省略页码加载下一页，传 1 可重置到第一页。
  function getPage(page = loadedPages + 1, { ignoreColor = false } = {}) {
    const filtered = getFiltered(ignoreColor ? "color" : "");
    const lastPage = Math.max(1, Math.ceil(filtered.length / CONFIG.pageSize));
    const requested = Number.isInteger(page) && page > 0 ? page : 1;
    const current = Math.min(requested, lastPage);
    const start = (current - 1) * CONFIG.pageSize;
    loadedPages = current;
    return {
      items: filtered.slice(start, start + CONFIG.pageSize),
      hasMore: start + CONFIG.pageSize < filtered.length
    };
  }

  function getFilterOptions() {
    const unique = (values) => [...new Set(values)].sort((a, b) =>
      a.localeCompare(b, "zh-CN"));
    return {
      types: [...CONFIG.types],
      categories: unique(data.map((item) => item.category)),
      tags: unique(data.flatMap((item) => item.tags)),
      colors: unique(data.flatMap((item) => item.colors.map((color) => color.toUpperCase()))),
      models: unique(data.map((item) => item.model))
    };
  }

  return Object.freeze({
    setData, getData, getFeatured, setFilter, getFilters, clearFilters,
    getFiltered, getPage, getFilterOptions,
    hexToRgb, rgbToLab, colorDistance, normalizeHex, matchesColor, normalizeTags,
    getLoadedPages: () => loadedPages
  });
})();
