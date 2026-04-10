<template>
  <HopeLayout>
    <template #navbar>
      <SaleBanner />
      <Navbar />
    </template>
  </HopeLayout>
</template>

<script>
import HopeLayout from 'vuepress-theme-hope/templates/layouts/Layout.vue'
import SaleBanner from '../components/SaleBanner.vue'
import Navbar from 'vuepress-theme-hope/components/Navbar.js'

export default {
  components: { HopeLayout, SaleBanner, Navbar }
}
</script>