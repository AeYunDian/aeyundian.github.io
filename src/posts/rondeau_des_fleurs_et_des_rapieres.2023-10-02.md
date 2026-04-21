---
date: 2026-04-21
title: '《花与剑的轮舞》'
icon: record-vinyl
---
   
<!-- more -->

<div id="audio-player"></div>


“如果只能救五成的人，我就去尽力救下六成的人！”
“没有人能评价我，没有人能审判我，没有人能原谅我。”
“我并未觉得自己有任何负罪，如今伟业惜溃，但世界已然得救。”
“任由他人责骂与嘲笑我吧。我的内心已经空落，徒余一种渴望。”
“我也想回到最开始的时候，水仙的勇者还没有踏上旅程的时候。”

::: info 关于音乐
《花与剑的轮舞 Rondeau des fleurs et des rapieres》
作曲 : 苑迪萌 Dimeng Yuan (HOYO-MiX)
编曲 Arranger：苑迪萌 Dimeng Yuan (HOYO-MiX)
指挥 Conductor：Robert Ziegler
乐队 Orchestra：伦敦交响乐团 London Symphony Orchestra
玻璃琴 Glass Harmonica：Alasdair Malloy
乐杯 Glass Harp：Alasdair Malloy
手风琴 Accordion：Milos Milivojevic
曼陀林 Mandolin：Nigel Woodhouse
古典吉他 Classical Guitar：Richard Durrant
鲁特琴 Lute：Lynda Sayce
录音棚 Recording Studio：Abbey Road Studios / Angel Studios / Air-Edel Recording Studios
录音师 Recording Engineer：Simon Rhodes / Oliver Thompson
音频编辑 Editing Engineer：Chris Parker
混音师 Mixing Engineer：Simon Rhodes
母带制作 Mastering Engineer：黄巍 Zach Huang
出品 Produced by：HOYO-MiX
::: 

<script setup>
  (function() {
    // API 配置
    const GET_IP_URL = 'https://nextmusic.toubiec.cn/api/getip';
    const GET_SONG_URL_API = 'https://nextmusic.toubiec.cn/api/getSongUrl';
    const GET_SONG_LRC_API = 'https://nextmusic.toubiec.cn/api/getSongLyric';
    const GET_SONG_INFO_API = 'https://nextmusic.toubiec.cn/api/getSongInfo';
    const SECRET_PREFIX = 'suxiaoqings:';
    //const SONG_ID = '2085836773';
    const LEVEL = 'jymaster'; 
    const SONG_ID = '2085836773';
    let player = null;

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
        body: JSON.stringify({
          id: SONG_ID,
          level: LEVEL,
          token: token
        })
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
        body: JSON.stringify({
          id: SONG_ID,
          token: token
        })
      });
      const result = await response.json();
      if (result.code === 200 && result.data && result.data.lrc) {
        return result.data.lrc;
      } else {
        throw new Error('获取歌曲歌词失败' + JSON.stringify(result));
      }
    }

    async function getSongInfo(token) {
      const response = await fetch(GET_SONG_INFO_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: SONG_ID,
          token: token
        })
      });
      const result = await response.json();
      if (result.code === 200 && result.data) {
        return result.data;
      } else {
        throw new Error('获取歌曲信息失败' + JSON.stringify(result));
      }
    }

    function initPlayer(audioUrl, audioLrc, audioInfo) {
      player = new APlayer({
        container: document.getElementById('audio-player'),
        audio: [{
          name: audioInfo.name,
          artist: audioInfo.singer,
          url: audioUrl,
          lrc: audioLrc,
          cover: audioInfo.picimg
        }],
        autoplay: false,
        theme: '#ff7b72'
      });
    }

    function showError(msg) {
      const container = document.getElementById('audio-player');
      container.innerHTML = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height="86" src="//music.163.com/outchain/player?type=2&id=2085836773&auto=1&height=66"></iframe>`;
    }

    async function main() {
      try {
        const ip = await getUserIP();
        const token = generateToken(ip);
        const audioUrl = await getSongUrl(token);
        const audioLrc = await getSongLrc(token);
        const audioInfo = await getSongInfo(token);
        initPlayer(audioUrl, audioLrc, audioInfo);
      } catch (err) {
        console.error(err);
        showError(err.message);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('load', main);
    } else {
      main();
    }
  })();
</script>