<script setup lang="ts">
import { Blog } from "vuepress-theme-hope/blog";
import { Layout, NotFound } from "vuepress-theme-hope/client";
import TodayInHistory from '../components/TodayInHistory.vue'
import SaleBanner from '../components/SaleBanner.vue'
import SaleBlock from '../components/SaleBlock.vue'
import BingHeroBackground from "vuepress-theme-hope/presets/BingHeroBackground.js";
</script>

<template>

  <Blog>

    <template #heroBg>
      <BingHeroBackground />
      <div class="backdrop-blur-layer"></div>
    </template>
    <template #heroAfter>
      <SaleBanner />
    </template>

    <template #heroInfo>
      <div class="vp-blog-hero-info">
        <h1 class="vp-blog-hero-title">undz</h1>
        <TodayInHistory />
      </div>
    </template>

    <template #infoAfter>
      <SaleBlock />
    </template>

  </Blog>

</template>

