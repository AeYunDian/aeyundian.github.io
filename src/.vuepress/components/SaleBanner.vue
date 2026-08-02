<template>
  <ClientOnly>
    <div v-if="!closed" class="domain-sale-banner" @click="handleBannerClick">
      <div ref="scrollContainer" class="scroll-container">
        <span ref="scrollText" class="scroll-text">我们很快会推出新的博客页面，点击此横幅，试试 new.undz.cn 预览。</span>
      </div>
      <button class="close-btn" @click.stop="closeBanner" style="display: none;">✕</button>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  name: 'SaleBanner',
  data() {
    return {
      // closed: false,
      closed: false,
    };
  },
  mounted() {
    if (localStorage.getItem('domainSaleBannerClosed') === 'true') {
      this.closed = true;
      return;
    }
  },
  methods: {
    closeBanner() {
      this.closed = true;
      localStorage.setItem('domainSaleBannerClosed', 'true');
    },
    handleBannerClick(e) {
      // 点击关闭按钮时不触发跳转
      if (e.target.classList.contains('close-btn')) return;
      window.location.replace("https://new.undz.cn");
    },

  },
};
</script>

<style scoped>
.domain-sale-banner {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #fff0e3;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e58900;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 10px 0 0;
  cursor: pointer;
  position: relative;
  z-index: 9999;
}

.scroll-container {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  height: 100%;
}

.scroll-text {
  display: inline-block;
  text-align: center;
  white-space: nowrap;

}

.close-btn {
  background: rgba(0, 0, 0, 0);
  border: none;
  font-size: 16px;
  color: #e58900;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #b06d00;
}
</style>