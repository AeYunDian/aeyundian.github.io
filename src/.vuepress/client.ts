// .vuepress/client.ts
import { defineClientConfig } from '@vuepress/client';

export default defineClientConfig({
  setup() {
    // 仅在浏览器环境运行（避免构建时出错）
    if (typeof window === 'undefined') return;

    // 路由切换后执行的核心逻辑
    const handleSponsorPage = () => {
      // 判断当前页面是否是赞助页（根据实际 URL 调整）
      // 如果您的赞助页路径是 /sponsors/，则如下判断
      if (!window.location.pathname.includes('/sponsors/')) return;

      console.log('赞助页面脚本执行 (路由切换)');

      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const infoContainer = document.querySelector('div.hint-container.info');

      // 控制 info 容器显示/隐藏
      if (infoContainer) {
        infoContainer.style.setProperty('display', isMobile ? 'block' : 'none', 'important');
      }

      // 移动端绑定点击事件
      if (isMobile) {
        const container = document.getElementById('qr-container');
        if (container) {
          // 移除旧监听器，避免重复绑定
          container.removeEventListener('click', handleImageClick);
          container.addEventListener('click', handleImageClick);
        }
      }
    };

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

    // 1. 页面首次加载时执行
    handleSponsorPage();

    // 2. 监听路由切换（通过 MutationObserver 检测内容变化）
    const observer = new MutationObserver(() => {
      // 简单的防抖：切换路由后延迟一小段时间再执行
      clearTimeout((window as any)._sponsorTimer);
      (window as any)._sponsorTimer = setTimeout(handleSponsorPage, 100);
    });
    observer.observe(document.querySelector('#main-content') || document.body, {
      childList: true,
      subtree: true,
    });
  },
});