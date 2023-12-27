<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCycleList, useEventListener } from '@vueuse/core'
import notesJson from '@/data/__notes.json'
import {
  type NotesView,
  getLinkByNoteTag,
  getNotesByCategory,
  getNotesByTags,
  getNotesByTimeline,
  parseNotesUrlHash,
  getLinkByNoteView,
} from '../utils/notes'
import DocNavLink from '../components/DocNavLink.vue'

const viewTabs = [
  { key: 'tags', text: '标签组' },
  { key: 'category', text: '文件夹' },
  { key: 'timeline', text: '时间线' },
] as const

const view = ref<NotesView>('category')

const notesTag = getNotesByTags(notesJson)
const tagList = Object.keys(notesTag)
const { state: activeTag, index: activeTagIndex } = useCycleList(tagList)

const notes = computed(() => {
  if (view.value === 'tags') {
    const tag = activeTag.value
    return {
      [tag]: notesTag[tag],
    }
  }
  if (view.value === 'timeline') {
    return getNotesByTimeline(notesJson)
  }
  return getNotesByCategory(notesJson)
})

onMounted(() => respectUrlHash())
useEventListener('hashchange', respectUrlHash)

function respectUrlHash() {
  const { view: nextView, tag } = parseNotesUrlHash(location.hash)
  view.value = nextView
  if (tag) {
    activeTagIndex.value = tagList.indexOf(tag)
  }
}

function getLinkByTagIndex(index: number) {
  if (index < 0) {
    index = tagList.length - 1
  } else if (index >= tagList.length) {
    index = 0
  }
  return getLinkByNoteTag(tagList[index])
}
</script>

<template>
  <div class="max-w-2xl mx-auto mb-24">
    <div class="flex flex-col gap-6 pt-10 p-5">
      <div class="flex">
        <div class="flex p-1 rounded bg-dark/5 dark:bg-white/10">
          <a
            v-for="item in viewTabs"
            :href="getLinkByNoteView(item.key, activeTag)"
            :class="
              view === item.key
                ? 'bg-$vp-c-bg text-$vp-c-text-1'
                : 'text-$vp-c-text-2'
            "
            class="inline-flex-center rounded-sm min-w-20 py-1 text-sm transition"
            hover="text-$vp-c-text-1"
          >
            {{ item.text }}
          </a>
        </div>
      </div>

      <template v-if="view === 'tags'">
        <div class="flex flex-wrap gap-x-5 gap-y-2 px-2 py-4">
          <a
            v-for="tag in tagList"
            :href="getLinkByNoteTag(tag)"
            class="relative px-2 py-1 text-sm hover:text-$vp-c-brand-1 transition"
            :class="
              activeTag === tag
                ? 'text-$vp-c-brand-1 underline underline-offset-4'
                : 'text-$vp-c-text-1'
            "
          >
            <span class="absolute -right-0.5 -top-0.5">{{
              notesTag[tag].length
            }}</span>
            {{ tag }}</a
          >
        </div>
        <div v-for="key in Object.keys(notes)">
          <div class="mb-2 p-2 flex items-center border-b">
            <span i-tabler-tag />
            <h2 class="text-lg ml-2">{{ key }}</h2>
          </div>
          <ul>
            <DocNavLink
              v-for="note in notes[key]"
              :title="note.title"
              :link="note.link"
              :tags="note.tags"
              :active-tag="activeTag"
            />
          </ul>
        </div>
      </template>

      <template v-if="view === 'category'">
        <div v-for="key in Object.keys(notes)">
          <div class="mb-2 p-2 flex items-center border-b">
            <span i-tabler-folder-open />
            <h2 class="text-lg ml-2">{{ key }}</h2>
          </div>
          <ul>
            <DocNavLink
              v-for="note in notes[key]"
              :title="note.title"
              :link="note.link"
              :tags="note.tags"
              :date="note.date"
            />
          </ul>
        </div>
      </template>

      <template v-if="view === 'timeline'">
        <div v-for="key in Object.keys(notes)">
          <div class="mb-2 p-2 flex items-center border-b">
            <span i-tabler-clock />
            <h2 class="text-lg ml-2">{{ key }} 年</h2>
          </div>
          <ul>
            <DocNavLink
              v-for="note in notes[key]"
              :title="note.title"
              :link="note.link"
              :tags="note.tags"
              :date="note.date"
              format-date-str="MM月DD日"
              show-timeline
            />
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>
