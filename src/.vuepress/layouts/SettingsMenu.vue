<template>
  <div class="settings-menu-wrapper" @mouseenter="open" @mouseleave="close">
    <div class="settings-trigger">
      <VPIcon class="arrow" icon="gear"  :class="{ open: isOpen }"/>

    </div>

    <transition name="scale">
      <div v-show="isOpen" class="settings-dropdown" @mouseenter="open" @mouseleave="close">
        <div class="menu-content">
          <RTLToggle />
          <a class="tip-label" v-if="showTip"   @click.prevent="closeDebugMode" href="javascript:void(0)">调试模式已开启，点击关闭</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const showTip = ref(false)

const closeDebugMode = () => {
  if (typeof window !== 'undefined' && window.debugMode) {
    delete window.debugMode;
    showTip.value = false;
  }
}

const open = () => {
  if (typeof window !== 'undefined' && window.debugMode) {
    showTip.value = true
  }
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.debugMode) {
    showTip.value = true
  }
})
</script>

<style scoped>
.tip-label {
  color: var(--vp-c-text-mute);
  font-size: 0.8rem;
  line-height: 0.8rem;
}

.settings-menu-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
}

.settings-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 0 8px;
  height: 100%;
  color: var(--text-color);
  transition: color 0.2s;
}

.settings-trigger:hover {
  color: var(--theme-color);
}

.arrow {
  display: inline-block;
  transition: transform 0.2s;

}

.arrow.open {
  transform: rotate(180deg);
}

.settings-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  left: auto;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}
:dir(rtl) .settings-dropdown {
  right: auto;
  left: 0;
}
.menu-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px;
}

.menu-content > * {
  width: 100%;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
.scale-enter-to,
.scale-leave-from {
  transform: scale(1);
  opacity: 1;
}
</style>