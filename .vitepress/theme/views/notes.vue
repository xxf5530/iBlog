<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCycleList, useDateFormat, useEventListener } from '@vueuse/core'
import {
  type NotesView,
  getLinkByNoteTag,
  getNotesByTags,
  getNotesByTimeline,
  getNotesByCategory,
  parseNotesUrlHash,
  getLinkByNoteView,
} from '../utils/notes'
import notesJson from '@/data/__notes.json'
import DocNavItem from '../components/DocNavItem.vue'

const viewTabs = [
  { key: 'tags', text: '标签组' },
  { key: 'category', text: '文件夹' },
  { key: 'timeline', text: '时间线' },
] as const

const view = ref<NotesView>('category')
const activeViewIndex = computed(() => viewTabs.findIndex(i => i.key === view.value))

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

const noteKeys = computed(() => {
  if (view.value === 'timeline') {
    return Object.keys(notes.value).sort((a, b) => Number(b) - Number(a))
  }
  return Object.keys(notes.value)
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
</script>

<template>
  <div class="mx-auto max-w-2xl mt-5 mb-24">
    <div class="flex flex-col gap-5 p-5">
      <ul class="relative flex w-fit rounded-md p-1 bg-dark/10 dark:bg-light/10 of-hidden">
        <li
          v-for="item in viewTabs"
          :class="view === item.key ? 'text-$vp-c-text-1' : 'text-$vp-c-text-2'"
          class="relative z-1"
        >
          <a
            :href="getLinkByNoteView(item.key, activeTag)"
            class="inline-flex-center w-20 py-1 bg-transparent text-sm transition"
            hover="text-$vp-c-text-1"
            >{{ item.text }}</a
          >
        </li>
        <li
          class="absolute inset-1 rounded z-0 w-20 bg-$vp-c-bg transition duration-250"
          :style="{ transform: `translateX(${activeViewIndex * 100}%)` }"
        ></li>
      </ul>

      <template v-if="view === 'tags'">
        <div class="flex flex-wrap gap-x-4 gap-y-2 my-4">
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
            <span class="absolute -right-0.5 -top-0.5">{{ notesTag[tag].length }}</span>
            {{ tag }}</a
          >
        </div>
      </template>
      <template v-else>
        <div></div>
      </template>

      <template v-if="view === 'tags'">
        <div v-for="key in noteKeys">
          <div class="mb-2 p-2 flex items-center border-b">
            <span class="i-tabler-tag w-5 h-5" />
            <h2 class="ml-2 text-lg">{{ key }}</h2>
          </div>
          <ul>
            <DocNavItem
              v-for="note in notes[key]"
              :title="note.title"
              :link="note.link"
              :tags="note.tags"
              :activeTag="activeTag"
            />
          </ul>
        </div>
      </template>

      <template v-if="view === 'category'">
        <div v-for="key in noteKeys">
          <div class="mb-2 p-2 flex items-center border-b">
            <span class="i-tabler-folder-open w-5 h-5" />
            <h2 class="ml-2 text-lg">{{ key }}</h2>
          </div>
          <ul>
            <DocNavItem
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
        <div v-for="key in noteKeys">
          <div class="mb-2 p-2 flex items-center border-b">
            <span class="i-tabler-calendar w-5 h-5" />
            <h2 class="text-xl ml-2">{{ key }} 年</h2>
          </div>
          <ul>
            <DocNavItem
              v-for="note in notes[key]"
              :title="note.title"
              :link="note.link"
              :tags="note.tags"
              :date="note.date"
              dateFormatStr="MM月DD日"
              showTimeline
            />
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>
