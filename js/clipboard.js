"use strict";

// 统一处理安全上下文剪贴板与 file:// 环境下的降级复制。
async function copyTextToClipboard(value, fallbackRoot) {
  const text = String(value ?? "");
  if (!text) return false;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 继续尝试传统 execCommand 方案。
  }
  let textarea;
  const focused = document.activeElement;
  try {
    textarea = document.createElement("textarea");
    textarea.className = "clipboard-fallback";
    textarea.value = text;
    textarea.readOnly = true;
    textarea.setAttribute("aria-label", "复制临时文本");
    (fallbackRoot || document.body).append(textarea);
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    if (textarea) textarea.remove();
    if (focused && focused.isConnected) focused.focus({ preventScroll: true });
  }
}
