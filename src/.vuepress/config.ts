import { defineUserConfig } from "vuepress";
import path from 'path';
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

  chainWebpack(config) {
    // 添加别名 @font 指向 .vuepress/public/font
    config.resolve.alias.set('@font', path.resolve(__dirname, 'public/font'));

    // 可选：确保 css-loader 不对带 ~ 的路径做特殊处理（默认已支持）
    // 但通常不需要额外配置，因为 ~ 就是用来触发别名解析的
  }
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
