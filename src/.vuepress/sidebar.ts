import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
    },
    {
      text: "项目",
      icon: "compass-drafting",
      prefix: "project/",
      children: "structure",
    },
    {
      text: "关于网站",
      icon: "circle-info", // 父级图标
      children: [
        {
          text: "隐私政策",
          icon: "ic:baseline-privacy-tip", // 父级图标
          children: [
            {
              text: "简体中文",
              icon: "ic:baseline-privacy-tip",
              link: "/privacy_policy/zh-cn",
            },
            {
              text: "繁體中文",
              icon: "ic:baseline-privacy-tip",
              link: "/privacy_policy/zh-hk",
            },
            {
              text: "English",
              icon: "ic:baseline-privacy-tip",
              link: "/privacy_policy/en-us",
            },
          ],
        },
        {
          text: "Cookie 政策",
          icon: "ic:baseline-cookie", // 父级图标
          children: [
            {
              text: "简体中文",
              icon: "ic:baseline-cookie",
              link: "/cookie_policy/zh-cn",
            },
            {
              text: "繁體中文",
              icon: "ic:baseline-cookie",
              link: "/cookie_policy/zh-hk",
            },
            {
              text: "English",
              icon: "ic:baseline-cookie",
              link: "/cookie_policy/en-us",
            },
          ],
        },

        {
          text: "联系我",
          icon: "ic:round-message", // 父级图标
          children: [
            {
              text: "简体中文",
              icon: "ic:round-message",
              link: "/contact_me/zh-cn",
            },
            {
              text: "繁體中文",
              icon: "ic:round-message",
              link: "/contact_me/zh-hk",
            },
            {
              text: "English",
              icon: "ic:round-message",
              link: "/contact_me/en-us",
            },
          ],
        },
        {
          text: "关于此网站",
          icon: "circle-info", // 父级图标
          children: [
            {
              text: "简体中文",
              icon: "circle-info",
              link: "/aboutus/zh-cn",
            },
            {
              text: "繁體中文",
              icon: "circle-info",
              link: "/aboutus/zh-hk",
            },
            {
              text: "English",
              icon: "circle-info",
              link: "/aboutus/en-us",
            },
          ],

        },
      ],
    },
  ],
  "/diary/": [
    {
      text: "上一级",
      icon: "arrow-up",
      link: "/list/",
    },
    {
      text: "日记",
      icon: "book",
      prefix: "",
      children: "structure",
    },
  ],
  "/videos/": [
    {
      text: "上一级",
      icon: "arrow-up",
      link: "/list/",
    },
    {
      text: "视频",
      icon: "film",
      prefix: "",
      children: "structure",
    },
  ],

});