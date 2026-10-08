// 数据单一来源是 data/prompts.json；以后接后台接口只改 getPrompts() 这一个函数。
"use strict";

async function getPrompts() {
  const response = await fetch("data/prompts.json");
  if (!response.ok) throw new Error("提示词数据读取失败：" + response.status);

  const payload = await response.json();
  // 同时兼容接口直接返回数组和当前带版本信息的对象。
  const items = Array.isArray(payload) ? payload : payload && payload.items;
  if (!Array.isArray(items)) throw new Error("提示词数据格式错误：缺少 items 数组");
  return items;
}
