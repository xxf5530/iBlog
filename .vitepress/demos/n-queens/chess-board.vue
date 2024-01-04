<script setup lang="ts">
import { computed } from 'vue'
import IconQueen from './icon-queen.vue'

interface Props {
  n?: number
  queens?: number[]
  locked?: number[]
  border?: number
  length?: number
  unit?: string
  colors?: [string, string]
}

const props = withDefaults(defineProps<Props>(), {
  n: 8,
  border: 28,
  length: 34,
  unit: 'px',
  queens: () => [],
  locked: () => [],
  colors: () => ['bg-[#d18b47]', 'bg-[#ffce9e]'],
})

defineEmits<{
  (e: 'tap', x: number, y: number): void
}>()

const borderStr = computed(() => `${props.border}${props.unit}`)
const lengthStr = computed(() => `${props.length}${props.unit}`)

const boardStyle = computed(() => {
  const value = `${props.length * props.n + props.border * 2}${props.unit}`
  return {
    width: value,
    height: value,
  }
})

const coords = computed(() => [
  {
    class: 'top-0',
    style: { left: borderStr.value },
    width: lengthStr.value,
    height: borderStr.value,
    text: (val: number) => String.fromCodePoint(96 + val),
  },
  {
    class: 'bottom-0',
    style: { left: borderStr.value },
    width: lengthStr.value,
    height: borderStr.value,
    text: (val: number) => String.fromCodePoint(96 + val),
  },
  {
    class: 'left-0 flex-col',
    style: { top: borderStr.value },
    width: borderStr.value,
    height: lengthStr.value,
    text: (val: number) => val,
  },
  {
    class: 'right-0 flex-col',
    style: { top: borderStr.value },
    width: borderStr.value,
    height: lengthStr.value,
    text: (val: number) => val,
  },
])
</script>

<template>
  <div class="relative box-content overflow-hidden border rounded" :style="boardStyle">
    <div class="absolute inset-0 text-sm">
      <div
        v-for="(coord, index) in coords"
        :key="index"
        :style="coord.style"
        :class="coord.class"
        class="absolute flex"
      >
        <div
          v-for="_ in n"
          :key="_"
          :style="{ width: coord.width, height: coord.height }"
          class="flex justify-center items-center"
        >
          {{ coord.text(_) }}
        </div>
      </div>
    </div>

    <div
      class="absolute"
      :style="{
        inset: borderStr,
      }"
    >
      <div v-for="(_, y) in n" :key="y" class="relative flex">
        <div
          v-for="(__, x) in n"
          :key="x"
          class="flex justify-center items-center cursor-pointer"
          :class="[
            (y + x) % 2 ? colors[0] : colors[1],
            x === locked[0] && y === locked[1] ? 'border-2 border-dashed border-gray-600' : '',
          ]"
          :style="{
            width: lengthStr,
            height: lengthStr,
          }"
          @click="$emit('tap', x, y)"
        >
          <div
            v-if="
              queens[y] !== x &&
              !(x === locked[0] && y === locked[1]) &&
              (x === locked[0] || y === locked[1] || x + y === locked[2] || x - y === locked[3])
            "
            class="i-tabler-lock"
            :style="{
              color: '#444',
            }"
          />
        </div>
      </div>
      <div class="absolute left-0 top-0">
        <div
          v-for="(x, y) in queens"
          :key="y"
          :style="{
            width: lengthStr,
            height: lengthStr,
            transform: `translate(${x * length}${unit}, ${y * length}${unit})`,
          }"
          class="absolute flex justify-center items-center cursor-pointer transition"
          @click="$emit('tap', x, y)"
        >
          <IconQueen
            :class="[
              x === locked[0] || y === locked[1] || x + y === locked[2] || x - y === locked[3]
                ? 'text-[#eee]'
                : 'text-[#111]',
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
