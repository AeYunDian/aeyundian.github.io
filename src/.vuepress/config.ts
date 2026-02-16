import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Undz",
  description: "Yund的博客页面",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
