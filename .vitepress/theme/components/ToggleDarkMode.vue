<script setup lang="ts">
import { toggle } from '../utils/useDarkMode'
</script>

<template>
  <button
    class="inline-flex-center rounded-full p-3 text-base active:scale-95 transition"
    hover="bg-dark/10 dark:bg-light/10"
    @click="toggle"
  >
    <span i-line-md-sun-rising-loop dark:i-line-md-moon-rising-loop></span>
  </button>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
