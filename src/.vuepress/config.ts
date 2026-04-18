import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { webpackBundler } from '@vuepress/bundler-webpack';
export default defineUserConfig({
  base: "/",

  head: [
    ['script', { src: 'https://hm.baidu.com/hm.js?79463ae1d0aa94c4bc728b9486856172' }],
    ['script', { src: 'https://hm.baidu.com/hm.js?7002155a5e0994d38a3585bf5e60cdbc' }],
    
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    // PNG 128x128
    ["link", { rel: "icon", href: "/logo.png", type: "image/png", sizes: "128x128" }],
    // WebP
    ["link", { rel: "icon", type: "image/webp", href: "/logo.webp" }],
    // SVG
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    // ICO
    ["link", { rel: "icon", href: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    // 超高分辨率 PNG
    ["link", { rel: "icon", href: "/logo.uhd.png", type: "image/png", sizes: "1024x1024" }],
    // shortcut icon 兼容 IE 等旧浏览器
    ["link", { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon", sizes: "any" }],


    ['script', { src: '/global.js' }],
    ['link', { href: '/global.css', type: 'text/css', rel: 'stylesheet' }],

    ['link', { href: "https://cdn.jsdmirror.com/npm/firacode@6.2.0/distr/fira_code.css", rel: "stylesheet" }],
  ],
  lang: "zh-CN",
  title: "undz",
  description: "AeYunDian的博客",
  theme,
});
