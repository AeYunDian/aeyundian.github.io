---
icon: pen-to-square
date: 2026-03-12
publishDate: 2026-03-12 08:00
title: '《原神》过场动画-「折枝落梦」'
draft: true
index: false
---

<!-- more -->

<ClientOnly>
  <div>
    <video
      ref="videoPlayer"
      data-dashjs-player
     style="width: 100%; max-width: 800px; height: auto;"
      src="https://oss.undz.cn/ffod/manifest.mpd"
      controls
      autoplay
    ></video>
  </div>
</ClientOnly>

<script setup>
import { onMounted, ref } from 'vue'

const videoPlayer = ref(null)

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.dashjs.org/latest/dash.all.min.js'
  document.head.appendChild(script)
})
</script>

我们在梦中提出问题，又在梦中得到解答。
当万千梦境重落世界，接下来便是道别的时刻。