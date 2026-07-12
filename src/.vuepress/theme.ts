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
  repo: "AeYunDian",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: `<a href="https://icp.gov.moe/?keyword=20263044" target="_blank">萌ICP备20263044号</a></br> 
  <a href="/privacy_policy/zh-cn.html">《隐私政策》</a>&nbsp;&nbsp;<a href="/cookie_policy/zh-cn.html">《Cookie 政策》</a>&nbsp;&nbsp;
  <a href="/terms/zh-cn.html">《服务条款》</a></br> 
  Running time: <span id="runtime-value">0 days 0 hours 0 minutes 0 seconds</span></br>
  本网站为非政府官方站点，仅为 韵典 自有信息发布与服务平台。`,
  displayFooter: true,

  // 博客相关
  blog: {
    description: "Do one thing and do it well",
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
        description: "Do one thing and do it well",
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
      componentOptions: {
        share: {
          services: [
            // 内置服务（字符串） 
            "weibo", 'twitter',
            'facebook', 'reddit',
            'telegram', 'whatsapp',
            'email', 'wordpress',
            'line', 'flipboard',
            'pinterest', 'evernote', 'messenger', 'buffer', 'vk',
            // 自定义服务（对象）
            {
              name: "qzone",           // 服务名称
              link: "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=[url]",
              action: "popup",             // 可选: open / navigate / popup / qrcode
              color: " #0985DD",            // 图标主题色
              shape: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M852 688c36-6 18-19 3-18-26 3-64 3-106 2l5 29a1047 1047 0 0 0 98-13m110-278a8 8 0 0 0-7-6l-301-44L520 89c-3-6-13-6-16 0L370 360 69 404a9 9 0 0 0-7 6 9 9 0 0 0 3 9l217 211-51 299a8 8 0 0 0 3 8c3 3 6 3 10 1l268-141 269 141 4 1 5-1c3-2 4-5 3-9l-39-228c-43 3-86 5-122 5-123 0-215-6-216-6-11-1-21-8-24-19a26 26 0 0 1 10-28l247-180c-159-13-293-10-294-10-21 1-41-6 1-23 7-3 174-38 367-12 11 1 19 9 22 19a26 26 0 0 1-10 28L493 651c44 9 160 19 256 21l-7-42 217-211a8 8 0 0 0 3-9"></path></svg>`,           // SVG path 或形状[reference:6]
            },
            {
              name: "qq",           // 服务名称
              link: "http://connect.qq.com/widget/shareqq/index.html?url=[url]&title=[title]&desc=[description]&sharesource=qzone&summary=[summary]&pics=[image]",
              action: "popup",             // 可选: open / navigate / popup / qrcode
              color: "#5eaade",            // 图标主题色
              shape: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M863 626c-17-58-38-107-70-186 5-209-82-378-281-378-202 0-286 172-281 378-32 80-52 128-70 186-39 123-26 174-17 175 20 3 79-93 79-93 0 56 28 127 89 179-29 9-96 34-80 61 13 21 220 14 280 7 60 7 267 14 280-7 16-27-51-52-80-61 61-52 89-124 89-179 0 0 59 96 79 93 9-1 22-52-17-175"></path></svg>`,
            },
            {
              name: "qrcode",           // 服务名称
              link: "https://api.undz.cn/qrcode?text=[url]&type=png&level=M&size=20&margin=2",
              action: "popup",             // 可选: open / navigate / popup / qrcode
              color: "#999",            // 图标主题色
              shape: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M409.6 68H136.533c-37.5 0-68 31-68 68v273.6c0 37.547 31 68 68 68H409.6c37.547 0 68-31 68-68V136.533c0-37.5-31-68-68-68zm-68 256c0 9-8 17-17 17H222.2c-9 0-17-8-17-17V221.6c0-9 8-17 17-17h102.4c9 0 17 8 17 17V324zM887.734 68H614.4c-37.547 0-68 31-68 68v273.6c0 37.547 31 68 68 68h273c37.5 0 68-31 68-68V136.533c0-37.5-31-68-68-68zm-68 256c0 9-8 17-17 17h-102.4c-9 0-17-8-17-17V221.6c0-9 8-17 17-17h102.4c9 0 17 8 17 17V324zM409.6 546.133H136.533c-37.5 0-68 31-68 68v273c0 37.5 31 68 68 68H409.6c37.547 0 68-31 68-68V614.4c0-37.547-31-68-68-68zm-68 256c0 9-8 17-17 17H222.2c-9 0-17-8-17-17v-102.4c0-9 8-17 17-17h102.4c9 0 17 8 17 17v102.4zm580-86.4H785V768c0 9.5-8 17-17 17h-52v137.6c0 18.8 15 34 34.134 34.133H921.6c18.8 0 34.133-15 34.133-34.133V749.8c0-18.774-15-34.134-34.133-34.134zm-204.8-137.6c0-18.8-15-34.133-34.133-34.133H579.2c-18.8 0-34 15-34 34.133v104.534c0 18.8 15 34 34 34.133h103.467c18.8 0 34.133-15 34.133-34.133V578.133zm-85.333 275.2H563.2c-9.5 0-17 8-17 17v68c0 9.5 8 17 17 17h68c9.5 0 17-8 17-17V870.4c0-9.5-8-17-17-17zm307.2-307.2H870.4c-9.5 0-17 8-17 17v68c0 9.5 8 17 17 17h68c9.5 0 17-8 17-17V563.2c0-9.5-8-17-17-17z"></path></svg>`,
            },
            {
              name: "tumblr",           // 服务名称
              link: "https://www.tumblr.com/share/link?url=[url]&name=[title]&description=[description]",
              action: "popup",
              color: "#001935",            // 图标主题色
              shape: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M787 912V767c-47 32-92 44-139 44-21 0-40-3-66-16-17-12-26-19-29-37-9-12-13-45-13-99V431h209V294H540V62H415c-8 54-20 91-29 115-12 30-33 54-62 80-30 21-58 37-87 49v125h95v315c0 32 4 65 17 91a213 213 0 0 0 120 108 389 389 0 0 0 213 4c34-9 70-21 105-37"></path></svg>`,
            },
            {
              name: "linkedin",           // 服务名称
              link: "https://www.linkedin.com/sharing/share-offsite/?url=[url]",
              action: "popup",             // 可选: open / navigate / popup / qrcode
              color: "#4376B1",            // 图标主题色
              shape: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M912 598v297H740V618c0-69-24-117-86-117-48 0-76 32-89 63-4 11-5 27-5 42v289H388s3-469 0-517h172v72l-1 3h1v-3c23-35 63-84 155-84 113 0 197 74 197 232M209 130c-59 0-97 37-97 88 0 50 37 90 95 90h1c60 0 97-40 97-90-1-51-37-88-96-88m-87 765h171V378H122z"></path></svg>`,
            },
            {
              name: "sms",           // 服务名称
              link: "sms:?body=[title]： [url]，[description]",
              action: "popup",             // 可选: open / navigate / popup / qrcode
              color: "#ffbd00",            // 图标主题色
              shape: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M512 811c220 0 400-145 400-324S732 162 512 162c-221 0-400 146-400 325 0 70 27 135 74 188-3 39-18 73-33 99l-24 33-8 9-2 2v1c-7 7-9 18-6 27 4 9 13 16 24 16 44 0 90-14 127-31 36-15 66-34 85-47 50 18 105 28 163 28zM262 445c0-32 25-58 57-58h30a25 25 0 1 1 0 50h-30a7 7 0 0 0-4 14l46 31a58 58 0 0 1-32 104h-42a25 25 0 1 1 0-50h42c4 0 8-3 8-7 0-3-2-5-4-6l-46-30a58 58 0 0 1-25-48m432-58h30a25 25 0 1 1 0 50h-30a7 7 0 0 0-4 14l46 31a57 57 0 0 1-32 104h-42a25 25 0 1 1 0-50h42c4 0 8-3 8-7 0-3-2-5-4-6l-46-30a58 58 0 0 1 32-106m-237 10 55 74 55-74a25 25 0 0 1 45 15v149a25 25 0 0 1-50 0v-74l-30 39c-5 7-13 10-20 10s-16-3-20-10l-30-39v74a25 25 0 0 1-50 0V412a25 25 0 0 1 45-15"></path></svg>`,
            },
            {
              name: "snapchat",           // 服务名称
              link: "https://www.snapchat.com/share?link=[url]",
              action: "popup",
              color: "#FFFC00",            // 图标主题色
              shape: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M961 740c-4-13-23-22-23-22l-5-3a343 343 0 0 1-130-108c-15-24-23-43-26-54-2-7-1-10 0-13s5-6 7-8a1380 1380 0 0 1 38-25l21-14c15-10 25-21 31-32 7-15 8-31 2-46-8-22-28-34-53-34l-17 1-40 13-1-1c1-28 2-67-1-103a221 221 0 0 0-58-140c-10-12-29-30-58-47-40-23-86-34-136-34s-96 11-136 34a232 232 0 0 0-95 102c-11 24-18 52-21 85a807 807 0 0 0-2 104c-12-4-25-10-40-13a77 77 0 0 0-17-2c-25 0-45 13-53 35-6 15-5 31 2 46 6 11 16 22 31 32l21 14 38 25c1 1 6 4 7 8 2 3 2 6 0 13a245 245 0 0 1-74 108c-23 21-51 39-82 54a50 50 0 0 0-6 3c-2 1-18 10-22 22-5 18 9 35 23 44a241 241 0 0 0 80 31c3 1 8 3 11 6 3 4 4 10 5 15 2 10 6 22 17 30 13 9 30 9 51 10 22 1 49 2 81 12 14 5 27 13 42 23 32 19 72 43 139 43 68 0 108-24 140-43 15-10 28-18 42-22 31-11 58-12 80-13 21 0 38-1 51-10s16-22 18-32l4-13c3-3 8-5 11-6a485 485 0 0 1 13-3c16-5 36-10 61-24 30-17 32-38 29-48"></path></svg>`,
            },
          ]
        }
      }
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
