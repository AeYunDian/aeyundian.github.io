import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  head: [
    ["link", { rel: "icon", href: "/logo.png" }]
  ],
  lang: "zh-CN",
  title: "UNDZ",
  description: "UNDZ博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
