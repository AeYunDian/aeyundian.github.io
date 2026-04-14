<template>
  <ClientOnly>
    <div class="domain-sale-block" @click="handleBlockClick">
      <h1 ref="domain-sale-title" class="domain-sale-title"><VPIcon icon="yen-sign" size="1.2rem"/>&nbsp;Domain for Sale</h1>
      <span ref="domain-sale-text" class="domain-sale-text">The domain name you are currently visiting is being sold at an ultra-low price of 120 RMB. Click to see details.</span>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  name: 'SaleBlock',
  mounted() {
    this.$nextTick(() => {

    });
  },
  methods: {
    handleBlockClick(e) {
      window.location.href = '/sale_the_domain_name.html';
    },
  },
};
</script>

<style scoped>
.domain-sale-block {
  line-height: 22px;
  background: linear-gradient(to top right, rgb(7 16 45), rgb(58 60 84));
  font-size: 13px;
  border-radius: 8px;
  padding: 20px 20px;
  margin-bottom: 16px;
  overflow-wrap: break-word;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px var(--vp-c-shadow);
  &:hover {
    box-shadow: 0 4px 8px 4px var(--vp-c-shadow);
  }
}

.domain-sale-title {
  font-size: 1.125rem;
  color: rgba(235, 235, 245, 0.86);
}

.domain-sale-text {
  font-size: 0.875rem;
  color: oklch(0.704 0.04 256.788);
}
</style>