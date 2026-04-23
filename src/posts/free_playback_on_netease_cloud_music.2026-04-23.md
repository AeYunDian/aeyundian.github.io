---
title: 网易云音乐在线免费播放
icon: circle-play
date: 2026-04-23
---
免费在线解析、播放网易云音乐
<!-- more -->
<div class="music-loader">
  <div class="input-group">
    <input 
      v-model="userInput" 
      type="text" 
      placeholder="请输入网易云歌曲ID或网易云歌曲链接"
      @keyup.enter="loadSong"
    />
    <button @click="loadSong">加载播放器</button>
  </div>
  <MusicPlayer
    v-if="showPlayer"
    :key="playerKey"
    server="netease"
    type="song"
    :id="songId"
    :autoplay="autoPlay"
  />
</div>

<script setup>
import { ref, nextTick, onMounted  } from 'vue';

const userInput = ref('');
const songId = ref('');
const showPlayer = ref(false);
const playerKey = ref(0);
const autoPlay = ref(false);

/**
 * 从用户输入中提取网易云歌曲ID
 * 支持格式:
 * - 纯数字: "1492283139"
 * - 完整链接: "https://music.163.com/song?id=1492283139&..."
 * - 带问号的短链接: "https://music.163.com/song?id=1492283139"
 * - 任何包含 id=数字 的字符串
 */
function extractSongId(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  // 1. 如果输入全是数字，直接返回
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  // 2. 尝试用正则匹配 id=数字
  const match = trimmed.match(/[?&]id=(\d+)/);
  if (match) {
    return match[1];
  }
  // 3. 尝试匹配URL路径形式的 /song/数字
  const pathMatch = trimmed.match(/\/song\/(\d+)/);
  if (pathMatch) {
    return pathMatch[1];
  }
  return null;
}
  
function  getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function showError(msg) {
  const showErrParam = getUrlParam('show_err');
  // 如果 show_err 参数存在且为 false（字符串 'false'），则静默失败
  if (showErrParam === 'false') {
    console.warn('[静默] ' + msg);
    return;
  }
  alert(msg);
}

function loadSong(optionalInput = null) {
  const rawInput = optionalInput !== null ? optionalInput : userInput.value;
  const extractedId = extractSongId(rawInput);
  
  if (!extractedId) {
    showError('未能识别歌曲ID，请输入纯数字ID或正确的网易云歌曲链接');
    return false;
  }
  
  songId.value = extractedId;
  // 如果 optionalInput 不为空，也同步更新输入框的值
  if (optionalInput !== null && optionalInput !== userInput.value) {
    userInput.value = rawInput;
  }
  showPlayer.value = false;
  nextTick(() => {
    playerKey.value++;
    showPlayer.value = true;
  });
  return true;
}

onMounted(() => {
  let autoId = getUrlParam('url');
  autoPlay.value = getUrlParam('auto') === '1';
  if (autoId) {
    // 将获取到的参数作为输入，尝试加载
    const success = loadSong(autoId);
    if (success) {
        userInput.value = getUrlParam('url');
    } else {
      // 解析失败时，如果 show_err 不为 false，已在 loadSong 内部提示
      console.log('自动加载失败，参数:', autoId);
    }
  }
});
</script>
<style scoped>

.input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 2rem;
}

.input-group input {
  flex: 1;
  padding: 12px 18px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 40px;
  outline: none;
  transition: all 0.2s ease;
  background: #fff;
  color: #1e293b;
}

.input-group input:focus {
  border-color: var(--vp-c-accent, #68a4ff);
  box-shadow: 0 0 0 3px rgba(104, 164, 255, 0.2);
}

.input-group input::placeholder {
  color: #94a3b8;
  font-size: 14px;
}

.input-group button {
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 40px;
  background:  var(--vp-c-accent, #3b82f6);
  color: white;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.input-group button:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

.input-group button:active {
  transform: translateY(1px);
}

/* 深色模式适配（如果你的博客支持暗色主题） */
@media (prefers-color-scheme: dark) {
  .input-group input {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
  }
  .input-group input:focus {
    border-color: var(--vp-c-accent, #68a4ff);
  }
  .input-group input::placeholder {
    color: #64748b;
  }
}
</style>