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
      text: "隐私政策",
      icon: "ic:baseline-privacy-tip",
      prefix: "privacy_policy/",
      children: "structure",
    },
    {
      text: "联系我",
      icon: "ic:round-message",
      prefix: "contact_me/",
      children: "structure",
    },
    {
      text: "关于",
      prefix: "aboutus/",
      icon: "circle-info",
      children: "structure",
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