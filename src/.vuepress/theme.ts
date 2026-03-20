import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  darkmode: "disable",
  hostname: "https://undz.cn",
  editLink: false,
  repoDisplay: false,
  author: {
    name: "Yund",
    url: "https://undz.cn",
    email: "admin@undz.cn",
  },
  fullscreen: true,
  favicon: "/favicon.ico",
  logo: "/logo.png",
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Outlook", "SettingsMenu"],
  },
  repo: "AeYunDian",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: '<a href="https://icp.gov.moe/?keyword=20263044" target="_blank">萌ICP备20263044号</a></br> Running time: <span id="runtime-value">0 days 0 hours 0 minutes 0 seconds</span>',
  displayFooter: true,

  // 博客相关
  blog: {
    description: "Protect What You Love",
    intro: "/about.html",
    avatar: "/ma.ico",
    medias: {
      BiliBili: "https://space.bilibili.com/3494370328185235",
      Email: "mailto:admin@undz.cn",
      GitHub: "https://github.com/AeYunDian",
      Gmail: "mailto:zhanghaoyu19281@gmail.com",
      Youtube: "https://www.youtube.com/@yspost",
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/demo/encrypt.html": {
        hint: "1~3",
        password: "123",
      },
      "/diary/": {
        hint: "( ? ) the world",
        password: ["fuck", "hello"],
      }
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,

    math: {
    // 启用前安装 katex
         type: "katex",
    //   // 或者安装 @mathjax/src
    //    // type: "mathjax",
     },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {
    // 启用之前需安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
   // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },
   watermark: {
      // 通过 enabled 函数控制只在关于页面显示
         enabled: (page) => page.path === '/about.html',  // 根据你的实际路径调整
    },
        notice: [
            {
                path: "/",
                showOnce: true,
                title: "声明",
                confirm: true,
                content: "<p>UNDZ 是我的技术项目名称，与加拿大内衣品牌 UNDZ (undz.ca) 无任何关联。</p><p>此网站、社交媒体绝不出现任何与内衣、时尚相关的内容，也不会链接到该品牌。请不要带入该品牌！</p>",
                actions: [
                    {
                        text: "查看详情",
                        link: "/about#特此声明",
                        type: "primary",
                    },
                    { text: "确认" },
                ],
            },
        ],


    components: {
        components: [
            "ArtPlayer",
            "Badge",
            "BiliBili",
            "CodePen",
            "PDF",
            "Share",
            "SiteInfo",
            "StackBlitz",
            "VPBanner",
            "VPCard",
            "VidStack",
        ],
    },
   blog: {
    filter: ({ filePathRelative, frontmatter }) => {
      // 1. 如果文章标记为草稿（draft: true），则不视为博客文章
      if (frontmatter.draft) {
        return false;
      }
      // 2. 排除 demo 目录下的所有文件
      if (filePathRelative && filePathRelative.startsWith('demo/')) {
        return false;
      }
      // 3. 其他情况均视为文章
      return true;
    },
  },
    icon: {
      prefix: "fa6-solid:",
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
