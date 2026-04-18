---
index: false
icon: film
title: '《孤注一掷》'
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
  src="https://film.bucket.oss.undz.cn/dod/manifest.mpd"
  poster="https://film.bucket.oss.undz.cn/dod/index.webp"
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

简介%�𦶢摨𥪜�雿枏�交糓��撣衣�讠�銝擧�㗇㺭憭拍緵�虾�����銁��瘞渡緵鈭扯�坔��錇����𦒘�䔶�漤𡢿隞𤾸�齿辺甈∠頂�����砍�𤥁����𡃏��憭游僑�虾雿惩��迤��蝟颱�硋僎��𤾸�園燵��隞嗅縧�燵��滨�见�喲䔮撣詨�𨳍���緵憸条瑪��烐活撌脣�堒�牐�𨀣瓷��滨�见�鞟�滨㩞蝔卝��憭扯�質��閬�隞砍�𣂼蒂撣行�𡒊���硋�砍�峕糓鈭䎚���乩舅蝏誩漲�峕暑鈭𥪯���
�仿䔮�鍂銝芯�𤤿�蠘�峕鰵�亙�譌��餈䀝���见�誩縧閬���瓷��𦒘�擧錇�凒銝�撖孵�訫予����𥕦𢆡撠曹舅瘞游振�𧒄摨行�閧�笔�䀹�坔�𣳇𡢿撠譍�卝����鈭见虜摨𠉛凒餈䀝����
