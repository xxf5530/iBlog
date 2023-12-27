<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { locales } from './config.json'
import { useG2048 } from './use2048'
import TileItem from './tile.vue'

const domBoard = ref<HTMLElement>()
const itemSize = ref(4.2 /** rem */)

const { gg, best, score, tiles, init, back, canIBack, preset, nextPreset } =
  useG2048(domBoard)

const gameLabel = computed(() => preset.value.getTileLabel(11))

onMounted(() => {
  const isMobile = useMediaQuery('(max-width: 640px)')
  watchEffect(() => {
    if (isMobile.value) {
      itemSize.value = 4.2 /** rem */
    } else {
      itemSize.value = 5
    }
  })
})

// TODO: score animation
</script>

<template>
  <div class="inline-flex flex-col gap-3 select-none">
    <div class="flex items-center justify-between">
      <button
        class="title-2048 w-32 self-stretch rounded p-2 text-center text-4xl font-bold"
        @click="nextPreset()"
      >
        {{ gameLabel }}
      </button>
      <div class="ml-2 flex self-end space-x-2">
        <div
          class="w-20 flex flex-col items-center rounded bg-orange-600/30 py-0.5"
        >
          <div>{{ locales.score }}</div>
          <div class="text-xl font-bold">
            {{ score }}
          </div>
        </div>
        <div
          class="w-20 flex flex-col items-center rounded bg-orange-600/30 py-0.5"
        >
          <div>{{ locales.best }}</div>
          <div class="text-xl font-bold">
            {{ best }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="underline underline-offset-4">
        {{ locales.caption }}&nbsp;{{ gameLabel }}
      </div>

      <div class="flex items-center">
        <button
          v-if="canIBack"
          class="mr-2 flex justify-center items-center rounded-full p-3 hover:bg-black/5 hover:dark:bg-white/10"
          title="回退一步"
          @click="back"
        >
          <div class="i-tabler:arrow-back-up h-5 w-5" />
        </button>
        <button
          class="ml-2 w-20 rounded bg-yellow-600/40 py-2 text-center text-xl"
          @click="init()"
        >
          {{ locales.new }}
        </button>
      </div>
    </div>

    <div class="relative" @touchmove.stop.prevent>
      <div
        class="relative inline-block max-w-full overflow-auto rounded bg-[#bbada0] p-3"
      >
        <div class="flex space-x-3">
          <div v-for="_ in 4" :key="_" class="flex flex-col space-y-3">
            <div
              v-for="__ in 4"
              :key="__"
              class="rounded bg-[#eee4da] opacity-30"
              :style="{ width: `${itemSize}rem`, height: `${itemSize}rem` }"
            />
          </div>
        </div>

        <div ref="domBoard" class="absolute inset-0 p-3">
          <template v-for="tile in tiles" :key="tile.key">
            <TileItem
              :level="tile.level"
              :label="preset.getTileLabel(tile.level)"
              :color="preset.getTileColor(tile.level)"
              :style="{
                width: `${itemSize}rem`,
                height: `${itemSize}rem`,
                transform: `translate(${(itemSize + 0.75) * tile.x}rem, ${
                  (itemSize + 0.75) * tile.y
                }rem)`,
                fontSize: `${itemSize * 0.4}rem`,
              }"
            />
          </template>
        </div>
      </div>

      <Transition name="gg">
        <div
          v-if="gg"
          class="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(238,228,218,.5)] p-3 dark:bg-black/50"
        >
          <div class="mb-3 text-5xl font-bold">Game Over</div>
          <button
            class="w-20 rounded bg-yellow-500 py-2 text-xl"
            @click="init()"
          >
            {{ locales.again }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.gg-enter-from {
  opacity: 0;
  transform: scale(0.75);
}

.gg-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
  transition-delay: 1s;
}

.title-2048 {
  color: #f9f6f2;
  background: #edc22e;
}
</style>
