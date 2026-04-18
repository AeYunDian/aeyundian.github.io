---
index: false
icon: film
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
  // 关闭功能，默认渲染
  //  'undefined'
  if (typeof window.debugMode !== 'undefined') {
    router.push('/videos/module_stopped_service.html')
  } else {
    loadPlayer.value = true   // 满足条件时才渲染播放器
  }
})
</script>

<ArtPlayer
  v-if="loadPlayer"
  src="https://film.bucket.oss.undz.cn/dtr/manifest.mpd"
  title="《南京照相馆》"
  poster="https://film.bucket.oss.undz.cn/dtr/index.webp"
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

简�"��嗵冗銝𠰴遣��𥡝情銵��硋停鈭𤤿凒鈭𤾸�睃�𥪜蘨�����糓��㗛�𤘪1938~1938��亙�6睃�乩賑隞擧𧒄�仪隞𤾸�韏�瘙���汿���𧑐鈭𤾸�閖�睃⏚����鈭𢛵��
甇�蒂敺��娍�𨅯僑���辺蝟颱誑�䔉摰硺�栞�賜�钅�賢��嗅�摰���銝�隡𡁜�𡝗�牐�汿����𧢲偌甇�”蝏𤩺鰵��