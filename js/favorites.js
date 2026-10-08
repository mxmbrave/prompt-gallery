"use strict";

const Favorites = (() => {
  const legacyKey = "prompt-gallery-favorites";
  const libraryKey = "prompt-gallery-library";
  const defaultFolderId = "folder-default";
  let state = null;
  let memoryState = null;
  let storageAvailable = true;
  let warned = false;

  function today() { return new Date().toISOString().slice(0, 10); }
  function defaultState() {
    return { version: 2, folders: [{ id: defaultFolderId, name: "默认收藏夹", createdAt: today() }], entries: [] };
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function normalizeState(value) {
    if (!value || typeof value !== "object" || Array.isArray(value) || !Array.isArray(value.folders) || !Array.isArray(value.entries)) return null;
    const folders = [];
    const seenFolders = new Set();
    value.folders.filter((folder) => folder && typeof folder.id === "string" && typeof folder.name === "string")
      .forEach((folder) => {
        if (seenFolders.has(folder.id)) return;
        seenFolders.add(folder.id);
        folders.push({ id: folder.id, name: folder.name.trim() || "未命名收藏夹", createdAt: folder.createdAt || today() });
      });
    if (!folders.some((folder) => folder.id === defaultFolderId)) folders.unshift({ id: defaultFolderId, name: "默认收藏夹", createdAt: today() });
    const folderIds = new Set(folders.map((folder) => folder.id));
    const entriesById = new Map();
    value.entries.forEach((entry) => {
      if (!entry || typeof entry.id !== "string") return;
      const clean = {
        id: entry.id,
        folderIds: Array.isArray(entry.folderIds) ? [...new Set(entry.folderIds.filter((id) => folderIds.has(id)))] : [],
        note: typeof entry.note === "string" ? entry.note : "",
        addedAt: entry.addedAt || today()
      };
      if (!clean.folderIds.length && !clean.note) return;
      const existing = entriesById.get(clean.id);
      if (!existing) entriesById.set(clean.id, clean);
      else {
        existing.folderIds = [...new Set(existing.folderIds.concat(clean.folderIds))];
        if (!existing.note && clean.note) existing.note = clean.note;
      }
    });
    return { version: 2, folders, entries: [...entriesById.values()] };
  }
  function announce() { if (typeof document !== "undefined") document.dispatchEvent(new CustomEvent("favorites:changed")); }
  function save() {
    const clean = normalizeState(state) || defaultState();
    state = clean; memoryState = clone(clean);
    if (storageAvailable) { try { localStorage.setItem(libraryKey, JSON.stringify(clean)); } catch { storageAvailable = false; } }
    announce();
  }
  function ensureLoaded() {
    if (state) return;
    if (!storageAvailable) { state = memoryState || defaultState(); return; }
    try {
      const raw = localStorage.getItem(libraryKey);
      if (raw !== null) {
        state = normalizeState(JSON.parse(raw));
        if (!state) { if (!warned) console.warn("收藏数据损坏，已重置为空收藏夹。"); warned = true; state = defaultState(); }
      } else {
        const legacyRaw = localStorage.getItem(legacyKey);
        const legacy = legacyRaw === null ? [] : JSON.parse(legacyRaw);
        state = defaultState();
        if (Array.isArray(legacy)) state.entries = [...new Set(legacy.filter((id) => typeof id === "string" && id.trim()))].map((id) => ({ id, folderIds: [defaultFolderId], note: "", addedAt: today() }));
        localStorage.setItem(libraryKey, JSON.stringify(state));
      }
    } catch (error) {
      storageAvailable = false; state = memoryState || defaultState();
      if (!warned) { console.warn("收藏数据读取失败，已改用当前页面的内存状态。", error); warned = true; }
    }
    memoryState = clone(state);
  }
  function getAll() { ensureLoaded(); return state.entries.filter((entry) => entry.folderIds.length || entry.note).map((entry) => entry.id); }
  function getFolders() { ensureLoaded(); return clone(state.folders); }
  function getEntries() { ensureLoaded(); return clone(state.entries); }
  function getEntry(id) { ensureLoaded(); const entry = state.entries.find((item) => item.id === id); return entry ? clone(entry) : null; }
  function isFavorite(id) { return getAll().includes(id); }
  function add(id) { toggleInFolder(id, defaultFolderId, true); return getAll(); }
  function remove(id) { ensureLoaded(); state.entries = state.entries.filter((entry) => entry.id !== id); save(); return getAll(); }
  function toggle(id) { return isFavorite(id) ? remove(id) : add(id); }
  function createFolder(name) { ensureLoaded(); const base = String(name || "").trim() || "我的收藏"; let candidate = base; let i = 2; while (state.folders.some((folder) => folder.name === candidate)) candidate = `${base} ${i++}`; const folder = { id: `folder-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, name: candidate, createdAt: today() }; state.folders.push(folder); save(); return clone(folder); }
  function renameFolder(id, name) { ensureLoaded(); const next = String(name || "").trim(); if (!next) return null; const folder = state.folders.find((item) => item.id === id); if (!folder) return null; folder.name = next; save(); return clone(folder); }
  function deleteFolder(id) { ensureLoaded(); if (id === defaultFolderId) { console.warn("默认收藏夹必须保留，未执行删除。"); return false; } if (state.folders.length <= 1) { console.warn("至少要保留一个收藏夹，未执行删除。"); return false; } if (!state.folders.some((folder) => folder.id === id)) return false; state.folders = state.folders.filter((folder) => folder.id !== id); state.entries = state.entries.map((entry) => ({ ...entry, folderIds: entry.folderIds.filter((folderId) => folderId !== id) })).filter((entry) => entry.folderIds.length || entry.note); save(); return true; }
  function isInFolder(id, folderId) { const entry = getEntry(id); return Boolean(entry && entry.folderIds.includes(folderId)); }
  function toggleInFolder(id, folderId, forceAdd = null) { ensureLoaded(); if (!state.folders.some((folder) => folder.id === folderId)) return false; let entry = state.entries.find((item) => item.id === id); const shouldAdd = forceAdd === null ? !Boolean(entry && entry.folderIds.includes(folderId)) : forceAdd; if (!entry && shouldAdd) { entry = { id, folderIds: [], note: "", addedAt: today() }; state.entries.push(entry); } if (!entry) return false; entry.folderIds = shouldAdd ? [...new Set([...entry.folderIds, folderId])] : entry.folderIds.filter((value) => value !== folderId); if (!entry.folderIds.length && !entry.note) state.entries = state.entries.filter((item) => item !== entry); save(); return shouldAdd; }
  function setNote(id, note) { ensureLoaded(); let entry = state.entries.find((item) => item.id === id); const value = String(note || ""); if (!entry && value) { entry = { id, folderIds: [], note: value, addedAt: today() }; state.entries.push(entry); } else if (entry) { entry.note = value; if (!entry.folderIds.length && !entry.note) state.entries = state.entries.filter((item) => item !== entry); } save(); return value; }
  function getFoldersOf(id) { const entry = getEntry(id); return entry ? entry.folderIds : []; }
  function exportJSON() { ensureLoaded(); return JSON.stringify({ ...clone(state), exportedAt: new Date().toISOString() }, null, 2); }
  function importJSON(text) { let incoming; try { incoming = normalizeState(JSON.parse(text)); } catch { return null; } if (!incoming) return null; ensureLoaded(); const folderMap = new Map(state.folders.map((folder) => [folder.id, folder.id])); let addedFolders = 0; incoming.folders.forEach((folder) => { if (folderMap.has(folder.id)) return; let id = folder.id; let suffix = 2; while (state.folders.some((item) => item.id === id)) id = `${folder.id}-${suffix++}`; state.folders.push({ ...folder, id }); folderMap.set(folder.id, id); addedFolders += 1; }); let addedEntries = 0; incoming.entries.forEach((entry) => { const existing = state.entries.find((item) => item.id === entry.id); const ids = entry.folderIds.map((id) => folderMap.get(id)).filter(Boolean); if (!existing) { state.entries.push({ ...entry, folderIds: ids }); addedEntries += 1; } else { existing.folderIds = [...new Set([...existing.folderIds, ...ids])]; if (!existing.note) existing.note = entry.note; } }); save(); return { addedFolders, addedEntries }; }
  return Object.freeze({ getAll, isFavorite, add, remove, toggle, getFolders, createFolder, renameFolder, deleteFolder, getEntries, getEntry, isInFolder, toggleInFolder, setNote, getFoldersOf, exportJSON, importJSON });
})();
