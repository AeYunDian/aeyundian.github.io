import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://undz.cn",
  editLink: false,
  repoDisplay: false,
  author: {
    name: "AeYunDian",
    url: "https://undz.cn",
    email: "admin@undz.cn",
  },
  fullscreen: true,

  logo: "/logo.uhd.png",
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["SearchBox","Outlook", "SettingsMenu"],
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
      QQ: "mailto:aeyundian@qq.com",
    
      Gmail: "mailto:zhanghaoyu19281@gmail.com",
      Youtube: "https://www.youtube.com/@aeundz",
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

   search: {
      maxSuggestions: 15,
      hotKeys: ['s', '/'],
      isSearchable: (page) => page.path !== '/',
      getExtraFields: (page) => {
        const extra: string[] = []
        
        // 标签
        const tags = page.frontmatter.tags
        if (Array.isArray(tags)) {
          extra.push(...tags.filter(t => typeof t === 'string'))
        } else if (typeof tags === 'string') {
          extra.push(tags)
        }
        
        // 分类
        let cats = page.frontmatter.category ?? page.frontmatter.categories
        if (typeof cats === 'string') {
          extra.push(cats)
        } else if (Array.isArray(cats)) {
          extra.push(...cats.filter(c => typeof c === 'string'))
        }
        
        // 日期
        const date = page.frontmatter.date
        if (date instanceof Date) {
          extra.push(date.toISOString().slice(0, 10))
        } else if (typeof date === 'string') {
          extra.push(date)
        }
        
        // 发布日期
        const pubDate = page.frontmatter.publishDate
        if (pubDate instanceof Date) {
          extra.push(pubDate.toISOString().slice(0, 10))
        } else if (typeof pubDate === 'string') {
          extra.push(pubDate)
        }
        
        return extra
      },
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

   watermark: {
      // 通过 enabled 函数控制只在关于页面显示
         enabled: (page) => page.path === '/about.html',  // 根据你的实际路径调整
    },
        notice: [
            {
                path: "/",
                showOnce: true,
                title: "Statement / 声明",
                confirm: true,
                content: "<p>UNDZ is the name of my technology project and has no connection with the Canadian underwear brand UNDZ (undz.ca).</p><p>This website and social media will never contain any content related to underwear or fashion, nor will they link to that brand. Please do not associate it with that brand!</p><p>UNDZ 是我的技术项目名称，与加拿大内衣品牌 UNDZ (undz.ca) 无任何关联。</p><p>此网站、社交媒体绝不出现任何与内衣、时尚相关的内容，也不会链接到该品牌。请不要带入该品牌！</p>",
                actions: [
                    {
                        text: "查看详情 / View Details",
                        link: "/about#特此声明",
                        type: "primary",
                    },
                    { text: "确认 / Yes" },
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
