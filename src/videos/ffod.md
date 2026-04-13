---
icon: film
index: false
date: 2026-03-22
title: '《原神》过场动画-「折枝落梦」'
draft: true
---

<!-- more -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loadPlayer = ref(false)

onMounted(() => {
  // 如果条件不满足，直接跳转，不渲染播放器
  if (typeof window.debugMode === 'undefined') {
    router.push('/videos/module_stopped_service.html')
  } else {
    loadPlayer.value = true   // 满足条件时才渲染播放器
  }
})
</script>

<ArtPlayer
  v-if="loadPlayer"
  src="https://oss.undz.cn/ffod/manifest.mpd"
  title="《原神》过场动画-「折枝落梦」"
  poster="https://oss.undz.cn/ffod/index.avif"
  ratio="16:9"
  fullscreen-web
  airplay
  pip
  flip
  fast-forward
  auto-playback
/>
<br>

我们在梦中提出问题，又在梦中得到解答。
当万千梦境重落世界，接下来便是道别的时刻。