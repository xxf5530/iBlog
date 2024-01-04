<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useBackLink } from '../utils/useBackLink'

const { frontmatter } = useData()
const prevNext = computed(() => ({
  prev: frontmatter.value?.prev,
  next: frontmatter.value?.next,
}))

const backLink = useBackLink()
</script>

<template>
  <div class="mt-32 text-sm text-$vp-c-text-2">
    <div
      v-if="prevNext.prev || prevNext.next"
      class="flex mb-4 pt-2 px-2"
      :class="prevNext.prev ? 'justify-between' : 'justify-end'"
    >
      <a
        v-if="prevNext.prev"
        :href="prevNext.prev.link"
        class="flex flex-col gap-2 hover:text-$vp-c-brand-1"
      >
        <div class="text-xs flex items-center gap-1.5">
          <span class="i-tabler-chevrons-left" />前
        </div>
        <div>{{ prevNext.prev.text }}</div>
      </a>
      <a
        v-if="prevNext.next"
        :href="prevNext.next.link"
        class="flex flex-col gap-2 hover:text-$vp-c-brand-1"
      >
        <div class="text-xs flex items-center justify-end gap-1.5">
          后<span class="i-tabler-chevrons-right" />
        </div>
        <div class="self-end">{{ prevNext.next.text }}</div>
      </a>
    </div>
    <ul class="border-t pt-4 px-2 flex flex-col gap-4">
      <li v-for="back in backLink">
        <a :href="back.link" class="flex items-center gap-2 transition" hover="text-$vp-c-brand-1"
          ><span :class="back.icon" />{{ back.text }}</a
        >
      </li>
    </ul>
  </div>
</template>
