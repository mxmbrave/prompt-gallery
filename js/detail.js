"use strict";

const Detail = (() => {
  let overlay, content, closeButton, body;
  let currentItem = null;
  let returnTarget = null;
  let returnId = "";
  let scrollPosition = { x: 0, y: 0 };
  let background = [];
  let hadBodyLock = false;
  let closing = false;
  let closeTimer, closePromise, resolveClose;
  let generation = 0;
  const copyTimers = new Map();
  const submissionURL = "https://github.com/mxmbrave/prompt-gallery/issues/new?template=prompt-submission.yml&title=%5B%E6%8F%90%E7%A4%BA%E8%AF%8D%5D%20";

  const text = (value) => typeof value === "string" ? value : "";
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function mediaURL(value) {
    if (!text(value).trim()) return "";
    try {
      const url = new URL(value, document.baseURI);
      return ["http:", "https:", "file:", "blob:"].includes(url.protocol) ? value : "";
    } catch {
      return "";
    }
  }

  function init() {
    if (overlay) return true;
    overlay = document.getElementById("modal-overlay");
    content = document.getElementById("modal-content");
    closeButton = document.getElementById("modal-close");
    if (!overlay || !content || !closeButton) {
      overlay = null;
      return false;
    }
    body = document.createElement("div");
    body.id = "modal-body";
    content.append(body);
    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (!content.contains(event.target)) close();
    });
    content.addEventListener("animationend", (event) => {
      if (closing && event.target === content && event.animationName === "modal-content-out") {
        finishClose();
      }
    });
    body.addEventListener("click", async (event) => {
      if (closing || !currentItem) return;
      const tag = event.target.closest("button[data-detail-tag]");
      if (tag && body.contains(tag)) {
        const value = tag.dataset.detailTag;
        const completion = close();
        const session = generation;
        if (await completion && generation === session) {
          document.dispatchEvent(new CustomEvent("gallery:filter", {
            detail: { key: "tag", value }
          }));
        }
        return;
      }
      const button = event.target.closest("button[data-copy]");
      if (button && body.contains(button)) copyPrompt(button);
    });
    // window 捕获先于 document 上的取色面板和搜索框处理。
    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("stats:changed", updateCopyStat);
    return true;
  }

  function onKeyDown(event) {
    if (!overlay || overlay.hidden || event.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
    } else if (event.key === "Tab") {
      const controls = [...content.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
      )].filter((element) => element.getClientRects().length > 0);
      const first = controls[0] || closeButton;
      const last = controls[controls.length - 1] || closeButton;
      if (closing || !content.contains(document.activeElement)
        || (event.shiftKey && document.activeElement === first)
        || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus({ preventScroll: true });
      }
    }
  }

  function promptBlock(title, value, extraClass = "") {
    if (!text(value).trim()) return "";
    return `<section class="modal-prompt"><h3>${escapeHTML(title)}</h3>
      <p class="modal-prompt-text ${escapeHTML(extraClass)}">${escapeHTML(value)}</p></section>`;
  }

  function renderContent(item) {
    const cover = mediaURL(item.cover);
    const video = mediaURL(item.video);
    const placeholder = UI.getPlaceholder(item);
    const media = item.type === "video"
      ? (video ? `<video controls preload="metadata" poster="${escapeHTML(cover)}"
          src="${escapeHTML(video)}" aria-label="${escapeHTML(item.title)}"></video>` : "")
      : `<img src="${escapeHTML(cover || placeholder)}"
          data-cover-fallback="${String(!cover)}" loading="lazy"
          width="640" height="480" alt="${escapeHTML(item.title)}的配色封面">`;
    const meta = [CONFIG.typeLabels[item.type] || item.type, item.model, item.category, item.createdAt]
      .filter(Boolean).join(" · ");
    body.innerHTML = `<div class="modal-layout">
      <div class="modal-media">${media}
        <p id="modal-media-status" class="modal-media-status" hidden>媒体暂时无法加载，仍可查看和复制提示词。</p>
      </div>
      <div class="modal-text">
        <h2 id="modal-title">${escapeHTML(item.title)}</h2>
        <p class="modal-meta">${escapeHTML(meta)}</p>
        <div class="modal-tags">${Store.normalizeTags(item.tags).map((tag) =>
          `<button type="button" class="filter-button" data-detail-tag="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`
        ).join("")}</div>
        ${promptBlock("英文提示词", item.prompt, "modal-prompt-en")}
        ${promptBlock("中文参考", item.promptZh)}
        ${promptBlock("负面提示词", item.negativePrompt)}
        <div class="modal-actions">
          <button type="button" class="button modal-copy-primary" data-copy="prompt" ${text(item.prompt).trim() ? "" : "disabled"}>复制提示词</button>
          <button type="button" class="button" data-copy="promptZh" ${text(item.promptZh).trim() ? "" : "disabled"}>复制中文</button>
          <button type="button" class="button" data-copy="all" ${copyText(item, "all") ? "" : "disabled"}>复制全部</button>
        </div>
        <p id="modal-copy-status" class="modal-copy-status" role="status" aria-live="polite"></p>
        <p id="modal-copy-stat" class="modal-copy-stat" title="统计仅保存在你自己的浏览器中"></p>
        <a class="modal-submit-link" href="${submissionURL}" target="_blank" rel="noopener">提交类似的提示词</a>
      </div>
    </div>`;
    const mediaElement = body.querySelector("img, video");
    const session = generation;
    const showMediaError = () => {
      if (generation !== session) return;
      if (mediaElement && mediaElement.tagName === "IMG"
        && mediaElement.dataset.coverFallback !== "true") {
        mediaElement.dataset.coverFallback = "true";
        mediaElement.src = placeholder;
        mediaElement.alt = `${String(item.title || "提示词")}的配色占位封面`;
        return;
      }
      if (mediaElement) mediaElement.hidden = true;
      document.getElementById("modal-media-status").hidden = false;
    };
    if (mediaElement) mediaElement.addEventListener("error", showMediaError);
    if (item.type === "video" && !video) showMediaError();
    updateCopyStat();
  }

  function updateCopyStat() {
    const stat = document.getElementById("modal-copy-stat");
    if (!stat || !currentItem || typeof Stats === "undefined") return;
    const count = Stats.getCopyCount(currentItem.id);
    stat.textContent = count > 0
      ? `你已复制过 ${count} 次 · 统计仅保存在你的浏览器中`
      : "统计仅保存在你的浏览器中";
  }

  function stopMedia() {
    content.querySelectorAll("video").forEach((video) => video.pause());
  }

  function clearCopyTimers() {
    copyTimers.forEach((timer) => clearTimeout(timer));
    copyTimers.clear();
  }

  function open(id) {
    const item = Store.getData().find((entry) => entry.id === id);
    if (!item || !init()) return;
    generation += 1;
    clearTimeout(closeTimer);
    clearCopyTimers();
    // 快速切换详情时取消旧的关闭任务，保留最初的页面滚动位置。
    if (resolveClose) resolveClose(false);
    resolveClose = null;
    closing = false;
    if (overlay.hidden) {
      scrollPosition = { x: window.scrollX, y: window.scrollY };
      hadBodyLock = document.body.classList.contains("modal-open");
      background = [...document.body.children].filter((element) => element !== overlay)
        .map((element) => [element, element.inert]);
      background.forEach(([element]) => { element.inert = true; });
      document.body.classList.add("modal-open");
    }
    returnId = id;
    returnTarget = [...document.querySelectorAll("#cards-grid .card[data-id]")]
      .find((card) => card.dataset.id === id) || document.activeElement;
    stopMedia();
    currentItem = item;
    renderContent(item);
    overlay.classList.remove("modal-closing");
    overlay.hidden = false;
    overlay.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
  }

  function finishClose() {
    if (!closing) return;
    clearTimeout(closeTimer);
    overlay.hidden = true;
    overlay.classList.remove("modal-closing");
    body.replaceChildren();
    currentItem = null;
    closing = false;
    document.body.classList.toggle("modal-open", hadBodyLock);
    background.forEach(([element, wasInert]) => { element.inert = wasInert; });
    background = [];
    window.scrollTo({ left: scrollPosition.x, top: scrollPosition.y, behavior: "instant" });
    const target = returnTarget && returnTarget.isConnected ? returnTarget
      : [...document.querySelectorAll("#cards-grid .card[data-id]")]
        .find((card) => card.dataset.id === returnId) || document.getElementById("search-input");
    if (target) target.focus({ preventScroll: true });
    const resolve = resolveClose;
    resolveClose = null;
    if (resolve) resolve(true);
  }

  // 返回完成通知，让标签筛选等到关闭动画和焦点恢复结束后再执行。
  function close() {
    if (!overlay || overlay.hidden) return Promise.resolve(false);
    if (closing) return closePromise;
    generation += 1;
    closing = true;
    clearCopyTimers();
    stopMedia();
    closePromise = new Promise((resolve) => { resolveClose = resolve; });
    overlay.classList.add("modal-closing");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finishClose();
    else closeTimer = setTimeout(finishClose, 240); // animationend 未触发时兜底。
    return closePromise;
  }

  function copyText(item, kind) {
    if (kind === "all") return [item.prompt, item.promptZh, item.negativePrompt]
      .map(text).filter((value) => value.trim()).join("\n\n");
    return kind === "prompt" || kind === "promptZh" ? text(item[kind]) : "";
  }

  async function copyPrompt(button) {
    if (button.disabled || !currentItem) return;
    const value = copyText(currentItem, button.dataset.copy);
    if (!value.trim()) return;
    const session = generation;
    button.dataset.originalLabel ||= button.textContent;
    clearTimeout(copyTimers.get(button));
    button.disabled = true;
    let copied = false;
    copied = await copyTextToClipboard(value, content);
    // 已关闭或切换到其他记录时，不再执行旧复制的降级与反馈。
    if (session !== generation || overlay.hidden || closing) return;
    button.disabled = false;
    const status = document.getElementById("modal-copy-status");
    status.classList.toggle("modal-copy-error", !copied);
    status.textContent = copied ? "已复制到剪贴板。" : "复制失败，请选中上方提示词后手动复制。";
    button.textContent = copied ? "已复制" : button.dataset.originalLabel;
    if (copied) {
      if (typeof Stats !== "undefined") Stats.recordCopy(currentItem.id);
      updateCopyStat();
      copyTimers.set(button, setTimeout(() => {
      if (session === generation && button.isConnected) button.textContent = button.dataset.originalLabel;
      copyTimers.delete(button);
      }, 1500));
    }
  }

  return Object.freeze({ open, close });
})();
