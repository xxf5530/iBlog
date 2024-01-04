<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatTimeAgo } from '@vueuse/core'
import { ofetch } from 'ofetch'

const { endPoint, timeout = 5000 } = defineProps<{
  endPoint: string
  timeout?: number
}>()

const state = ref<'pending' | 'loading' | 'ok' | 'error'>('pending')
const resp = ref<Record<string, string>>({})

onMounted(async () => {
  if (!endPoint) {
    state.value = 'error'
    return
  }
  try {
    state.value = 'loading'
    const api = `https://api.github.com/repos/${endPoint}`
    const res = await ofetch(api, {
      timeout,
      headers: {
        Accept: 'application/vnd.github.v4+json',
      },
    })
    resp.value = {
      ...prepareRespData(res),
      avatar_url: res.owner.avatar_url,
    }
    state.value = 'ok'
  } catch (error) {
    const res = await ofetch('/json/gh-repo.json')
    const item = res.items?.[endPoint]
    if (item) {
      resp.value = {
        ...prepareRespData(item),
        avatar_url: item.avatar_url,
        stamp: res.stamp,
      }
      state.value = 'ok'
    } else {
      state.value = 'error'
    }
  }
})

function prepareRespData(res: any) {
  return {
    html_url: res.html_url,
    description: res.description,
    language: res.language,
    stargazers_count: formatNumber(res.stargazers_count),
    forks_count: formatNumber(res.forks_count),
    pushed_at: res.pushed_at,
  }
}

function formatNumber(value: number) {
  return value > 999 ? `${(value / 1000).toFixed(1)}k` : value.toString()
}

function getLanguageColor(language?: string) {
  const colorMap: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Vue: '#41b883',
    Other: '#ededed',
  }
  if (language && colorMap[language]) {
    return colorMap[language]
  } else {
    return colorMap.Other
  }
}
</script>

<template>
  <div class="rounded border of-hidden">
    <div v-if="state === 'loading'" class="min-h-28 bg-dark/5 dark:bg-light/10"></div>
    <div v-else class="p-4">
      <a :href="resp.html_url" target="_blank" class="inline-flex items-center gap-2 mb-2">
        <img :src="resp.avatar_url" class="w-6 h-6 rounded-full" />
        <span>{{ endPoint }}</span>
      </a>
      <div class="mb-4 break-all text-sm">{{ resp.description }}</div>
      <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-$vp-c-text-2">
        <div class="flex items-center">
          <span
            class="mr-1 h-2.5 w-2.5 rounded-full"
            :style="{ 'background-color': getLanguageColor(resp.language) }"
          />
          <span>{{ resp.language }}</span>
        </div>
        <div class="flex items-center gap-1" title="stars">
          <span i-tabler-star />
          <span>{{ resp.stargazers_count }}</span>
        </div>
        <div class="flex items-center gap-1" title="forks">
          <span i-tabler-git-fork />
          <span>{{ resp.forks_count }}</span>
        </div>
        <div v-if="!resp.stamp">Last PR on {{ formatTimeAgo(new Date(resp.pushed_at)) }}</div>
        <div v-else class="ml-auto">
          This data was updated {{ formatTimeAgo(new Date(resp.stamp)) }}
        </div>
      </div>
    </div>
  </div>
</template>
