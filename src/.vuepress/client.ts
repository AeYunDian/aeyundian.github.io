// .vuepress/client.js
import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
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