<template>
  <div class="music-player-container" aria-label="音乐播放器">
    <div ref="playerContainer" class="aplayer-container"></div>
<div v-if="isLoading && type === 'playlist'" class="player-loading-mask">
  <div class="indeterminate-progress"></div>
  <p>{{ loadingMessage || '正在加载歌单，请稍候…' }}</p>
</div>
  </div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  server: { type: String, required: true, validator: (val) => ['netease'].includes(val) },
  type: { type: String, required: true, validator: (val) => ['song', 'playlist'].includes(val) },
  id: { type: String, required: true },
  autoplay: { type: Boolean, default: false },
  mini: { type: Boolean, default: false },
  fixed: { type: Boolean, default: false },
  showLrc: { type: Boolean, default: true },
  mutex: { type: Boolean, default: true },
  volume: { type: Number, default: 0.7 },
  listFolded: { type: Boolean, default: false },
  listMaxHeight: { type: String, default: '340px' },
});

// API 地址
const GET_IP_URL = 'https://nextmusic.toubiec.cn/api/getip';
const GET_SONG_URL_API = 'https://nextmusic.toubiec.cn/api/getSongUrl';
const GET_SONG_LRC_API = 'https://nextmusic.toubiec.cn/api/getSongLyric';
const GET_SONG_INFO_API = 'https://nextmusic.toubiec.cn/api/getSongInfo';
const GET_PLAYLIST_API = 'https://nextmusic.toubiec.cn/api/getPlaylist';
const SECRET_PREFIX = 'suxiaoqings:';
const LEVEL = 'exhigh';
const isLoading = ref(false);
const playerContainer = ref(null);
const loadingMessage = ref('');
let player = null;

// 仅支持 netease
if (props.server !== 'netease') {
  console.error(`[MusicPlayer] 不支持的平台: ${props.server}`);
}

// ---- 通用 API 函数（支持传 songId）----
async function getUserIP() {
  const res = await fetch(GET_IP_URL);
  const data = await res.json();
  if (data.code === 200 && data.data?.ip) return data.data.ip;
  throw new Error('获取 IP 失败');
}

function generateToken(ip) {
  return md5(SECRET_PREFIX + ip);
}

async function getSongUrl(token, songId = props.id) {
  const res = await fetch(GET_SONG_URL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: songId, level: LEVEL, token }),
  });
  const data = await res.json();
  if (data.code === 200 && data.data?.url) return data.data.url;
  throw new Error(`获取歌曲链接失败 (${songId})`);
}

async function getSongLrc(token, songId = props.id) {
  const res = await fetch(GET_SONG_LRC_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: songId, token }),
  });
  const data = await res.json();
  if (data.code === 200 && data.data?.lrc) {
    let lrcText = data.data.lrc;
    const timeTagRegex = /\[\d{1,5}:\d{2}(?:\.\d{2,3})?\]/;
    if (!timeTagRegex.test(lrcText)) {
      lrcText = "[00:00.00]*该歌词不支持自动滚动*\n" + lrcText.replace(/\n/g, '\n[99:99.99]');
    }
    return lrcText;
  }
  return '';
}

async function getSongInfo(token, songId = props.id) {
  const res = await fetch(GET_SONG_INFO_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: songId, token }),
  });
  const data = await res.json();
  if (data.code === 200 && data.data) return data.data;
  throw new Error(`获取歌曲信息失败 (${songId})`);
}

async function getPlaylist(token) {
  const res = await fetch(GET_PLAYLIST_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: props.id, token }),
  });
  const data = await res.json();
  if (data.code === 200 && data.data) return data.data;
  throw new Error('获取歌单信息失败');
}

// ---- 播放器初始化（接收音频列表）----
function initPlayer(audioList) {
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--vp-c-accent')
    .trim() || '#68a4ff';
  player = new APlayer({
    container: playerContainer.value,
    audio: audioList,
    autoplay: props.autoplay,
    theme: accentColor,
    volume: props.volume,
    mutex: props.mutex,
    mini: props.mini,
    fixed: props.fixed,
    lrcType: props.showLrc ? 1 : 0,
    listFolded: props.listFolded,
    listMaxHeight: props.listMaxHeight,
  });
}

