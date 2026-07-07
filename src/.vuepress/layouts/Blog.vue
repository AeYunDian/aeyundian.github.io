<script setup lang="ts">
import { Blog } from "vuepress-theme-hope/blog";
import TodayInHistory from "../components/TodayInHistory.vue";
import Hitokoto from "../components/Hitokoto.vue";
import SaleBanner from "../components/SaleBanner.vue";
import SaleBlock from "../components/SaleBlock.vue";
import BingHeroBackground from "vuepress-theme-hope/presets/BingHeroBackground.js";
import client from "../client.js";
import { ClientOnly } from "vuepress/client";
</script>

<template>
  <Blog>
    <template #heroBg>
      <BingHeroBackground />
      <div class="backdrop-blur-layer"></div>
    </template>

    <template #heroAfter>
      <ClientOnly>
        <script>
        atOptions = {
          key: "7c87ee8ce90e4cce52cfff1939b8ee7f",
          format: "iframe",
          height: 300,
          width: 160,
          params: {},
        };
      </script>
        <script src="https://www.highperformanceformat.com/7c87ee8ce90e4cce52cfff1939b8ee7f/invoke.js"></script>
      </ClientOnly>
    </template>

    <template #heroInfo>
      <div class="vp-blog-hero-info">
        <h1 class="vp-blog-hero-title">undz</h1>
        <!-- <TodayInHistory /> -->
        <Hitokoto />
      </div>
    </template>

    <template #infoAfter>
      <ClientOnly>
        <!-- ads1 -->
        <ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-3843140944895532"
          data-ad-slot="8419103573" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <div id="container-fea5bb195a297693414b0fb0d07361bd"></div>
      </ClientOnly>
      <SaleBlock />
    </template>
  </Blog>
</template>
