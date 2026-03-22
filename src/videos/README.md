---
title: 视频
icon: film
index: false
article: false
comment: false
---
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  // 如果 window.disVideoMod 未定义，则跳转到独立文章页
  if (typeof window.debugMode === 'undefined') {
    router.push('/videos/module_stopped_service.html'); // 替换为你的文章实际路由路径
  }
});
</script>
<Catalog />
