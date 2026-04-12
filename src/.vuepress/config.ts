import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  head: [ 
      ["link", { rel: "icon", href: "/logo.png" }],
      ['meta', { name: 'referrer', content: 'no-referrer' }],
      ['script', { src: '/global.js' }],
      ['link', { href: '/global.css', type: 'text/css', rel: 'stylesheet' }],
      ['link', { href: "https://cdn.jsdmirror.com/npm/firacode@6.2.0/distr/fira_code.css", rel: "stylesheet" }],
  ],
  lang: "zh-CN",
  title: "undz",
  description: "AeYunDian的博客",
  theme,
});
