<template>
  <div v-if="loading" class="hitokoto-loading vp-blog-hero-description">Please wait a moment...</div>
  <p v-else-if="showTagline" class="vp-blog-hero-description" style="cursor: pointer;" @click="refresh()">Protect What
    You Love</p>
  <div v-else>
    <p class="vp-blog-hero-description" @click="refresh()" style=" cursor: pointer;">『&nbsp;{{ event.hitokoto }}&nbsp;』
    </p>
    <p style="text-align: end; color: #fffc;cursor: pointer;" @click="refresh()">——&nbsp;{{ event.from_who
    }}&nbsp;「&nbsp;{{ event.from }}&nbsp;」</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'


const API_URL = 'https://v1.hitokoto.cn/?encode=json'

const loading = ref(true)
const showTagline = ref(false)
const event = ref(null)
async function refresh() {
  loading.value = true;
  showTagline.value = false;
  try {
    const response = await fetch(API_URL + `&_t=${Date.now()}`)
    const data = await response.json()
    if (data.hitokoto != null) {
      event.value = data
    } else {
      showTagline.value = true
      console.error('Hitokoto:', data.msg || 'Unk Err')
    }
  } catch (e) {
    showTagline.value = true
    console.error('Hitokoto:', e.message || e)
  } finally {
    loading.value = false
  }
}
onMounted(async () => {
  refresh();
})
</script>

<style scoped>
.hitokoto-loading {
  color: #eee;
  text-align: center;
}
</style>