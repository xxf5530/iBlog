<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  level: number
  label: string
  color: string
}>()

const aniClassName = ref<'tile-merge' | 'tile-popup' | undefined>('tile-popup')

watch(
  () => props.level,
  (_, oldValue) => {
    aniClassName.value = oldValue ? 'tile-merge' : 'tile-popup'
  }
)
</script>

<template>
  <div class="absolute rounded transition">
    <div
      class="h-full w-full flex items-center justify-center rounded font-bold"
      :class="[aniClassName, color]"
      @animationend="aniClassName = undefined"
    >
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.tile-popup {
  animation: popup 0.2s;
}

.tile-merge {
  animation: merge 0.2s;
  animation-delay: 0.2s;
}

@keyframes popup {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes merge {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.tile-2 {
  color: #776e65;
  background: #eee4da;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
}

.tile-4 {
  color: #776e65;
  background: #eee1c9;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0), inset 0 0 0 1px rgba(255, 255, 255, 0);
}

.tile-8 {
  color: #f9f6f2;
  background: #f3b27a;
}

.tile-16 {
  color: #f9f6f2;
  background: #f69664;
}

.tile-32 {
  color: #f9f6f2;
  background: #f77c5f;
}

.tile-64 {
  color: #f9f6f2;
  background: #f75f3b;
}

.tile-128 {
  color: #f9f6f2;
  background: #edd073;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.238095),
    inset 0 0 0 1px rgba(255, 255, 255, 0.142857);
}

.tile-256 {
  color: #f9f6f2;
  background: #edcc62;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746),
    inset 0 0 0 1px rgba(255, 255, 255, 0.190476);
}

.tile-512 {
  color: #f9f6f2;
  background: #edc950;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.396825),
    inset 0 0 0 1px rgba(255, 255, 255, 0.238095);
}

.tile-1024 {
  color: #f9f6f2;
  background: #edc53f;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619),
    inset 0 0 0 1px rgba(255, 255, 255, 0.285714);
}

.tile-2048 {
  color: #f9f6f2;
  background: #edc22e;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.555556),
    inset 0 0 0 1px rgba(255, 255, 255, 0.333333);
}

.tile-super {
  color: #f9f6f2;
  background: #3c3a33;
}
</style>
