// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
  id: number;
  title: string;
  imgurl: string;
  desc: string;
  siteurl: string;
  tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
  {
    id: 1,
    title: "AeYunDian",
    imgurl:
      "https://net.undz.cn/static/jpg/f32f2e85fff0e6a63cacb7808cb0ecb2.jpg",
    desc: "Do one thing and do it well.",
    siteurl: "https://github.com/AeYunDian/",
    tags: [],
  },
  {
    id: 2,
    title: "ZyyOS",
    imgurl:
      "https://net.undz.cn/static/jpg/d6699b5e5ffacd0cea984f4c903d3742.jpg",
    desc: "ZyyOS 官方网站",
    siteurl: "https://zyy.undz.cn",
    tags: [],
  },
  {
    id: 3,
    title: "Bing🐣",
    imgurl: "https://liubing.me/logo.png",
    desc: "一个基于VuePress的个人博客",
    siteurl: "https://liubing.me",
    tags: [],
  },
  {
    id: 4,
    title: "墨七",
    imgurl: "https://file.mo7.cc/static/lxh_gif/lxh_71.gif",
    desc: "墨染七弦月，笔耕半亩田。",
    siteurl: "https://mo7.cc",
    tags: [],
  },
  {
    id: 5,
    title: "叶随风",
    imgurl: "https://cdn.undz.cn/gh/20000428/PictureBed/img/huge.png",
    desc: "世界和平,身体健康。",
    siteurl: "https://yesuifeng.cc/",
    tags: [],
  },
  {
    id: 6,
    title: "UpXuu's blog",
    imgurl: "https://upxuu.com/images/20260214145619.jpg",
    desc: "逐光而上",
    siteurl: "https://upxuu.com",
    tags: [],
  },
  {
    id: 7,
    title: "流欺の博客",
    imgurl: "https://tc.lqay.cn/LightPicture/2026/03/5f64e0f0f361e19c.png",
    desc: "嗯对就是个博客",
    siteurl: "https://blog.lqay.cn",
    tags: [],
  },
  {
    id: 8,
    title: "荒野孤灯",
    imgurl: "https://undz.cn/default-avatar.svg",
    desc: "荒野中的一盏孤灯，照亮夜里依然前行的人们!",
    siteurl: "https://www.80srz.com",
    tags: [],
  },
  {
    id: 9,
    title: "沈wai",
    imgurl: "https://q2.qlogo.cn/headimg_dl?dst_uin=3815085431&spec=0",
    desc: "暂无描述",
    siteurl: "https://api.undz.cn/addqq?uid=3815085431",
    tags: [],
  },
  {
    id: 10,
    title: "魏靖宇",
    imgurl: "https://q2.qlogo.cn/headimg_dl?dst_uin=1321482974&spec=0",
    desc: "暂无描述",
    siteurl: "https://api.undz.cn/addqq?uid=1321482974",
    tags: [],
  },
  {
    id: 11,
    title: "泠鸢",
    imgurl: "https://q2.qlogo.cn/headimg_dl?dst_uin=3132314904&spec=0",
    desc: "暂无描述",
    siteurl: "https://api.undz.cn/addqq?uid=3132314904",
    tags: [],
  },
  {
    id: 12,
    title: "墨汐",
    imgurl: "https://q2.qlogo.cn/headimg_dl?dst_uin=3821238370&spec=0",
    desc: "暂无描述",
    siteurl: "https://api.undz.cn/addqq?uid=3821238370",
    tags: [],
  },
  {
    id: 13,
    title: "AJie’sBlog",
    imgurl: "https://www.promptnet.cn/img/avatar.webp",
    desc: "记录 AI 学习与探索之旅",
    siteurl: "https://www.promptnet.cn/",
    tags: [],
  },
  {
    id: 14,
    title: "Liseezn'blog",
    imgurl: "https://blog.liseezn.top/logo.webp",
    desc: "分享学习，项目，及教程",
    siteurl: "https://blog.liseezn.top",
    tags: [],
  },
  {
    id: 15,
    title: "爱玩电脑的小羊",
    imgurl: "https://undz.cn/default-avatar.svg",
    desc: "暂无描述",
    siteurl: "https://shenkongyun.cn",
    tags: [],
  },
  {
    id: 16,
    title: "他说",
    imgurl: "https://090909.top/assets/images/logo.ico",
    desc: "梁栋烨的博客网站。",
    siteurl: "https://090909.top/",
    tags: [],
  },
  {
    id: 17,
    title: "李文君's Blog",
    imgurl: "https://loglib.cn/logo.png",
    desc: "记录生活，记录工作，记录身边有趣的事.",
    siteurl: "https://loglib.cn",
    tags: [],
  },
  {
    id: 18,
    title: "蛋蛋之家",
    imgurl: "https://wuqishi.com/dan.svg",
    desc: "一枚蛋蛋的自留地",
    siteurl: "https://wuqishi.com",
    tags: [],
  },
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
  return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
  const shuffled = [...friendsData];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
