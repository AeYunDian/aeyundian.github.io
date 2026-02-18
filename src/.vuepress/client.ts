import { defineClientConfig } from '@vuepress/client';
import { nextTick } from 'vue';

export default defineClientConfig({
  setup(app, ...args) {
    // 仅在浏览器环境运行
    if (typeof window === 'undefined') return;

    // 尝试以多种方式获取 router 实例（兼容不同 VuePress 版本）
    let router;
    try {
      // 方式1：从参数中获取（标准）
      router = args[0]; // 通常第二个参数是 router
      if (!router) {
        // 方式2：从 app 实例中获取
        router = app.config.globalProperties.$router || app.$router;
      }
      if (!router) {
        console.warn('无法获取 router 实例，将降级使用 MutationObserver');
      }
    } catch (e) {
      console.warn('获取 router 实例失败:', e);
    }

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
          infoContainer.style.setProperty('display', isMobile ? 'block' : 'none', 'important');
          console.log('  已设置 display 为:', isMobile ? 'block' : 'none');
        } else {
          console.warn('  未找到 info 容器！');
        }

        // 移动端绑定点击事件
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          const container = document.getElementById('qr-container');
          if (container) {
            container.removeEventListener('click', handleImageClick);
            container.addEventListener('click', handleImageClick);
            console.log('  图片点击事件已绑定');
          }
        }
      });
    };

    // 首次加载执行
    handleSponsorPage();

    // 方案 A：如果能获取 router，使用 afterEach 监听
    if (router && typeof router.afterEach === 'function') {
      router.afterEach(() => {
        console.log('--- router.afterEach 触发 ---');
        handleSponsorPage();
      });
    } else {
      // 方案 B：降级使用 MutationObserver 监听内容变化
      console.log('使用 MutationObserver 降级方案');
      const observer = new MutationObserver(() => {
        // 简单防抖
        clearTimeout((window as any)._sponsorTimer);
        (window as any)._sponsorTimer = setTimeout(() => {
          handleSponsorPage();
        }, 100);
      });
      observer.observe(document.querySelector('#main-content') || document.body, {
        childList: true,
        subtree: true,
      });
    }
  },
});