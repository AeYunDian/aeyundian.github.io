import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "归档",
    icon: "timeline",
    link: "/timeline/",
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
  {
    text: "邮箱",
    icon: "book",
    link: "https://mail.io.hb.cn",
  },
]);
