import { hopeTheme } from "vuepress-theme-hope";
import { feedPlugin } from '@vuepress/plugin-feed'

import navbar from "./navbar.js";

import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://undz.cn",
  editLink: false,
  repoDisplay: false,
  author: {
    name: "AeYunDian",
    url: "https://undz.cn",
    email: "aeyundian@foxmail.com",
  },
  fullscreen: true,

  logo: "/logo.uhd.png",
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["SearchBox", "Outlook"],
  },
  repo: "AeYunDian",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: '<a href="https://icp.gov.moe/?keyword=20263044" target="_blank">萌ICP备20263044号</a><a href="/privacy_policy/zh-cn.html">隐私政策</a><a href="/cookie_policy/zh-cn.html">Cookie 政策</a></br> Running time: <span id="runtime-value">0 days 0 hours 0 minutes 0 seconds</span>',
  displayFooter: true,

  // 博客相关
  blog: {
    description: "Protect What You Love",
    intro: "/aboutus/zh-cn.html",
    avatar: "https://net.undz.cn/static/jpg/f32f2e85fff0e6a63cacb7808cb0ecb2.jpg",
    medias: {
      BiliBili: "https://space.bilibili.com/3494370328185235",
      Email: "mailto:aeyundian@foxmail.com",
      GitHub: "https://github.com/AeYunDian",
      QQ: "https://api.undz.cn/addqq?uid=2768223712",
      Gmail: "mailto:zhanghaoyu19281@gmail.com",
      Youtube: "https://www.youtube.com/@aeydundz",
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/diary/": {
        hint: "请键入密码",
        password: ["googleads"],
      },
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  hotReload: true,

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
    feed: {
      rss: true,
      atom: true,
      json: true,
      // 自定义频道信息
      channel: {
        title: "undz",
        link: "https://undz.cn",
        description: "Protect What You Love",
      },
    },
    //meting2: true,
    search: {
      maxSuggestions: 15,
      hotKeys: ['s', '/'],
      isSearchable: (page) => page.path !== '/',
    },

    comment: {
      provider: "Giscus",
      repo: "AeYunDian/aeyundian.github.io",
      repoId: "R_kgDORRf6GQ",
      category: "General",
      categoryId: "DIC_kwDORRf6Gc4C5A_E",
      mapping: "pathname",
      strict: false,
      reactionsEnabled: true,
      inputPosition: "bottom",
    },

    // watermark: {
    //   // 通过 enabled 函数控制只在关于页面显示
    //     enabled: (page) => page.path === '/about.html',  // 根据你的实际路径调整
    // },
    // notice: [
    //     {
    //         path: "/",
    //         showOnce: true,
    //         title: "Statement / 声明",
    //         confirm: true,
    //         content: "<p>UNDZ is the name of my technology project and has no connection with the Canadian underwear brand UNDZ (undz.ca).</p><p>This website and social media will never contain any content related to underwear or fashion, nor will they link to that brand. Please do not associate it with that brand!</p><p>UNDZ 是我的技术项目名称，与加拿大内衣品牌 UNDZ (undz.ca) 无任何关联。</p><p>此网站、社交媒体绝不出现任何与内衣、时尚相关的内容，也不会链接到该品牌。请不要带入该品牌！</p>",
    //         actions: [
    //             {
    //                 text: "查看详情 / View Details",
    //                 link: "/about#特此声明",
    //                 type: "primary",
    //             },
    //             { text: "确认 / Yes" },
    //         ],
    //     },
    // ],


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
        // // 2. 排除 demo 目录下的所有文件
        // if (filePathRelative && filePathRelative.startsWith('demo/')) {
        //   return false;
        // }
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
