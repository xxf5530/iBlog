<script setup lang="ts">
import type { GridMeta } from './model'
import { gridLabelPresets } from './config.json'

defineProps<{
  meta: GridMeta
  highlight: boolean
}>()

const GridStylePresets: Record<string, string> = {
  0: 'text-transparent',
  1: 'text-blue-500',
  2: 'text-green-500',
  3: 'text-red-500',
  4: 'text-indigo-500',
  5: 'text-orange-500',
  6: 'text-purple-500',
  7: 'text-teal-500',
  8: 'text-pink-500',
}
</script>

<template>
  <div
    class="flex justify-center items-center border border-gray/10 rounded-sm text-xl"
    :class="[
      !meta.open &&
        !highlight &&
        'bg-gray-600/10 hover:bg-gray-500/30 dark:bg-gray-500/10 dark:hover:bg-gray-400/30',
    ]"
  >
    <template v-if="meta.flag">
      <div :class="[meta.open && !meta.mine && 'h-full w-full bg-red-500/40']">
        {{ gridLabelPresets.flag }}
      </div>
    </template>
    <template v-else-if="meta.open">
      <div v-if="meta.boom" class="h-full w-full bg-red-500/60">
        {{ gridLabelPresets.boom }}
      </div>
      <div v-else-if="meta.mine">
        {{ gridLabelPresets.mine }}
      </div>
      <div v-else :class="[GridStylePresets[meta.adjacentMines!], 'font-bold']">
        {{ meta.adjacentMines }}
      </div>
    </template>
  </div>
</template>
