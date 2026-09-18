"use strict";

// 存储不可用或数据损坏时，退回当前页面的内存收藏。
const Favorites = (() => {
  const key = "prompt-gallery-favorites";
  let memory = [];
  let storageAvailable = true;

  function normalize(ids) {
    return Array.isArray(ids)
      ? [...new Set(ids.filter((id) => typeof id === "string" && id.trim()))]
      : [];
  }

  function getAll() {
    if (!storageAvailable) return [...memory];
    try {
      const saved = localStorage.getItem(key);
      memory = saved === null ? [] : normalize(JSON.parse(saved));
    } catch {
      // file://、隐私模式或损坏的 JSON 均不会中断页面。
      storageAvailable = false;
    }
    return [...memory];
  }

  function save(ids) {
    memory = normalize(ids);
    if (!storageAvailable) return [...memory];
    try {
      localStorage.setItem(key, JSON.stringify(memory));
    } catch {
      // 保留内存状态，确保收藏接口仍可调用。
      storageAvailable = false;
    }
    return [...memory];
  }

  function isFavorite(id) {
    return getAll().includes(id);
  }

  function add(id) {
    return save([...getAll(), id]);
  }

  function remove(id) {
    return save(getAll().filter((value) => value !== id));
  }

  function toggle(id) {
    const ids = getAll();
    return save(ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]);
  }

  return Object.freeze({ getAll, isFavorite, add, remove, toggle });
})();
