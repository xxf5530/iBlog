<script setup lang="ts">
import { toggle } from '../utils/useDarkMode'
</script>

<template>
  <button
    class="inline-flex-center rounded-full p-3 text-base active:scale-95 transition"
    hover="bg-dark/5 dark:bg-white/10"
    @click="toggle"
  >
    <span i-line-md-sun-rising-loop dark:i-line-md-moon-rising-loop />
  </button>
</template>
