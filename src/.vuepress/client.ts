// .vuepress/client.js
import Blog from "./layouts/Blog.vue";
import TodayInHistory from "./components/TodayInHistory.vue";
import { defineClientConfig } from '@vuepress/client'
import RTLToggle from './components/RTLToggle.vue'
import SettingsMenu from './components/SettingsMenu.vue'
import SaleBanner from './components/SaleBanner.vue'

export default defineClientConfig({
  layouts: {
    
    Blog,
  },
  enhance({ app, router, siteData }) {
    // 注册全局组件
    app.component('RTLToggle', RTLToggle)
    app.component('SettingsMenu', SettingsMenu)
    app.component('SaleBanner', SaleBanner)
  },
  setup() {
    // 只在浏览器环境下运行
    if (typeof window !== 'undefined') {
      // 定义计算运行时间的函数
      const updateRuntime = () => {
        const startTime = new Date('2025-02-22T13:42:00Z') // 你的开始时间
        const now = new Date()
        const diff = Math.floor((now - startTime) / 1000) // 总秒数

        const days = Math.floor(diff / 86400)
        const hours = Math.floor((diff % 86400) / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = diff % 60

        const runtimeSpan = document.getElementById('runtime-value')
        if (runtimeSpan) {
          runtimeSpan.textContent = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`
        }
      }

      // 立即执行一次
      updateRuntime()
      // 每秒更新一次
      setInterval(updateRuntime, 1000)
    }
  }
})