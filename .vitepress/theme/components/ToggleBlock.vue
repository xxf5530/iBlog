<script setup lang="ts">
import { ref } from 'vue'

const { defaultOpen, icon } = defineProps<{
  label?: string
  icon?: string
  defaultOpen?: boolean
}>()

const open = ref(defaultOpen)
const iconClass = icon ?? 'i-carbon-data-enrichment'
</script>

<template>
  <div class="relative">
    <div
      class="inline-flex-center gap-2 rounded border cursor-pointer px-5 py-2 text-sm active:scale-95 transition"
      hover="bg-black/5 dark:bg-white/10"
      @click="open = !open"
    >
      <span :class="open ? 'i-line-md-close' : iconClass" />
      <span v-if="label">{{ label }}</span>
    </div>
    <div v-show="open">
      <slot />
    </div>
  </div>
</template>

<style>
.i-carbon-data-enrichment {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M28 13h2v2h-2zm-4.222-8.203l1.414-1.415l1.414 1.415l-1.414 1.414zM15 0h2v2h-2zM6.808 6.234L5.394 4.819l1.414-1.414L8.222 4.82zM2 13h2v2H2zm11 17h6v2h-6zm-2-4h10v2H11zm5-22C10.5 4 6 8.5 6 14c0 4.4 2 6.3 3.5 7.6c1 .9 1.5 1.5 1.5 2.4h2c0-1.8-1.1-2.9-2.2-3.9C9.4 18.9 8 17.5 8 14c0-4.4 3.6-8 8-8s8 3.6 8 8c0 3.5-1.4 4.9-2.8 6.1c-1.1 1-2.2 2-2.2 3.9h2c0-.9.5-1.5 1.5-2.4C24 20.3 26 18.4 26 14c0-5.5-4.5-10-10-10z'/%3E%3C/svg%3E");
  -webkit-mask: var(--un-icon) no-repeat;
  mask: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
  width: 1.2em;
  height: 1.2em;
}
</style>
