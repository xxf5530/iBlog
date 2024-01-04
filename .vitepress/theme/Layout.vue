<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import DocHeader from './components/DocHeader.vue'
import BackTop from './components/BackTop.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <BackTop />
      <DocHeader />
    </template>
  </DefaultTheme.Layout>
</template>
