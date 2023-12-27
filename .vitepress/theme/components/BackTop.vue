<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y: scrollY } = useWindowScroll()

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div
    class="btn z-100 fixed bottom-5 right-5 h-12 w-12 rounded-full active:scale-95"
    hover="bg-black/5 dark:bg-white/10 op-100"
    :class="scrollY < 600 ? 'pointer-events-none !op-0' : 'op-60'"
    @click="toTop"
  >
    <span i-tabler-arrow-up />
  </div>
</template>
