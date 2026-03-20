<script setup lang="ts">
import { Blog } from "vuepress-theme-hope/blog";
import TodayInHistory from './TodayInHistory.vue'
import BingHeroBackground from "vuepress-theme-hope/presets/BingHeroBackground.js";
</script>

<template>
  <Blog>
    <template #heroBg>
      <BingHeroBackground />
      <div class="backdrop-blur-layer"></div>
    </template>

    <template #heroInfo>
      <div class="vp-blog-hero-info">
        <h1 class="vp-blog-hero-title">undz</h1>
        <TodayInHistory />
      </div>
    </template>
  </Blog>
</template>

<style scoped>
.backdrop-blur-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
  pointer-events: none;
}
</style>