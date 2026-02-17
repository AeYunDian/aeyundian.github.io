import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  head: [
    // 添加这一行，'/my-icon.png' 是你的图标文件路径
    ["link", { rel: "icon", href: "/logo.png" }]
  ],
  lang: "zh-CN",
  title: "Undz",
  description: "Yund的博客页面",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
