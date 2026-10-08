"use strict";

// 这是【单机统计】，只记录当前浏览器里的行为，不代表全站数据；以后接服务端统计，只需改本文件的读写函数。
const Stats = (() => {
  const key = "prompt-gallery-stats";
  let state = null;
  let memoryOnly = false;
  let warned = false;

  function empty() { return { version: 1, copies: {} }; }
  function load() {
    if (state) return;
    if (memoryOnly) { state = empty(); return; }
    try {
      const raw = localStorage.getItem(key);
      if (!raw) { state = empty(); return; }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)
        || !parsed.copies || typeof parsed.copies !== "object" || Array.isArray(parsed.copies)) throw new Error("invalid stats");
      const copies = {};
      let invalid = false;
      Object.keys(parsed.copies).forEach((id) => {
        const count = Number(parsed.copies[id]);
        if (Number.isFinite(count) && count >= 0 && Number.isInteger(count)) {
          if (count > 0) copies[id] = count;
        } else invalid = true;
      });
      if (invalid) throw new Error("invalid copy count");
      state = { version: 1, copies };
    } catch (error) {
      state = empty();
      if (!warned) console.warn("本机复制统计数据损坏，已重置为空统计。", error);
      warned = true;
    }
  }
  function save() {
    if (memoryOnly) return;
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch { memoryOnly = true; }
  }
  function changed() { if (typeof document !== "undefined") document.dispatchEvent(new CustomEvent("stats:changed")); }
  function getCopyCount(id) { load(); return state.copies[id] || 0; }
  function recordCopy(id) { if (!id) return 0; load(); state.copies[id] = getCopyCount(id) + 1; save(); changed(); return state.copies[id]; }
  function getTotalCopies() { load(); return Object.values(state.copies).reduce((sum, count) => sum + count, 0); }
  function getTopCopied(limit) { load(); const size = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : Object.keys(state.copies).length; return Object.entries(state.copies).sort((a, b) => b[1] - a[1]).slice(0, size).map(([id]) => id); }
  function clearStats() { state = empty(); save(); changed(); }
  return Object.freeze({ getCopyCount, recordCopy, getTotalCopies, getTopCopied, clearStats });
})();
