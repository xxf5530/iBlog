<script setup lang="ts">
import { useEventListener, useStorage, useTimestamp } from '@vueuse/core'
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import {
  gridLabelPresets,
  levelPresets,
  locales,
  stateEmojiPresets,
} from './config.json'
import { type Level, useModel } from './model'
import Dialog from './dialog.vue'
import BlockItem from './block.vue'
import Confetti from '../shared/Confetti.vue'

const model = useModel()
const { state, board, grids, timer, flags } = model

const clock = ref(0)
const stamp = useTimestamp()
const level = computed<Level>(() => {
  for (const [level, values] of Object.entries(levelPresets)) {
    if (values.m === board.value.m) {
      return level as Level
    }
  }
  return 'custom'
})

watchEffect(() => {
  if (state.value === 'ready') {
    clock.value = 0
  } else if (state.value === 'playing') {
    clock.value =
      (stamp.value - timer.value.start + timer.value.duration) / 1000
  }
})

function format(value: number) {
  return Math.floor(value).toString().padStart(3, '0')
}

function levelOptions() {
  return Object.keys(levelPresets) as Level[]
}

/* ------------------------------------ - ----------------------------------- */
const itemWidth = ref(32)
const fastModel = useStorage('g-minesweeper-fast', true)
const flagModel = useStorage('g-minesweeper-flag', false)

const domBoard = ref<HTMLElement>()
const elementX = ref(0)
const elementY = ref(0)
const pressDownFlag = ref(false)
const highlightFlag = ref(false)
const highlightList = ref<number[]>([])

function onPointerDown(event: PointerEvent) {
  pressDownFlag.value = true
  updateElement(event)
  highlightList.value = model.getHighlight(getClickGridPosition())
}

function onPointerMove(event: PointerEvent) {
  if (pressDownFlag.value) {
    updateElement(event)
    highlightList.value = model.getHighlight(getClickGridPosition())
  }
}

function onClick() {
  const position = getClickGridPosition()
  flagModel.value ? model.mark(position) : model.open(position, fastModel.value)
}

function onRightClick() {
  model.mark(getClickGridPosition())
}

useEventListener('pointerup', () => {
  pressDownFlag.value = false
  highlightFlag.value = false
  highlightList.value = []
})

function updateElement(event: PointerEvent) {
  const { x, y, width, height } = domBoard.value!.getBoundingClientRect()
  const diffX = event.clientX - x
  const diffY = event.clientY - y
  if (diffX < 0 || diffX > width || diffY < 0 || diffY > height) {
    highlightFlag.value = false
    return
  }
  highlightFlag.value = true
  elementX.value = diffX
  elementY.value = diffY
}

function getClickGridPosition(
  clickX = elementX.value,
  clickY = elementY.value,
  length = itemWidth.value + 2 /** 2px mean gap */,
) {
  return {
    x: Math.floor(clickX / length),
    y: Math.floor(clickY / length),
  }
}

/* ------------------------------- save & load ------------------------------ */
const storageKey = 'g-minesweeper-prev'
const showResumeDialog = ref(!!localStorage.getItem(storageKey))
const storageData = computed(() => {
  if (showResumeDialog.value) {
    try {
      return JSON.parse(localStorage.getItem(storageKey)!)
    } catch (e: any) {}
  }
  return undefined
})

const autoSave = (() => {
  let called = false
  return () => {
    if (called) {
      return
    }
    called = true
    if (state.value !== 'playing') {
      return
    }
    localStorage.setItem(storageKey, JSON.stringify(model.save()))
  }
})()

onUnmounted(() => autoSave())
useEventListener('pagehide', () => autoSave())

function tryResume() {
  try {
    model.load(storageData.value)
  } catch (e: any) {
    model.init()
  }
  closeResumeDialog()
}

