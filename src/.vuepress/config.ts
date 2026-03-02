import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  head: [ ["link", { rel: "icon", href: "/logo.png" }] ],
  lang: "zh-CN",
  title: "undz",
  description: "undz博客",
  theme,
  chainWebpack(config) {
    // 遍历所有规则，找到处理 css 的规则，并将 css-loader 的 url 选项设为 false
    config.module.rules.forEach(rule => {
      // 检查规则是否处理 scss 文件（通常 test 包含 /\.css$/）
      if (rule.test && rule.test.toString().includes('css')) {
        rule.uses.forEach(use => {
          if (use.get('loader') === 'css-loader') {
            use.tap(options => {
              options.url = false;  // 完全禁用 url 解析
              return options;
            });
          }
        });
      }
    });
  }
});
