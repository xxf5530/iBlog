<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y: scrollY } = useWindowScroll()

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div
    class="hidden sm:flex justify-center items-center z-100 fixed bottom-5 right-5 h-12 w-12 rounded-full transition"
    hover="bg-black/5 dark:bg-white/10 op-100 cursor-pointer"
    active="scale-95 bg-black/10 dark:bg-white/20"
    :class="scrollY < 700 ? 'pointer-events-none !op-0' : 'op-70'"
    @click="toTop"
  >
    <span i-tabler-arrow-up></span>
  </div>
</template>