function closeResumeDialog() {
  showResumeDialog.value = false
  localStorage.removeItem(storageKey)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex justify-between px-2">
      <div class="flex space-x-2">
        <button
          v-for="lv in levelOptions()"
          :key="lv"
          class="inline-flex justify-center items-center border border-solid border-gray/20 px-4 py-1 rounded text-sm transition-none"
          :class="[
            lv === level
              ? 'text-[#e7e9ea] dark:text-[#09090b] bg-black/90 hover:bg-black/80 dark:bg-white/90 dark:hover:bg-white/80'
              : 'hover:bg-black/5 hover:dark:bg-white/10',
          ]"
          @click="model.init(lv)"
        >
          {{ locales[lv] }}
        </button>
        <button
          class="hidden"
          :class="[
            level === 'custom'
              ? 'text-[#e7e9ea] dark:text-[#09090b] bg-black/90 hover:bg-black/80 dark:bg-white/90 dark:hover:bg-white/80'
              : 'hover:bg-black/5 hover:dark:bg-white/10',
          ]"
        >
          {{ locales.custom }}
        </button>
      </div>
      <button
        class="inline-flex justify-center items-center border border-solid border-gray/20 px-4 py-1 rounded text-sm hover:bg-black/5 hover:dark:bg-white/10"
        title="重玩本局游戏"
        @click="model.redo()"
      >
        <div class="i-tabler-repeat-once" />
      </button>
    </div>

    <div class="flex justify-center px-2 text-xl font-bold space-x-2">
      <button
        class="w-24 inline-flex justify-center items-center border border-solid border-gray/20 px-4 py-1 rounded text-sm hover:bg-black/5 hover:dark:bg-white/10 !text-lg"
      >
        <span>{{ gridLabelPresets.mine }}</span>
        <span class="ml-1 w-10 text-red-500">
          {{ format(board.m - flags.length) }}
        </span>
      </button>
      <button
        class="w-24 inline-flex justify-center items-center border border-solid border-gray/20 px-4 py-1 rounded text-sm hover:bg-black/5 hover:dark:bg-white/10 !text-lg"
        @click="model.init()"
      >
        {{ stateEmojiPresets[state] }}
      </button>
      <button
        class="w-24 inline-flex justify-center items-center border border-solid border-gray/20 px-4 py-1 rounded text-sm hover:bg-black/5 hover:dark:bg-white/10 !text-lg"
      >
        <span>{{ gridLabelPresets.time }}</span>
        <span class="ml-1 w-10 text-red-500">{{ format(clock) }}</span>
      </button>
    </div>

    <div class="max-w-full select-none overflow-auto text-center">
      <div
        v-if="board"
        ref="domBoard"
        class="inline-flex flex-col space-y-[2px]"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerleave="highlightFlag = false"
        @click="onClick"
        @click.right="onRightClick"
        @contextmenu.prevent
      >
        <div v-for="(_, y) in board.h" :key="y" class="flex space-x-[2px]">
          <BlockItem
            v-for="(__, x) in board.w"
            :key="x"
            :style="{
              width: `${itemWidth}px`,
              height: `${itemWidth}px`,
            }"
            :meta="grids[model.posToUid({ x, y })]"
            :highlight="
              highlightFlag && highlightList.includes(model.posToUid({ x, y }))
            "
          />
        </div>
      </div>
    </div>

    <div class="flex justify-center space-x-2">
      <label
        for="toggleQuick"
        class="w-20 inline-flex justify-center items-center border px-4 py-1 rounded text-sm hover:bg-black/5 hover:dark:bg-white/10"
      >
        <input
          id="toggleQuick"
          v-model="fastModel"
          type="checkbox"
          class="mr-2"
        />
        <span class="text-base">{{ gridLabelPresets.fast }}</span>
      </label>
      <label
        for="toggleFlag"
        class="w-20 inline-flex justify-center items-center border px-4 py-1 rounded text-sm hover:bg-black/5 hover:dark:bg-white/10"
      >
        <input
          id="toggleFlag"
          v-model="flagModel"
          type="checkbox"
          class="mr-2"
        />
        <span class="text-base">{{ gridLabelPresets.flag }}</span>
      </label>
    </div>
  </div>

  <Dialog
    v-model="showResumeDialog"
    title="恢复对局 🤔"
    @on-ok="tryResume"
    @on-cancel="closeResumeDialog"
  >
    <div class="flex flex-col items-center p-2">
      <div>
        有上次未完成的对局
        <span class="text-sm"
          >({{ new Date(storageData.timer.start).toLocaleString() }})</span
        >
      </div>
      <div>是否继续?</div>
    </div>
  </Dialog>

  <Confetti :passed="state === 'victory'" />
</template>
