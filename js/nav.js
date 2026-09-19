"use strict";

// 四个页面共用的顶部导航，只依赖 CONFIG 与 Favorites。
const Nav = (() => {
  const themeKey = "prompt-gallery-theme";
  const pages = Object.freeze([
    ["index.html", "概览"],
    ["library.html", "提示词库"],
    ["collections.html", "合集"],
    ["favorites.html", "我的收藏"]
  ]);
  let header = null;
  let themeButton = null;

  function currentFile() {
    const pathname = location.pathname || "/";
    const segments = pathname.split("/").filter(Boolean);
    const filename = pathname.endsWith("/")
      ? "index.html" : (segments[segments.length - 1] || "index.html");
    return filename.toLowerCase();
  }

  function navLink(filename, label, current) {
    const active = current === filename;
    const favoriteSlot = filename === "favorites.html"
      ? '<span class="nav-favorite-count" data-favorite-count hidden></span>' : "";
    return `<a class="site-nav-link" href="${filename}" data-page="${filename}"
      ${active ? 'aria-current="page"' : ""}>${label}${favoriteSlot}</a>`;
  }

  function readTheme() {
    try {
      return localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  }

  function setTheme(theme, persist = false) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    if (themeButton) {
      const dark = nextTheme === "dark";
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.textContent = dark ? "切换浅色" : "切换深色";
    }
    if (!persist) return;
    try {
      localStorage.setItem(themeKey, nextTheme);
    } catch {
      // 存储不可用时仍保留当前页面的主题状态。
    }
  }

  function updateFavoriteCount() {
    if (!header) return;
    const badge = header.querySelector("[data-favorite-count]");
    if (!badge) return;
    const count = Favorites.getAll().length;
    badge.hidden = count === 0;
    badge.textContent = count > 0 ? String(count) : "";
    badge.setAttribute("aria-label", count > 0 ? `${count} 项收藏` : "");
  }

  function init() {
    header = document.getElementById("site-header");
    if (!header) return;
    const current = currentFile();
    header.innerHTML = `<div class="site-nav-shell container">
      <div class="site-nav-main">
        <a class="site-nav-brand" href="index.html" aria-label="返回概览首页">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"/>
          </svg>
          <span data-site-name></span>
        </a>
        <nav class="site-nav-links" aria-label="主要导航">
          ${pages.map(([filename, label]) => navLink(filename, label, current)).join("")}
        </nav>
        <div class="site-nav-actions">
          <button id="theme-toggle" class="button" type="button" aria-pressed="false">切换深色</button>
        </div>
      </div>
    </div>`;
    header.querySelector("[data-site-name]").textContent = CONFIG.siteName;
    themeButton = header.querySelector("#theme-toggle");
    setTheme(readTheme());
    updateFavoriteCount();
    themeButton.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next, true);
    });
  }

  return Object.freeze({ init, setTheme, updateFavoriteCount });
})();

Nav.init();
