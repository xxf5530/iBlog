<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { getLinkByNoteTag } from '../utils/notes'

defineProps<{
  link: string
  title: string
  date?: string
  tags?: string[]
  activeTag?: string
  showTimeline?: boolean
  formatDateStr?: string
}>()
</script>

<template>
  <li
    class="relative px-2 text-$vp-c-text-2 rounded transition before:(content-empty absolute rounded-full top-50% w-[6px] h-[6px] bg-$vp-c-brand-1 hover:bg-$vp-c-brand-1 transition)"
    hover="bg-gray/10 text-$vp-c-text-1"
    :class="
      showTimeline &&
      'after:(content-empty absolute border-l-2 border-l-$vp-c-brand-1 left-2.5 first:top-50% last:bottom-50% bottom-0 top-0)'
    "
  >
    <div class="px-2 py-1.5 flex items-center transition">
      <a
        :href="link"
        class="ml-2 mr-4 hover:text-$vp-c-brand-1"
        underline="~ dotted offset-4 hover:solid"
        >{{ title }}</a
      >
      <div
        v-if="tags?.length"
        :class="[
          showTimeline && 'ml-auto',
          activeTag ? 'flex ml-auto' : 'hidden sm:flex',
        ]"
        class="flex-wrap gap-1 justify-end"
      >
        <a
          v-for="tag in tags"
          :href="getLinkByNoteTag(tag)"
          class="rounded-sm px-1.5 py-0.5 text-xs bg-black/5 dark:bg-white/5 hover:text-$vp-c-brand-1"
          >{{ tag }}</a
        >
      </div>
      <time
        v-if="date"
        :class="showTimeline ? 'order-first ml-2' : 'ml-auto'"
        class="self-end text-sm font-$vp-font-family-mono"
      >
        {{ useDateFormat(date, formatDateStr ?? 'YYYY/MM/DD').value }}
      </time>
    </div>
  </li>
</template>
