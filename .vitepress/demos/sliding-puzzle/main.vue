<script setup lang="ts">
import { computed, reactive, toRefs, ref } from 'vue'
import { SlidingPuzzleModel } from './model'
import delay from 'delay'

const options = reactive({
  w: 3,
  h: 3,
})

const playing = ref(false)

const model = useSlidingPuzzleModel()
const { w, h, win, tiles, times } = model
model.reset({ w: options.w, h: options.h })
model.shuffle()

const tileMargin = ref(2 /**px*/)
const tileLength = computed(() => 300 / Math.max(options.w, options.h))
const tileFontSize = computed(() => Math.floor(tileLength.value * 0.4))

async function onClickNew() {
  playing.value = false
  model.reset({ w: options.w, h: options.h })
  for (let i = 0; i < 3; i++) {
    model.shuffle()
    await delay(550)
  }
  playing.value = true
}

async function onClickTile(position: number) {
  model.move(position)
}

async function onClickAutoMove() {
  const path = model.solve()
  if (path?.length) {
    for (let i = 0; i < path.length; i++) {
      model.move(path[i])
      await delay(150)
    }
  }
}

function useSlidingPuzzleModel() {
  const m = reactive(new SlidingPuzzleModel())
  const { w, h, win, tiles, times } = toRefs(m)
  return {
    w,
    h,
    win,
    tiles,
    times,
    reset: m.reset.bind(m),
    move: m.move.bind(m),
    shuffle: m.shuffle.bind(m),
    solve: m.solve.bind(m),
  }
}
</script>

<template>
  <div class="flex flex-col gap-5 select-none">
    <div class="flex items-center">
      <button @click="onClickNew">new</button>
    </div>

    <!-- board -->
    <div
      class="relative"
      :style="{
        width: `${(tileLength + tileMargin) * options.w - tileMargin}px`,
        height: `${(tileLength + tileMargin) * options.h - tileMargin}px`,
        fontSize: `${tileFontSize}px`,
      }"
    >
      <div class="absolute left-0 top-0">
        <div
          v-for="tile in tiles"
          :key="tile.value"
          :style="{
            width: `${tileLength}px`,
            height: `${tileLength}px`,
            transform: `translate(${
              (tile.position % w) * (tileLength + tileMargin)
            }px, ${
              Math.floor(tile.position / h) * (tileLength + tileMargin)
            }px)`,
          }"
          :class="playing ? 'duration-200' : 'duration-500'"
          class="absolute border flex justify-center items-center rounded-sm shadow-sm transition"
          hover="bg-black/2 dark:bg-white/5"
          @click="onClickTile(tile.position)"
        >
          {{ tile.value }}
        </div>
      </div>
    </div>

    <div>
      <button @click="onClickAutoMove">solve</button>
    </div>
  </div>
</template>
