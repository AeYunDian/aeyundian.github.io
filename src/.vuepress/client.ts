// .vuepress/client.ts
import { defineClientConfig } from '@vuepress/client';
import { nextTick } from 'vue';

export default defineClientConfig({
  setup() {
    if (typeof window === 'undefined') return;

    // 图片点击处理函数
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
      }
      if (target.classList.contains('alipay-link')) {
        window.location.href = 'https://qr.alipay.com/fkx19538tldpvgxawbq0d22';
      } else if (target.classList.contains('wechat-link')) {
        alert('暂未接入微信支付');
      }
    };

    // 赞助页面核心逻辑
    const handleSponsorPage = () => {
      // 根据实际路径判断，您的赞助页路径是 /sponsors/
      if (!window.location.pathname.includes('/sponsors/')) return;

      console.log('赞助页面脚本执行 (路由切换)');

      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const infoContainer = document.querySelector('div.hint-container.info');
      if (infoContainer) {
        infoContainer.style.setProperty('display', isMobile ? 'block' : 'none', 'important');
      }

      if (isMobile) {
        const container = document.getElementById('qr-container');
        if (container) {
          // 先移除旧监听器，避免重复绑定
          container.removeEventListener('click', handleImageClick);
          container.addEventListener('click', handleImageClick);
        }
      }
    };

    // 使用 nextTick 确保 DOM 更新后执行
    const runAfterDOMUpdate = () => {
      nextTick(() => {
        handleSponsorPage();
      });
    };

    // 通过路由钩子触发
    import('@vuepress/client').then(({ useRouter }) => {
      const router = useRouter();
      // 首次加载
      runAfterDOMUpdate();
      // 每次路由切换后
      router.afterEach(() => {
        runAfterDOMUpdate();
      });
    });
  },
});