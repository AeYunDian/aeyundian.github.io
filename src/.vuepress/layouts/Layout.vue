<template>
  <Layout>
    <template #contentAfter>
      <br />
      <hr />
      分享至：
      <Share
        colorful
        :services="[
          'adsterra',
          'qq',
          'qzone',
          'twitter',
          'facebook',
          'reddit',
          'telegram',
          'whatsapp',
          'tumblr',
          'email',
          'qrcode',
          'linkedin',
          'sms',
          'snapchat',
          'wordpress',
          'line',
          'flipboard',
          'pinterest',
          'evernote',
          'messenger',
          'buffer',
          'vk',
        ]"
      />
    </template>
    <!-- <template #tocAfter>
      <ClientOnly>
        <div class="adsbox tocAfter">
          广告：
          <div id="container-fea5bb195a297693414b0fb0d07361bd"></div>
        </div>
      </ClientOnly>
    </template> -->
  </Layout>
</template>

<script setup lang="ts">
import { Layout } from "vuepress-theme-hope/client";
</script>
