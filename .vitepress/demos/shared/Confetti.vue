<script setup lang="ts">
import { watch } from 'vue'
import { useRafFn } from '@vueuse/core'
import confetti from 'canvas-confetti'
import delay from 'delay'

const props = defineProps<{
  passed: boolean
}>()

const colors = [
  '#dc2626',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#0284c7',
  '#4f46e5',
  '#9333ea',
]

let pIndex = 0
const length = colors.length

function aniPride() {
  confetti({
    colors: [colors[pIndex++ % length]],
    particleCount: 1,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    shapes: ['star'],
  })
  confetti({
    colors: [colors[pIndex++ % length]],
    particleCount: 1,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    shapes: ['star'],
  })
}

const { pause, resume } = useRafFn(() => aniPride(), { immediate: false })

watch(
  () => props.passed,
  async v => {
    if (v) {
      await delay(500)
      resume()
      await delay(5000)
      pause()
      pIndex = 0
    }
  },
  { flush: 'post' },
)
</script>

<template>
  <div></div>
</template>
