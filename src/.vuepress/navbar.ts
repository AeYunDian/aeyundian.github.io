import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "归档",
    icon: "timeline",
    link: "/timeline/",
  },
  {
    text: "文章",
    icon: "book-open", // 父级图标
    children: [
      {
        text: "全部文章",
        icon: "file-lines",
        link: "/article/",
      },
      {
        text: "星标文章",
        icon: "star",
        link: "/star/",
      },
      {
        text: "分类",
        icon: "folder-open",
        link: "/category/",
      },
      {
        text: "标签",
        icon: "tag",
        link: "/tag/",
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
        link: "/contact_me/zh-cn.html",
      },
      {
        text: "繁體中文",
        icon: "ic:round-message",
        link: "/contact_me/zh-tw.html",
      },
      {
        text: "English",
        icon: "ic:round-message",
        link: "/contact_me/en-us.html",
      },
    ],
  },
  {
    text: "隐私政策",
    icon: "ic:baseline-privacy-tip", // 父级图标
    children: [
      {
        text: "简体中文",
        icon: "ic:baseline-privacy-tip",
        link: "/privacy_policy/zh-cn.html",
      },
      {
        text: "繁體中文",
        icon: "ic:baseline-privacy-tip",
        link: "/privacy_policy/zh-tw.html",
      },
      {
        text: "English",
        icon: "ic:baseline-privacy-tip",
        link: "/privacy_policy/en-us.html",
      },
    ],
  },
  {
    text: "关于",
    icon: "circle-info", // 父级图标
    children: [
      {
        text: "简体中文",
        icon: "circle-info",
        link: "/aboutus/zh-cn.html",
      },
      {
        text: "繁體中文",
        icon: "circle-info",
        link: "/aboutus/zh-tw.html",
      },
      {
        text: "English",
        icon: "circle-info",
        link: "/aboutus/en-us.html",
      },
    ],
  },
]);
