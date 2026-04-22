---
date: 2026-04-22
title: '《轻涟 La vaguelette》'
icon: record-vinyl
---
   
<!-- more -->

<div id="audio-player"></div>

“头悬剑，足蹁跹，罪人舞步旋。”
“潸然泪，大权归，宣布无人罪。”

「轻涟」的法语翻译La vaguelette中，vague意为“浪潮、波浪”，后缀-ette意为“微小的”，隐喻了芙宁娜背负了500年的孤独和痛苦拯救枫丹，在枫丹的历史长河中也只不过是泛起了一个小小的涟漪……
“即便承受了许多痛苦与孤独，她也不曾质疑世界的美好。”

「成为人类，就意味着隐藏秘密，经历痛苦，与孤独相伴…即便如此你也愿意吗？」
《水的女儿》中的这句何尝不是芙芙的真实写照呢？正因她五百年来如一日的台前演出，方有神芙胜天半子的盛大谢幕。
这五百年来辛苦你了，这次为你找到了今后的方向而感到欣慰，希望下次在风花节上相遇时你能结识到更多朋友

::: info 关于音乐
《轻涟 La vaguelette》
作词: 哈尼 Hani / 项柳 Hsiang Liu / 三宝 Bao
作曲: 苑迪萌 Dimeng Yuan (HOYO-MiX)
编曲 Arranger：苑迪萌 Dimeng Yuan (HOYO-MiX)
演唱 Vocal Artist：Cécilia Cara
原声吉他 Acoustic Guitar：尤裴佳 Peijia You (HOYO-MiX)
电吉他 Electric Guitar：苑迪萌 Dimeng Yuan (HOYO-MiX)
合唱 Choir：唐卫青 Weiqing Tang / 何晓楠 Xiaonan He / 张怡 Yi Zhang / 柴锦斐 Jinfei Chai / 汤琳 Lin Tang / 陈瑞 Rui Chen / 喻佳星 Jiaxing Yu / 王碧华 Bihua Wang
乐队 Orchestra：龙之艺交响乐团 Art of Dragon Orchestra / Budapest Scoring Orchestra
录音棚 Recording Studio：上海广播大厦 Shanghai Media Group / Budapest Scoring
录音师 Recording Engineer：莫家伟 Jiawei Mo / Viktor Szabó
混音师 Mixing Engineer：李海 Hai Li
母带制作 Mastering Engineer：李海 Hai Li
出品 Produced by：HOYO-MiX
::: 

<script setup>
import { onMounted, onBeforeUnmount} from 'vue';

let player = null;
onMounted(() => {
    const GET_IP_URL = 'https://nextmusic.toubiec.cn/api/getip';
    const GET_SONG_URL_API = 'https://nextmusic.toubiec.cn/api/getSongUrl';
    const GET_SONG_LRC_API = 'https://nextmusic.toubiec.cn/api/getSongLyric';
    const GET_SONG_INFO_API = 'https://nextmusic.toubiec.cn/api/getSongInfo';
    const SECRET_PREFIX = 'suxiaoqings:';
    const SONG_ID = '2100334024';
    const LEVEL = 'jymaster';

    async function getUserIP() {
      const response = await fetch(GET_IP_URL);
      const result = await response.json();
      if (result.code === 200 && result.data && result.data.ip) {
        return result.data.ip;
      } else {
        throw new Error('获取 IP 失败');
      }
    }

    function generateToken(ip) {
      const raw = SECRET_PREFIX + ip;
      return md5(raw);
    }

    async function getSongUrl(token) {
      const response = await fetch(GET_SONG_URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: SONG_ID, level: LEVEL, token })
      });
      const result = await response.json();
      if (result.code === 200 && result.data && result.data.url) {
        return result.data.url;
      } else {
        throw new Error('获取歌曲链接失败: ' + JSON.stringify(result));
      }
    }

    async function getSongLrc(token) {
      const response = await fetch(GET_SONG_LRC_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: SONG_ID, token })
      });
      const result = await response.json();
if (result.code === 200 && result.data && result.data.lrc) {
    let lrcText = result.data.lrc;
    // 正则检查是否包含时间标签 [mm:ss] 或 [mm:ss.xx]
    const timeTagRegex = /\[\d{2}:\d{2}(?:\.\d{2,3})?\]/;
    if (!timeTagRegex.test(lrcText)) {
      // 不符合LRC格式，添加一行提示
      lrcText = "[00:00.00]*该歌词不支持自动滚动*\n" + lrcText.replace(/\n/g, '\n[999:99.99]');
    }
    console.info(lrcText);
    return lrcText;
  } else {
    console.info("歌词解析或获取失败，返回空");
    return '';
  }
    }

    async function getSongInfo(token) {
      const response = await fetch(GET_SONG_INFO_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: SONG_ID, token })
      });
      const result = await response.json();
      if (result.code === 200 && result.data) {
        return result.data;
      } else {
        throw new Error('获取歌曲信息失败: ' + JSON.stringify(result));
      }
    }

    function initPlayer(audioUrl, audioLrc, audioInfo) {
      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--vp-c-accent')
        .trim() || '#68a4ff';
      player = new APlayer({
        container: document.getElementById('audio-player'),
        lrcType: 1,
        audio: [{
          name: audioInfo.name,
          artist: audioInfo.singer,
          url: audioUrl,
          lrc: audioLrc,
          cover: audioInfo.picimg
        }],
        autoplay: false,
        theme: accentColor
      });
    }

    function showError() {
      const container = document.getElementById('audio-player');
      if (container) {
        container.innerHTML = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height="86" src="//music.163.com/outchain/player?type=2&id=${SONG_ID}&auto=1&height=66"></iframe>`;
      }
    }

 (async () => {
    try {
      const ip = await getUserIP();
      const token = generateToken(ip);
      const [audioUrl, audioLrc, audioInfo] = await Promise.all([
        getSongUrl(token),
        getSongLrc(token),
        getSongInfo(token)
      ]);
      initPlayer(audioUrl, audioLrc, audioInfo);
    } catch (err) {
      console.error(err);
      showError();
    }
  })();
  });


// 组件销毁时暂停（防止意外）
onBeforeUnmount(() => {
  if (player && !player.paused) {
    player.pause();
  }
});
</script>