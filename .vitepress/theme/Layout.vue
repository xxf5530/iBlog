<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import BackTop from './components/BackTop.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <BackTop />
    </template>
  </DefaultTheme.Layout>
</template>
