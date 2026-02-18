// .vuepress/client.ts
import { defineClientConfig } from '@vuepress/client';
import { nextTick } from 'vue';

export default defineClientConfig({
  setup() {
    if (typeof window === 'undefined') return;

    // 路由切换后执行的核心函数
    const run = () => {
      console.log('路由切换检测 - 当前路径:', window.location.pathname);
      
      // 判断是否是赞助页
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
          
          // 稍后检查实际样式
          setTimeout(() => {
            const computed = window.getComputedStyle(infoContainer).display;
            console.log('  计算后的 display 实际值:', computed);
          }, 200);
        } else {
          console.warn('  未找到 info 容器！');
        }
      });
    };

    // 首次加载执行
    run();

    // 监听路由切换
    import('@vuepress/client').then(({ useRouter }) => {
      const router = useRouter();
      router.afterEach(() => {
        console.log('--- router.afterEach 触发 ---');
        run();
      });
    }).catch(err => {
      console.error('导入 useRouter 失败:', err);
    });
  },
});