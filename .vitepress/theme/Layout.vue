<script setup lang="ts">
import VPTheme from 'vitepress/theme-without-fonts'
import Begin from './views/Begin.vue'
import BackTop from './components/BackTop.vue'
import DocHeader from './components/DocHeader.vue'
</script>

<template>
  <VPTheme.Layout>
    <template #home-features-after>
      <Begin />
    </template>
    <template #doc-before>
      <BackTop />
      <DocHeader />
    </template>
  </VPTheme.Layout>
</template>
