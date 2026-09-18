"use strict";

// 统一维护站点配置，普通脚本通过全局常量共享。
const CONFIG = Object.freeze({
  siteName: "AI 提示词库",
  pageSize: 12,
  colorThreshold: 22, // CIE76 色差小于此值时匹配。
  types: Object.freeze(["all", "image", "video"]),
  typeLabels: Object.freeze({ all: "全部", image: "图片", video: "视频" }),
  categories: Object.freeze({
    scene: "场景",
    portrait: "人物",
    animal: "动物",
    product: "产品"
  }),
  models: Object.freeze(["Midjourney v7", "Sora", "即梦"])
});
