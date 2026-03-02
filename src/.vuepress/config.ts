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

  chainWebpack(config) {
    // 修改 css-loader 选项，不对以 '/' 开头的 url 进行解析
    config.module
      .rule('scss')
      .oneOf('normal')
      .use('css-loader')
      .tap(options => {
        options.url = { filter: (url) => !url.startsWith('/') }
        return options
      })
  }
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
