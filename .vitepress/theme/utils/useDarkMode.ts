import { nextTick } from 'vue'
import { useDark } from '@vueuse/core'

export interface UseDarkModeOptions {
  clientX?: number
  clientY?: number
  easing?: string
  duration?: number
}

export const isDark = useDark({
  storageKey: 'vitepress-theme-appearance',
})

export async function toggle(options: UseDarkModeOptions = {}) {
  const {
    clientX: x,
    clientY: y,
    easing = 'ease-out',
    duration = 400,
  } = options

  if (x === void 0 || y === void 0 || !enableTransitions()) {
    isDark.value = !isDark.value
    return
  }
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )}px at ${x}px ${y}px)`,
  ]
  // @ts-expect-error: Transition API
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration,
      easing,
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  )
}

function enableTransitions() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}
