<script setup lang="ts">
import VPTheme from 'vitepress/theme-without-fonts'
import Begin from './views/Begin.vue'
import BackTop from './components/BackTop.vue'
</script>

<template>
  <VPTheme.Layout>
    <template #home-features-after>
      <Begin />
    </template>
    <template #doc-before>
      <BackTop />
    </template>
  </VPTheme.Layout>
</template>
