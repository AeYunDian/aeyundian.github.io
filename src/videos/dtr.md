---
icon: film
draft: true
index: false
title: '《南京照相馆》'
date: 2026-03-22
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
  src="https://oss.undz.cn/dtr/manifest.mpd"
  title="《南京照相馆》"
  poster="https://oss.undz.cn/dtr/index.webp"
  ratio="21:9"
  fullscreen-web
  airplay
  pip
  flip
  fast-forward
  auto-playback
/>
<br>
2025年07月25日上映 137分钟

[9.7分](https://www.bilibili.com/bangumi/media/md26839589)

简介：影片故事取材于南京大屠杀期间日军真实罪证影像。一群生活在南京的百姓躲在吉祥照相馆中避难，为了尽可能的多活一日，他们被迫帮助日军摄影师冲洗底片，却意外冲印出了能证明日军屠城的罪证照片。日军企图掩盖大屠杀真相，他们则在日军眼皮底下谋划着如何将底片运送出去……