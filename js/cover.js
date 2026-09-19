"use strict";

// 根据记录配色生成卡片与详情共用的 SVG 占位封面。
function getCoverPlaceholder(item = {}) {
  const colors = Array.isArray(item.colors)
    ? item.colors.filter((color) => typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color)) : [];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
      <rect width="640" height="480" fill="${colors[0] || "#DFE4EF"}"/>
      <circle cx="480" cy="130" r="180" fill="${colors[1] || "#B9C5DC"}" opacity=".8"/>
      <path d="M0 400 220 180 430 420 640 240V480H0Z" fill="${colors[2] || "#8494B0"}" opacity=".8"/>
    </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}
