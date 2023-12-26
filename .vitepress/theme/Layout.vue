<script setup lang="ts">
import VPTheme from 'vitepress/theme-without-fonts'
import Begin from './views/Begin.vue'
</script>

<template>
  <VPTheme.Layout>
    <template #home-features-after>
      <Begin />
    </template>
  </VPTheme.Layout>
</template>
