<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import posts from '@/data/__posts.json'

function formatDate(date: string) {
  return useDateFormat(date, 'YYYY年M月D日').value
}
</script>

<template>
  <div
    class="mx-auto mb-24 max-w-xl md:max-w-2xl lg:max-w-5xl xl:max-w-[1440px]"
  >
    <div class="pt-10 p-5">
      <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <li v-for="post in posts">
          <a
            :href="post.link"
            class="mx-auto w-full max-w-96 flex flex-col border rounded shadow of-hidden transition"
            hover="shadow-lg dark:shadow-[0_0_15px_rgba(255,255,255,0.2),0_0_3px_1px_rgba(255,255,255,0.15)]"
          >
            <div class="w-full h-52 md:h-48">
              <img
                v-if="post.cover?.length"
                :src="post.cover[0]"
                loading="lazy"
                class="object-cover w-full h-full duration-1000 hover:scale-105 rounded-b-none"
              />
            </div>
            <div class="p-4 text-sm">
              <div class="flex justify-between items-center leading-tight mb-4">
                <h2 class="text-base font-bold">{{ post.title }}</h2>
                <time>{{ formatDate(post.date) }}</time>
              </div>
              <div class="text-sm text-$vp-c-text-2 of-hidden line-clamp-2">
                {{ post.description }}
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
