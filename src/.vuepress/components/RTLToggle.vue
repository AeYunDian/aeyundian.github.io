<template>
  <div class="rtl-toggle-item">
    <span class="label">RTL 布局：</span>
    <button class="toggle-button" @click="toggleRTL" :title="isRTL ? '切换为从左到右' : '切换为从右到左'">
      <VPIcon :icon="isRTL ? 'toggle-on' : 'toggle-off'" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isRTL = ref(false)

const toggleRTL = () => {
  isRTL.value = !isRTL.value
  document.documentElement.setAttribute('dir', isRTL.value ? 'rtl' : 'ltr')
  localStorage.setItem('rtl-enabled', isRTL.value)
}

onMounted(() => {
  const saved = localStorage.getItem('rtl-enabled')
  if (saved === 'true') {
    isRTL.value = true
    document.documentElement.setAttribute('dir', 'rtl')
  }
})
</script>

<style scoped>
.rtl-toggle-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  color: var(--text-color);
}

.toggle-button {
  width: 26px;
  height: 26px;
  padding: 0;
  background: var(--theme-color);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.toggle-button iconify-icon {
  font-size: 1.7rem;
  color: var(--vp-c-text);
}
</style>