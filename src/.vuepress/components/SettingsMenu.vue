<template>
  <div class="seiting_modal-wrapper">
    <button class="seiting_trigger" @click="toggleOpen" aria-label="打开设置">
      <VPIcon class="seiting_arrow" icon="gear" :class="{ open: isOpen }" />
    </button>

    <transition name="seiting-fade">
      <div v-if="isOpen" class="seiting_modal-overlay">
        <div class="seiting_modal-backdrop" @click="close" />
        <div class="seiting_modal" @click.stop>
          <button class="seiting_close-button" @click="close" aria-label="关闭设置">×</button>

          <aside class="seiting_side-nav">
            <div class="seiting_nav-title">设置</div>
          </aside>

          <main class="seiting_content">
            <div class="seiting_content-header">
              <h2>常规</h2>
              <p>关于此网站的设置。</p>
            </div>

            <section class="seiting_section">
              <div class="seiting_section-row">
                <span class="seiting_section-label">RTL 布局</span>
                <RTLToggle />
              </div>

              <p class="seiting_section-description">
                切换页面从左到右 / 从右到左布局。
              </p>
              
              <div v-if="debugMode" class="seiting_debug-row">
                <span class="seiting_debug-label">调试模式</span>
                <span class="seiting_debug-value">{{ debugMode ? '已开启' : '未开启' }}</span>
                <button v-if="debugMode" class="seiting_debug-close" @click="closeDebugMode" type="button">
                  关闭调试模式
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const isOpen = ref(false)
const debugMode = ref(false)
const keyStack = ref([])
const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight']

const lockBodyScroll = () => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = 'hidden'
  // 可选：防止 iOS 弹性滚动穿透
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
}

const unlockBodyScroll = () => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
}
onUnmounted(() => {
  unlockBodyScroll()
})
const syncDebugMode = () => {
  if (typeof window !== 'undefined') {
    debugMode.value = Boolean(window.debugMode)
  }
}
watch(isOpen, (val) => {
  if (val) {
    lockBodyScroll()
  } else {
    unlockBodyScroll()
  }
})
const open = () => {
  syncDebugMode()
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const toggleOpen = () => {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

const enableDebugMode = () => {
  if (typeof window !== 'undefined') {
    window.debugMode = true
    debugMode.value = true
  }
}

const closeDebugMode = () => {
  if (typeof window !== 'undefined' && window.debugMode) {
    delete window.debugMode
    debugMode.value = false
  }
}

const handleKeydown = (event) => {
  keyStack.value.push(event.key)
  if (keyStack.value.length > sequence.length) {
    keyStack.value.shift()
  }

  if (sequence.every((key, index) => keyStack.value[index] === key)) {
    enableDebugMode()
    keyStack.value = []
  }
}

onMounted(() => {
  syncDebugMode()
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.seiting_modal-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
}

.seiting_trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 8px;
  height: 100%;
  color: var(--text-color);
  background: transparent;
  border: none;
  transition: color 0.2s;
}

.seiting_trigger:hover {
  color: var(--theme-color);
}

.seiting_arrow {
  transition: transform 0.2s ease;
}

.seiting_arrow.open {
  transform: rotate(180deg);
}

.seiting_modal-overlay {
  overflow: hidden;
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.32);
  pointer-events: auto;
  flex-direction: column;
  user-select: auto;
  -webkit-user-select: auto;
}

.seiting_modal-backdrop {
  position: absolute;
  inset: 0;
}

.seiting_modal {
  position: relative;
  z-index: 1;
  width: min(92vw, 640px);
  max-height: 90vh;
  overflow: auto;
  background: var(--vp-c-bg);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.16);
  padding: 28px;
}

.seiting_close-button {
  position: absolute;
  top: 16px;
  inset-inline-end: 16px;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
}


.seiting_side-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.seiting_nav-title {
  font-size: 1rem;
  color: var(--vp-c-text-mute);
}

.seiting_nav-item {
  background: transparent;
  border: none;
  text-align: left;
  padding: 10px 0;
  color: var(--text-color);
  cursor: pointer;
}

.seiting_nav-item-active {
  font-weight: 600;
}

.seiting_content-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.seiting_content-header p {
  margin: 6px 0 0;
  color: var(--vp-c-text-mute);
}

.seiting_section {
  margin-top: 20px;
  gap: 16px;
}

.seiting_section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.seiting_section-label {
  font-weight: 500;
}

.seiting_section-description {
  margin: 0;
  color: var(--vp-c-text-mute);
  font-size: 0.95rem;
  line-height: 1.5;
}

.seiting_debug-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
}

.seiting_debug-label {
  font-weight: 500;
}

.seiting_debug-value {
  color: var(--vp-c-text-mute);
}

.seiting_debug-close {
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--text-color);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}
</style>