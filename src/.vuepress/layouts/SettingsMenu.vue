<template>
  <div class="settings-menu-wrapper" @mouseenter="open" @mouseleave="close">
    <div class="settings-trigger">
      <VPIcon icon="gear" />
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </div>

    <transition name="scale">
      <div v-show="isOpen" class="settings-dropdown" @mouseenter="open" @mouseleave="close">
        <div class="menu-content">
          <RTLToggle />
         
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'


const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}
</script>

<style scoped>
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
  font-size: 0.7rem;
  transition: transform 0.2s;

  transform-origin: 50% 45%;  
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