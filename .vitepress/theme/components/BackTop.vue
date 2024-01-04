<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y: scrollY } = useWindowScroll()

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <button
    class="inline-flex-center z-100 fixed bottom-5 right-5 h-12 w-12 text-base rounded-full active:scale-95"
    hover="bg-dark/10 dark:bg-light/10 op-100"
    :class="scrollY < 700 ? 'pointer-events-none !op-0' : 'op-70'"
    @click="toTop"
  >
    <span i-tabler-arrow-up></span>
  </button>
</template>
