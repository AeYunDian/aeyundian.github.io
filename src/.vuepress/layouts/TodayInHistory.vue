<template>
  <div v-if="loading" class="history-loading">Hold on...</div>
  <p v-else-if="showTagline" class="vp-blog-hero-description">Protect What You Love</p>
  <div v-else class="history-today-card">
    <div class="history-today-title">
      <h3 class="history-title">历史上的今天</h3>
      <p class="history-year">
        &nbsp;&nbsp;&nbsp;
        <span v-if="event.y > 0">{{ event.y }}年</span>
        <span v-else>公元前{{ Math.abs(event.y) }}年</span>
        <span>{{ event.m }}月{{ event.d }}日</span>
      </p>
    </div>
    <div class="history-content">
      <a
        v-if="event.url"
        :href="event.url"
        target="_blank"
        rel="noopener noreferrer"
        class="history-event-text"
      >{{ event.title }}</a>
      <p v-else class="history-event-text">{{ event.title }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_ID = '10014213'
const API_KEY = '5bbe9a7562e49c1c8fd6c820579695f4'
const API_URL = 'https://cn.apihz.cn/api/zici/today.php'

const loading = ref(true)
const showTagline = ref(false)
const event = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(`${API_URL}?id=${API_ID}&key=${API_KEY}`)
    const data = await response.json()
    if (data.code === 200) {
      event.value = data
    } else {
      showTagline.value = true
      console.error('TodayInHistory:', data.msg || 'Unk Err')
    }
  } catch (e) {
    showTagline.value = true
    console.error('TodayInHistory Get Error:', e.message || e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>

.history-today-card {
  padding: 1rem 1.2rem;
  border-radius: 12px;
  background: var(--bg-color-secondary, #f5f7fa);
  border: 1px solid var(--border-color, #eaecef);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 1.5rem 0;
}
.history-today-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline; /* 标题和年份基线对齐 */
  gap: 0.5rem;
}
.history-title {
  font-size: 1.1rem;
  font-weight: 600;
  border-left: 4px solid #3b82f6;
  padding-left: 0.6rem;
  color: var(--text-color, #2c3e50);
  margin: 0;
}
.history-year {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  text-align: left;
}
.history-content {
  margin-top: 0.5rem;
}
.history-event-text {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color, #34495e);
  text-decoration: none;
}
.history-event-text:hover {
  color: #1e4c8f;
}
.history-loading {
  color: var(--text-color, #2c3e50);
  text-align: center;
}
</style>