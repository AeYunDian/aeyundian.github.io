<template>
  <ClientOnly>
    <div v-if="!closed" class="domain-sale-banner" @click="handleBannerClick">
      <div ref="scrollContainer" class="scroll-container">
        <span ref="scrollText" class="scroll-text">This domain name is for sale, click to see details!</span>
      </div>
      <button class="close-btn" @click.stop="closeBanner">✕</button>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  name: 'SaleBanner',
  data() {
    return {
      closed: false,
      animationId: null
    };
  },
  mounted() {
    // 检查 localStorage 是否关闭过
    if (localStorage.getItem('domainSaleBannerClosed') === 'true') {
      this.closed = true;
      return;
    }
    // 等待 DOM 完全渲染后再启动动画
    this.$nextTick(() => {
      this.startScrollAnimation();
    });
  },
  methods: {
    closeBanner() {
      this.closed = true;
      localStorage.setItem('domainSaleBannerClosed', 'true');
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },
    handleBannerClick(e) {
      // 点击关闭按钮时不触发跳转
      if (e.target.classList.contains('close-btn')) return;
      window.location.href = '/sale_the_domain_name.html';
    },
    startScrollAnimation() {
      const scrollContainer = this.$refs.scrollContainer;
      const textSpan = this.$refs.scrollText;
      if (!scrollContainer || !textSpan) return;

      let startTime = null;
      const duration = 15000; // 一次完整滚动时间 (ms)
      let containerWidth = scrollContainer.clientWidth;
      let textWidth = textSpan.clientWidth;
      
      const updateDimensions = () => {
        containerWidth = scrollContainer.clientWidth;
        textWidth = textSpan.clientWidth;
      };

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = (elapsed % duration) / duration;
        const translateX = containerWidth - (progress * (containerWidth + textWidth));
        textSpan.style.transform = `translateX(${translateX}px)`;
        this.animationId = requestAnimationFrame(animate);
      };

      window.addEventListener('resize', () => {
        updateDimensions();
        startTime = null;
      });

      // 延迟确保首次尺寸计算正确
      setTimeout(() => {
        updateDimensions();
        startTime = null;
        this.animationId = requestAnimationFrame(animate);
      }, 100);
    }
  },
  beforeDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
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
  justify-content: space-between;
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
  white-space: nowrap;
  position: relative;
  animation: fade-blink 2s ease-in-out infinite;
}
.close-btn {
  background: rgba(0,0,0,0);
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
  background: rgba(0,0,0,0.2);
  color: #b06d00;
}
@keyframes fade-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
</style>