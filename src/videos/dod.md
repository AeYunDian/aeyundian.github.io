---
icon: film
index: false
title: '《孤注一掷》'

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
  src="https://oss.undz.cn/dod/manifest.mpd"
  poster="https://oss.undz.cn/dod/index.webp"
  title="《孤注一掷》"
  ratio="21:9"
  fullscreen-web
  airplay
  pip
  flip
  fast-forward
  auto-playback
/>
<br>
2023年08月08日上映 130分钟

[9.0分](https://www.bilibili.com/bangumi/media/md20284946)

简介：南亚某国，由于当地政府监管不力以及有意纵容，诈骗产业极其昌盛，炒股、挖币、网游、电商、博彩等，各种手段层出不穷，花样百出。某个科技产业园内，诈骗团伙头目陆经理（王传君 饰）张狂傲慢，用诡计和暴力统治着这个血泪王国。程序员潘生（张艺兴 饰）离开之前的公司，根据高薪招聘启示 走入了陆经理设下的圈套，成为一名利用网络诈骗的狗推。因为羡慕闺蜜的生活，模特梁安娜（金晨 饰）也飞到异国他乡寻找机会，结果护照被没收，成为陆经理手下利用美色诈骗的工具。进入人间炼狱，仿佛再也见不到活着出去的希望……电影取材自上万起真实诈骗案例。