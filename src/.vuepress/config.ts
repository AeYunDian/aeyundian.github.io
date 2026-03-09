import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  head: [ 
      ["link", { rel: "icon", href: "/logo.png" }],
      ['meta', { name: 'referrer', content: 'no-referrer' }],
      [
          "link",
          {
              href: "https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css",
              rel: "stylesheet",
          },
      ],
  ],
  lang: "zh-CN",
  title: "undz",
  description: "undz博客",
  theme,
});
