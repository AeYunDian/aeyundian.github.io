import { defineClientConfig } from '@vuepress/client';
import { nextTick } from 'vue';

export default defineClientConfig({
  // 利用 setup 的参数直接获取 router 实例
  setup(app, router, siteData) {
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

    // 赞助页核心逻辑
    const handleSponsorPage = () => {
      console.log('路由切换检测 - 当前路径:', window.location.pathname);

      // 判断是否为赞助页（根据实际路径调整）
      if (!window.location.pathname.includes('/sponsors/')) {
        console.log('不是赞助页，跳过');
        return;
      }

      console.log('▶ 进入赞助页处理逻辑');

      nextTick(() => {
        console.log('  nextTick 后开始处理');

        const infoContainer = document.querySelector('div.hint-container.info');
        console.log('  找到 info 容器:', infoContainer);

        if (infoContainer) {
          const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          console.log('  移动端判断:', isMobile);

          // 强制设置 display
          infoContainer.style.setProperty('display', isMobile ? 'block' : 'none', 'important');
          console.log('  已设置 display 为:', isMobile ? 'block' : 'none');

          // 检查样式是否生效
          setTimeout(() => {
            const computed = window.getComputedStyle(infoContainer).display;
            console.log('  计算后的 display 实际值:', computed);
          }, 200);
        } else {
          console.warn('  未找到 info 容器！');
        }

        // 移动端绑定点击事件
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          const container = document.getElementById('qr-container');
          if (container) {
            // 移除旧监听器，避免重复绑定
            container.removeEventListener('click', handleImageClick);
            container.addEventListener('click', handleImageClick);
            console.log('  图片点击事件已绑定');
          }
        }
      });
    };

    // 首次加载时执行
    handleSponsorPage();

    // 使用传入的 router 监听路由切换（关键修复！）
    router.afterEach(() => {
      console.log('--- router.afterEach 触发 (通过参数) ---');
      handleSponsorPage();
    });
  },
});