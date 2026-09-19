"use strict";

// 独立的合集数据文件便于编辑内容，无需同步维护第二份内联数据。
async function getCollections() {
  try {
    const response = await fetch("data/collections.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.items)) throw new Error("items 不是数组");
    return payload.items;
  } catch (error) {
    console.warn("合集数据加载失败，当前显示空列表：", error);
    return [];
  }
}

const CollectionStore = (() => {
  const favoriteKey = "prompt-gallery-collection-favorites";
  let collections = [];
  let memoryFavorites = [];
  let storageAvailable = true;
  const missingWarnings = new Set();

  function cloneCollection(collection) {
    return {
      ...collection,
      coverColors: Array.isArray(collection.coverColors) ? [...collection.coverColors] : [],
      tags: Array.isArray(collection.tags) ? [...collection.tags] : [],
      itemIds: Array.isArray(collection.itemIds) ? [...collection.itemIds] : []
    };
  }

  function setCollections(list) {
    missingWarnings.clear();
    collections = Array.isArray(list)
      ? list.filter((collection) => collection && typeof collection.id === "string")
        .map(cloneCollection)
      : [];
  }

  function getStoredCollections() {
    return collections.map(cloneCollection);
  }

  function getCollection(id) {
    const collection = collections.find((entry) => entry.id === id);
    return collection ? cloneCollection(collection) : null;
  }

  function getItems(collection) {
    if (!collection || !Array.isArray(collection.itemIds)) return [];
    const prompts = new Map(Store.getData().map((item) => [item.id, item]));
    const missing = collection.itemIds.filter((id) => !prompts.has(id));
    if (missing.length && !missingWarnings.has(collection.id)) {
      missingWarnings.add(collection.id);
      console.warn(`合集 ${collection.id} 引用了 ${missing.length} 个不存在的 id，已静默跳过。`);
    }
    return collection.itemIds.map((id) => prompts.get(id)).filter(Boolean);
  }

  function getItemCount(collection) {
    return getItems(collection).length;
  }

  function normalizeFavorites(ids) {
    return Array.isArray(ids)
      ? [...new Set(ids.filter((id) => typeof id === "string" && id.trim()))]
      : [];
  }

  function readFavorites() {
    if (!storageAvailable) return [...memoryFavorites];
    try {
      const saved = localStorage.getItem(favoriteKey);
      memoryFavorites = saved === null ? [] : normalizeFavorites(JSON.parse(saved));
    } catch (error) {
      // 隐私模式、损坏的 JSON 等情形保留当前内存状态。
      storageAvailable = false;
      console.warn("合集收藏无法读取本地存储，已改用当前页面的内存状态：", error);
    }
    return [...memoryFavorites];
  }

  function writeFavorites(ids) {
    memoryFavorites = normalizeFavorites(ids);
    if (!storageAvailable) return;
    try {
      localStorage.setItem(favoriteKey, JSON.stringify(memoryFavorites));
    } catch (error) {
      storageAvailable = false;
      console.warn("合集收藏无法写入本地存储，已改用当前页面的内存状态：", error);
    }
  }

  function isCollectionFavorite(id) {
    return readFavorites().includes(id);
  }

  function toggleCollectionFavorite(id) {
    if (!getCollection(id)) return false;
    const favorites = readFavorites();
    const willFavorite = !favorites.includes(id);
    writeFavorites(willFavorite
      ? [...favorites, id]
      : favorites.filter((favoriteId) => favoriteId !== id));
    return willFavorite;
  }

  return Object.freeze({
    setCollections,
    getCollections: getStoredCollections,
    getCollection,
    getItems,
    getItemCount,
    isCollectionFavorite,
    toggleCollectionFavorite
  });
})();