function showError() {
  if (playerContainer.value) {
    playerContainer.value.innerHTML = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="100%" height="86" src="//music.163.com/outchain/player?type=2&id=${props.id}&auto=1&height=66"></iframe>`;
  }
}

// ---- 单曲加载 ----
async function loadSong() {
  try {
    const ip = await getUserIP();
    const token = generateToken(ip);
    const [url, lrc, info] = await Promise.all([
      getSongUrl(token),
      getSongLrc(token),
      getSongInfo(token),
    ]);
    const audioList = [{
      name: info.name,
      artist: info.singer,
      url: url,
      lrc: lrc,
      cover: info.picimg,
    }];
    initPlayer(audioList);
  } catch (err) {
    console.error(err);
    showError();
  }
}

// ---- 歌单加载（可控并发）----
async function loadPlaylist() {
  isLoading.value = true;
  let totalSongs = 0;
  let loadedCount = 0;
  const CONCURRENCY = 3; // 同时请求多少首歌（可根据需要调整，建议 3~5）

  try {
    // 1. 获取歌单基本信息
    const ip = await getUserIP();
    const token = generateToken(ip);
    const playlist = await getPlaylist(token);
    if (!playlist?.songs?.length) throw new Error('歌单无歌曲');

    totalSongs = playlist.songs.length;

    // 2. 先初始化一个空的播放器（立刻显示界面）
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--vp-c-accent')
      .trim() || '#68a4ff';
    player = new APlayer({
      container: playerContainer.value,
      audio: [],                    // 初始为空，后续动态添加
      autoplay: props.autoplay,
      theme: accentColor,
      volume: props.volume,
      mutex: props.mutex,
      mini: props.mini,
      fixed: props.fixed,
      lrcType: props.showLrc ? 1 : 0,
      listFolded: props.listFolded,
      listMaxHeight: props.listMaxHeight,
    });

    // 辅助函数：加载单个歌曲并添加到播放列表
    async function loadOneSong(song) {
      try {
        const [url, lrc, info] = await Promise.all([
          getSongUrl(token, song.id),
          getSongLrc(token, song.id),
          getSongInfo(token, song.id),
        ]);
        const audioObj = {
          name: info.name,
          artist: info.singer,
          url: url,
          lrc: lrc,
          cover: info.picimg,
        };
        if (player && player.list && player.list.add) {
          player.list.add(audioObj);
        }
        loadedCount++;
        updateLoadingMessage(`正在加载歌单：${loadedCount}/${totalSongs}`);
      } catch (err) {
        console.warn(`歌曲 ${song.name} 加载失败:`, err);
      }
    }

    // 控制并发的核心：依次取出歌曲，但最多同时执行 CONCURRENCY 个
    const songs = playlist.songs;
    let index = 0;
    async function runNext() {
      if (index >= songs.length) return;
      const currentIndex = index++;
      await loadOneSong(songs[currentIndex]);
      await runNext();
    }

    // 启动 CONCURRENCY 个并行任务（任务数不能超过歌曲总数）
    const workers = Array(Math.min(CONCURRENCY, songs.length))
      .fill()
      .map(() => runNext());
    await Promise.all(workers);

    // 全部处理完后的收尾
    const failedCount = totalSongs - loadedCount;
    if (loadedCount === 0) {
      alert('无法加载任何歌曲，可能因服务器繁忙或版权限制。');
      // 可选降级到 iframe
      // showError();
      return;
    }
    if (failedCount > 0) {
      alert(`歌单中共有 ${totalSongs} 首歌曲，其中 ${failedCount} 首加载失败（可能因版权限制）。`);
    }
  } catch (err) {
    console.error(err);
    showError();
  } finally {
    isLoading.value = false;
    updateLoadingMessage('');
  }
}

function updateLoadingMessage(msg) {
  loadingMessage.value = msg;
}
// ---- 监听 ID 变化 ----
watch(() => props.id, (newId, oldId) => {
  if (newId === oldId) return;
  if (player) {
    player.destroy();
    player = null;
  }
  if (playerContainer.value) playerContainer.value.innerHTML = '';
  if (props.type === 'playlist') loadPlaylist();
  else loadSong();
});

// ---- 生命周期 ----
onMounted(() => {
  if (props.type === 'playlist') loadPlaylist();
  else loadSong();
});

onBeforeUnmount(() => {
  if (player && !player.paused) player.pause();
});
</script>
<style scoped>
.player-loading-mask {
  align-items: center;
  text-align: center;
  justify-content: center;
}
/* 不确定进度条容器 */
.indeterminate-progress {
  width: 100%;
  max-width: 300px;
  margin: 0 auto 20px;
  height: 13px;
  background-color: #e2e8f0;
  border-radius: 1px;
  overflow: hidden;
  position: relative;
}

.indeterminate-progress::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: var(--vp-c-accent, #299764);
  animation: indeterminate-slide 3s linear infinite;
}


@keyframes indeterminate-slide {
  0% {
    left: -100%;
  }
  100% {
    left: 103%;
    /* 结束后不是直接从头开始，而是等一会 */
  }
}
</style>