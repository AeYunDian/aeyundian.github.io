import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  head: [
    // PNG 128x128
    ["link", { rel: "icon", href: "/logo.png", type: "image/png", sizes: "128x128" }],
    // WebP
    ["link", { rel: "icon", type: "image/webp", href: "/logo.webp" }],
    // SVG
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    // ICO
    ["link", { rel: "icon", href: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    // 超高分辨率 PNG
    ["link", { rel: "icon", href: "/logo.uhd.png", type: "image/png", sizes: "1024x1024" }],
    // shortcut icon 兼容 IE 等旧浏览器
    ["link", { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon", sizes: "any" }],

    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],
    ['script', { src: '/global.js' }],
    ['link', { href: '/global.css', type: 'text/css', rel: 'stylesheet' }],
    ['link', { href: "https://cdn.jsdmirror.com/npm/firacode@6.2.0/distr/fira_code.css", rel: "stylesheet" }],
  ],
  lang: "zh-CN",
  title: "undz",
  description: "AeYunDian的博客",
  theme,
});
