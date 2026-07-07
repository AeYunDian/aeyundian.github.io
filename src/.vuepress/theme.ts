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
  Running time: <span id="runtime-value">0 days 0 hours 0 minutes 0 seconds</span>`,
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
              name: "adsterra",           // 服务名称
              link: "https://www.effectivecpmnetwork.com/px14wc23v?key=32badbbb66074811945dcbc90128395b",
              action: "popup",             // 可选: open / navigate / popup / qrcode
              color: " #E33909",            // 图标主题色
              shape: `<svg width="96" height="96" version="1.1" xmlns="http://www.w3.org/2000/svg" desc="Created with imagetracer.js version 1.2.6" ><path fill="rgb(227,57,9)" stroke="rgb(227,57,9)" stroke-width="1" opacity="0.996078431372549" d="M 0.5 0 L 24.5 0 L 27 1.5 L 25 2.5 L 28.5 4 L 30 3.5 L 30 5.5 L 30.5 7 L 32 6.5 Q 31.3 8.8 33.5 8 L 38 14.5 L 38.5 16 L 39.5 14 L 40.5 16 L 42 15.5 L 35 34 L 33 34 Q 34.1 31.3 31.5 32 L 29 31 L 30 28.5 L 28.5 28 L 27 28.5 L 25 25.5 L 18 19.5 L 18.5 18 L 14 15.5 L 15 14.5 L 12 11.5 L 10.5 9 L 9.5 11 L 7.5 8 L 5 6.5 L 6 4 L 3.5 5 L 3 2.5 L 2.5 1 L 1.5 3 L 0.5 0 Z " /><path fill="rgb(227,57,9)" stroke="rgb(227,57,9)" stroke-width="1" opacity="0.996078431372549" d="M 49.5 31 L 60 58.5 L 59.5 60 L 61 60.5 L 58.5 62 L 58.5 60 Q 56.3 60.8 57 58.5 Q 53.9 56.7 55.5 55 L 53.5 54 L 52 54.5 L 48.5 49 L 47 48.5 L 47.5 47 L 43 45.5 L 49.5 31 Z " /><path fill="rgb(227,57,9)" stroke="rgb(227,57,9)" stroke-width="1" opacity="0.996078431372549" d="M 68 44 Q 71 43 70 46 Q 67 47 68 44 Z " /><path fill="rgb(227,57,9)" stroke="rgb(227,57,9)" stroke-width="1" opacity="0.996078431372549" d="M 70.5 47 Q 73.1 46.2 72 49.5 L 75 50.5 L 75.5 53 Q 77.3 50.2 79 54.5 Q 78.3 56.8 80.5 56 L 80 57.5 L 81.5 60 L 82.5 58 L 87 61.5 L 86 64.5 L 88.5 63 L 90 63.5 L 88.5 66 L 96 72.5 L 96 95.5 L 94.5 96 L 93 93 L 90.5 94 L 89.5 91 Q 87.3 91.8 88 89.5 L 86 89.5 Q 88.3 88.3 85.5 87 L 83 85.5 L 82.5 84 Q 81.3 86.3 80 83.5 L 81 81.5 L 79 81.5 L 78 79.5 Q 80.3 78.3 79 73.5 L 69 48.5 L 70.5 47 Z " /><path fill="rgb(227,57,9)" stroke="rgb(227,57,9)" stroke-width="1" opacity="0.996078431372549" d="M 37.5 61 L 38.5 63 L 37.5 61 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 42.5 16 L 42 17.5 L 41.5 19 L 41 17.5 L 42.5 16 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 47.5 57 L 46.5 59 L 47.5 57 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 54.5 59 L 55.5 61 L 54.5 59 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 40.5 61 L 39.5 63 L 40.5 61 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 36.5 62 L 37.5 64 Q 34.7 64.7 36.5 62 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 52.5 69 L 53.5 71 L 52.5 69 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 42.5 71 L 41.5 73 L 42.5 71 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 59.5 73 L 60.5 75 L 59.5 73 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 35.5 75 L 34.5 77 L 35.5 75 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 78.5 77 L 77.5 79 L 68 78.5 L 77.5 78 L 78.5 77 Z " /><path fill="rgb(247,210,200)" stroke="rgb(247,210,200)" stroke-width="1" opacity="1" d="M 20.5 78 L 31 78.5 L 20.5 79 L 20.5 78 Z " /><path fill="rgb(244,65,9)" stroke="rgb(244,65,9)" stroke-width="1" opacity="0.996078431372549" d="M 47.5 0 L 96 0 L 96 49 L 92 47.5 L 89.5 44 L 88 44 Q 89.5 40.3 86.5 41 L 84 40 L 85 37.5 L 78.5 34 L 77 34.5 L 78 31 L 75.5 32 L 74 29.5 L 74.5 28 Q 71.2 29.1 72 26.5 L 69 21 L 63 17.5 L 62.5 15 L 61 15.5 L 58.5 11 L 56.5 12 L 57 10.5 L 54.5 7 L 53.5 8 Q 51.8 4.9 50 6.5 L 50.5 5 Q 48.3 5.8 49 3.5 L 49.5 2 L 46 1.5 L 47.5 0 Z " /><path fill="rgb(244,65,9)" stroke="rgb(244,65,9)" stroke-width="1" opacity="0.996078431372549" d="M 56.5 16 L 57.5 18 L 56.5 16 Z " /><path fill="rgb(213,52,12)" stroke="rgb(213,52,12)" stroke-width="1" opacity="0.996078431372549" d="M 0.5 20 Q 3.2 25.4 6 23.5 L 5.5 25 L 7 25.5 L 6.5 27 L 11 30.5 L 11.5 34 L 14 33 L 15.5 36 L 18 37.5 L 17.5 39 L 21 40 Q 19.9 43.3 24 42 L 24 44.5 L 28 46 L 29 49.5 L 22.5 68 L 16 62.5 Q 16.7 59.9 14 61 L 14 59 L 12 59 L 12 57 L 9 57 L 9 54.5 L 7.5 55 L 6 54.5 L 7 52 Q 4.3 53.1 5 50.5 Q 3 46.8 1 48.5 L 0 46.5 L 0.5 20 Z " /><path fill="rgb(213,52,12)" stroke="rgb(213,52,12)" stroke-width="1" opacity="0.996078431372549" d="M 39.5 58 L 40 60.5 L 37 62.5 L 39.5 58 Z " /><path fill="rgb(213,52,12)" stroke="rgb(213,52,12)" stroke-width="1" opacity="0.996078431372549" d="M 48.5 69 L 52 70.5 L 51.5 72 Q 53.8 71.3 53 73.5 L 55.5 77 L 59 78 L 60 82 L 63 82 L 63 85 Q 66 84 65 87 L 68 87 L 68 90 Q 70.7 88.9 70 91.5 L 72 91.5 Q 71.3 93.8 73.5 93 L 75.5 96 L 73.5 96 L 48.5 96 L 46 93.5 L 43.5 90 L 41 88.5 Q 41.8 86.3 39.5 87 L 37 86 Q 38.5 82.3 35.5 83 L 34.5 80 Q 31.2 81.1 32 78.5 L 48.5 69 Z " /><path fill="rgb(220,56,11)" stroke="rgb(220,56,11)" stroke-width="1" opacity="0.996078431372549" d="M 0.5 1 L 1.5 3 L 2.5 1 L 4.5 4 Q 6.8 3.3 6 5.5 Q 3.7 6.8 6.5 8 L 9 9.5 L 9.5 11 L 10.5 9 L 15 14.5 L 14.5 16 L 19 18.5 L 18.5 20 L 21.5 22 L 23 21.5 L 22 22.5 L 25 25.5 Q 24.3 27.8 26.5 27 L 28 26.5 L 27 28.5 L 28.5 28 L 30 28.5 L 29 31 L 33 32 Q 31.9 34.7 34.5 34 L 34.5 35 L 33 35.5 L 33 37.5 L 30 49 L 28 49.5 L 29 51.5 L 28 51.5 L 27 49.5 L 28 46 L 24 44.5 L 24 42 L 21 42 Q 22.1 39.3 19.5 40 L 17 38.5 Q 19.2 37.3 16.5 36 L 14 34.5 Q 14.8 32.3 12.5 33 L 11 33.5 Q 11.8 27.8 7.5 27 L 6 26.5 L 6.5 25 L 0 19.5 L 0.5 1 Z " /><path fill="rgb(220,56,11)" stroke="rgb(220,56,11)" stroke-width="1" opacity="0.996078431372549" d="M 43 46 L 48 47.5 L 47.5 49 L 50 50.5 L 52.5 55 L 54.5 55 L 56 55.5 Q 53.5 57 57 58.5 Q 56.3 60.8 58.5 60 L 58.5 58 L 59.5 61 L 61 61.5 L 59.5 62 L 49.5 56 L 39.5 62 L 40 60.5 L 39 56.5 L 43 46 Z " /><path fill="rgb(220,56,11)" stroke="rgb(220,56,11)" stroke-width="1" opacity="0.996078431372549" d="M 52.5 70 L 67.5 79 L 77.5 79 L 79 80.5 L 79.5 82 L 81 81.5 L 80 83.5 L 83 84.5 L 84.5 87 L 88 89.5 Q 87.3 91.8 89.5 91 L 93 93 L 94 95.5 L 76.5 96 L 73 94.5 L 73.5 93 Q 71.3 93.8 72 91.5 L 70 91.5 Q 70.8 89.3 68.5 90 L 67 90.5 L 68 87 L 65 87 Q 66 84 63 85 L 63 82 Q 59.3 83.5 60 80.5 L 59 78 L 55.5 77 L 54 77.5 L 54 75.5 L 53 72 L 51 71.5 L 52.5 70 Z " /><path fill="rgb(234,62,11)" stroke="rgb(234,62,11)" stroke-width="1" opacity="0.996078431372549" d="M 25.5 0 L 47 0.5 L 46.5 2 L 50 2.5 L 49 5 L 53.5 8 Q 55.3 5.2 57 9.5 L 56 11.5 L 57.5 12 L 59 11.5 L 61.5 16 L 63 15.5 Q 62.5 19.5 65.5 20 L 69 21 L 72 28 L 76 29.5 L 75 31.5 L 76.5 31 Q 79.1 30.2 78 33.5 L 81 34.5 L 80.5 36 L 85 37.5 L 84 40 L 88 41 Q 86.5 44.8 89.5 44 L 93.5 49 Q 97.3 47.8 96 51.5 L 96 53.5 L 96 71.5 L 94.5 73 L 95 71.5 L 89.5 66 L 88 65.5 L 89.5 63 L 86.5 65 L 85 61 L 83 60.5 L 85 59.5 L 82.5 58 L 81.5 60 L 80 57.5 L 80.5 56 Q 78.3 56.8 79 54.5 Q 77 50.8 75 52.5 L 74.5 50 L 72 51.5 L 72 49.5 Q 73.1 46.2 70.5 47 Q 69.2 49.3 68 46.5 L 70 46 Q 71.1 43.3 68.5 44 L 67 44.5 L 68 42.5 L 66 42 Q 62.9 27.7 56.5 16 L 42.5 16 L 41.5 15 L 40 15.5 L 39.5 14 L 38.5 16 L 34 10.5 Q 36.3 9.3 33.5 8 L 31.5 9 L 32 7.5 L 31.5 6 L 30 6.5 L 28.5 4 L 25 2.5 L 27 1.5 L 25.5 0 Z " /><path fill="rgb(234,62,11)" stroke="rgb(234,62,11)" stroke-width="1" opacity="0.996078431372549" d="M 49.5 30 L 48.5 32 L 49.5 30 Z " /><path fill="rgb(255,255,255)" stroke="rgb(255,255,255)" stroke-width="1" opacity="1" d="M 43.5 16 Q 53.1 14.6 57 17 L 79 76.5 L 77.5 78 L 67.5 78 L 52.5 69 L 48.5 68 L 31.5 78 L 20 78 L 40 21.5 L 43.5 16 Z M 48 29 L 36 64 L 49 57 L 61 63 L 62 64 L 50 31 Q 51 28 48 29 Z " /><path fill="rgb(203,49,14)" stroke="rgb(203,49,14)" stroke-width="1" opacity="0.996078431372549" d="M 0.5 47 L 1.5 49 Q 3.2 46.3 5 50.5 L 7 53.5 L 6.5 55 L 8.5 54 L 9 57 L 12 57 L 12 59 L 14 59 L 14 61 Q 16.7 59.9 16 62.5 Q 18 66.2 20 64.5 Q 17.8 65.8 20.5 67 Q 23.1 66.2 22 69.5 L 19 77.5 L 20.5 79 Q 30.1 77.3 35 80.5 Q 32.8 81.7 35.5 83 L 37 83 Q 35.5 86.8 38.5 86 L 41 87 L 42.5 90 L 46 92.5 L 48 95.5 L 0 96 L 0.5 47 Z " /></svg>`,           // SVG path 或形状[reference:6]
            },
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
