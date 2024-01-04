<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useIntervalFn, useTimestamp, useWebWorkerFn } from '@vueuse/core'
import { nQueens$3 as nQueens } from './solutions'
import ChessBoard from './chess-board.vue'

const N_MAX = 15
const n = ref(8)
const _n = ref(n.value)

const solving = ref(false)
const playing = ref(false)
const loading = computed(() => solving.value && n.value > 13)

const results = ref<number[][]>([])
const index = ref(1)
const total = computed(() => results.value.length)
const current = computed(() => results.value[index.value - 1] || [])

const stamp = useTimestamp()
const start = ref(0)
const timer = ref('?')
const lockedPlaces = ref<number[]>([])

const { workerFn, workerTerminate } = useWebWorkerFn(nQueens)
const { resume, pause } = useIntervalFn(() => setIndex(index.value + 1), 2500, {
  immediate: false,
})

watch(n, value => value !== _n.value && startCalculate(value))
watch(playing, () => (playing.value ? resume() : pause()))
watchEffect(() => {
  if (solving.value) {
    const ms = Math.max(stamp.value - start.value, 10)
    timer.value = (ms / 1000).toFixed(2)
  }
})

startCalculate(_n.value)

function startCalculate(value: number) {
  start.value = Date.now()
  playing.value && pause()
  solving.value = true
  lockedPlaces.value = Array.from({ length: 4 })
  workerFn(value)
    .then(res => {
      solving.value = false
      results.value = JSON.parse(res)
      index.value = 1
      _n.value = value
      playing.value && resume()
    })
    .catch(() => stopCalculate())
}

function stopCalculate() {
  workerTerminate()
  n.value = _n.value
  solving.value = false
  playing.value && resume()
}

function setIndex(value: number) {
  if (solving.value) {
    return
  }
  if (value === total.value + 1 && index.value === total.value) {
    index.value = 1
    return
  }
  if (value === 0 && index.value === 1) {
    index.value = total.value
    return
  }
  index.value = Math.max(1, Math.min(value, total.value))
}

function setLockedPlaces(x: number, y: number) {
  if (lockedPlaces.value[0] === x && lockedPlaces.value[1] === y) {
    lockedPlaces.value = Array.from({ length: 4 })
  } else {
    lockedPlaces.value = [x, y, x + y, x - y]
  }
}
</script>

<template>
  <div class="relative space-y-3">
    <div class="flex items-center gap-3">
      <div class="text-3xl font-bold">N</div>
      <div class="text-3xl font-bold">=</div>
      <div class="flex overflow-hidden border rounded">
        <button
          class="w-8 bg-gray-400/20 text-center disabled:op-60"
          :disabled="n === 1 || solving"
          @click="n -= 1"
        >
          ➖
        </button>
        <input v-model="n" class="w-16 p-1 text-center text-xl" readonly />
        <button
          class="w-8 bg-gray-400/20 text-center disabled:op-60"
          :disabled="n === N_MAX || solving"
          @click="n += 1"
        >
          ➕
        </button>
      </div>
      <button
        v-if="loading"
        class="flex justify-center items-center self-end border border-solid border-gray/20 rounded px-3 py-1.5 transition-colors hover:bg-black/5 hover:dark:bg-white/10"
        @click="stopCalculate"
      >
        <span class="i-svg-spinners-clock mr-1" />
        <span class="text-sm">取消</span>
      </button>
    </div>

    <div class="flex items-center gap-x-2 text-sm">
      找到<span class="min-w-12 border-b text-center">{{ solving ? '🤔' : total }}</span
      >种摆法，用时<span class="min-w-10 border-b text-center">{{ timer }}</span
      >秒
    </div>

    <div class="max-w-full overflow-x-auto overflow-y-hidden">
      <div class="relative inline-block">
        <ChessBoard :n="_n" :queens="current" :locked="lockedPlaces" @tap="setLockedPlaces" />
        <Transition name="fade">
          <div
            v-if="loading"
            class="absolute inset-0 flex justify-center items-center flex-col rounded bg-white/70 dark:bg-black/70"
          >
            <span class="i-svg-spinners-blocks-shuffle-3 h-7 w-7" />
            <span class="mt-2 text-sm">努力计算中...</span>
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="!loading && current.length > 0" class="flex items-center">
      <button
        :title="playing ? '停止演示' : '点击自动轮播'"
        class="flex justify-center items-center rounded bg-gray-400/20 p-2"
        @click="playing = !playing"
      >
        <span v-if="!playing" class="i-tabler-play h-5 w-5" />
        <span v-else class="i-svg-spinners-bars-scale h-5 w-5" />
      </button>
      <div class="ml-4 flex items-center gap-2">
        <div class="text-sm">第</div>
        <div class="flex overflow-hidden border rounded">
          <button
            class="w-8 flex justify-center items-center bg-gray-400/20"
            @click="setIndex(index - 1)"
          >
            <span class="i-tabler-skip-back" />
          </button>
          <input
            v-model="index"
            class="w-20 p-1 text-center text-base"
            @change="setIndex(index)"
            @keydown.enter="setIndex(index)"
          />
          <button
            class="w-8 flex justify-center items-center bg-gray-400/20"
            @click="setIndex(index + 1)"
          >
            <span class="i-tabler-skip-forward" />
          </button>
        </div>
        <div class="text-sm">种摆法</div>
      </div>
    </div>
  </div>
</template>
