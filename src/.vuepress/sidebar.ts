import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "日记",
      icon: "book",
      link: "diary/",
    },
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
    },
    {
      text: "项目",
      icon: "pen-ruler",
      prefix: "project/",
      children: "structure",
    },
    {
      text: "关于",
      icon: "circle-info",
      link: "/about",
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