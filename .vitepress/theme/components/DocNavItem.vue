<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { getLinkByNoteTag } from '../utils/notes'

defineProps<{
  title: string
  link: string
  date?: string
  tags?: string[]
  activeTag?: string
  dateFormatStr?: string
  showTimeline?: boolean
}>()
</script>

<template>
  <li
    class="relative rounded transition pl-2 group before:(content-empty absolute rounded-full top-50% w-[6px] h-[6px] bg-$vp-c-brand-1)"
    :class="
      showTimeline &&
      'after:(content-empty absolute border-l-2 border-l-$vp-c-brand-1 op-30 left-2.5 first:top-50% last:bottom-50% bottom-0 top-0)'
    "
    hover="bg-gray/20"
  >
    <div class="flex items-center px-2 py-[5px] op-80 group-hover:op-100">
      <a
        :href="link"
        class="ml-2 mr-4 transition hover:text-$vp-c-brand-1"
        underline="~ dotted offset-4 hover:solid"
        >{{ title }}</a
      >

      <div
        v-if="tags?.length"
        :class="[showTimeline && 'ml-auto', activeTag ? 'flex ml-auto' : 'hidden sm:flex']"
        class="flex-wrap gap-1 justify-end"
      >
        <a
          v-for="tag in tags"
          :href="getLinkByNoteTag(tag)"
          class="rounded-sm px-1.5 py-0.5 text-xs bg-dark/10 dark:bg-light/10 hover:text-$vp-c-brand-1 transition"
          >{{ tag }}</a
        >
      </div>
      <div
        v-if="date"
        :class="showTimeline ? 'order-first ml-2' : 'ml-auto'"
        class="self-end text-sm font-$vp-font-family-mono"
      >
        {{ useDateFormat(date, dateFormatStr ?? 'YYYY/MM/DD').value }}
      </div>
    </div>
  </li>
</template>
