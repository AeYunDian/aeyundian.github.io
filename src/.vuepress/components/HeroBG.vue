<template>
  <ClientOnly>
    <div class="none">HeroBG mounted</div>
  </ClientOnly>
</template>
<script setup lang="ts">
import { onMounted, nextTick } from 'vue';

onMounted(() => {
  nextTick(() => {
    console.debug('HeroBG mounted');
  });
});

</script>
<style lang="scss">
.vp-blog-hero .slide-down-button {
  bottom: 4.75rem;
}

.vp-blog-hero.hero-fullscreen .vp-blog-mask {
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: top;
  background-position-x: center;
  background-attachment: fixed;
}

.vp-blog-hero.hero-fullscreen {
  z-index: 5;
  height: 100vh !important;
  margin: 0;
  padding: 0;
  margin-bottom: 1rem;
}

.vp-footer-wrapper {
  border-top: none;
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: top;
  background-position-x: center;
  background-attachment: fixed;
}

[data-theme='light'] {
  .vp-blog-hero .vp-blog-mask::after {
    background: #000;
    opacity: 0.3 !important;
  }
  .vp-footer-wrapper {
    &::before {
      background: #000;
      opacity: 0.3;
    }
  }
}

[data-theme='dark'] {
  .vp-blog-hero .vp-blog-mask::after {
    background: #000;
    opacity: 0.7 !important;
  }
  .vp-footer-wrapper {
    &::before {
      background: #000;
      opacity: 0.7;
    }
  }
}
</style>
