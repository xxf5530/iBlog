<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useDateFormat, formatTimeAgo } from '@vueuse/core'
import { getLinkByNoteTag } from '../utils/notes'

const { frontmatter } = useData()
const header = computed(() => {
  let ctime = ''
  let mtime = ''
  const { customHeader, title, date, tags, lastUpdateTime } = frontmatter.value
  if (customHeader) {
    if (date) {
      ctime =
        customHeader === 'center'
          ? useDateFormat(date, 'YYYY年M月D日 dddd', { locales: 'zh-CN' }).value
          : useDateFormat(date, 'D MMM, YYYY', { locales: 'en' }).value
    }
    if (customHeader !== 'center' && lastUpdateTime) {
      mtime = formatTimeAgo(new Date(lastUpdateTime))
    }
  }
  return {
    customHeader,
    title,
    ctime,
    mtime,
    tags,
  }
})
</script>

<template>
  <div
    v-if="!!header.customHeader"
    class="flex flex-col gap-5 pb-10"
    :class="header.customHeader === 'center' && 'items-center'"
  >
    <h1 class="text-3xl text-$vp-c-brand-1 font-bold">{{ header.title }}</h1>
    <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-$vp-c-text-2">
      <div class="flex items-center" title="本文新建时间">
        <span i-tabler-calendar mr-1 v-if="header.customHeader !== 'center'" />
        <time>{{ header.ctime }}</time>
      </div>
      <div class="flex items-center" title="最近修改时间" v-if="header.mtime">
        <span i-tabler-edit mr-1 />
        <time>{{ header.mtime }}</time>
      </div>
      <div class="flex items-center" v-if="header.tags">
        <span mr-1 :class="header.tags.length > 1 ? 'i-tabler-tags' : 'i-tabler-tag'" />
        <template v-for="(tag, idx) in header.tags">
          <a
            :href="getLinkByNoteTag(tag)"
            hover="text-$vp-c-brand-1 underline underline-solid underline-offset-2"
            >{{ tag }}</a
          >
          <span class="ml-0.5 mr-1.5" v-if="idx < header.tags.length - 1">,</span>
        </template>
      </div>
    </div>
  </div>
</template>
