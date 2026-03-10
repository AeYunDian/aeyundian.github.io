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
    text: "友链",
    icon: "handshake",
    link: "/friends/",
  },
{
    text: "赞助",
    icon: "hand-holding-heart",
    link: "/sponsors/",
  },
]);
