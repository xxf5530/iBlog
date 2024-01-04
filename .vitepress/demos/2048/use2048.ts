import {
  type MaybeRef,
  computed,
  onScopeDispose,
  onUnmounted,
  reactive,
  toRefs,
  unref,
  watch,
} from 'vue'
import { useCycleList, useEventListener, useStorage } from '@vueuse/core'
import { G2048Model } from './model'
import { labels } from './config.json'
import { type MoveCommand, useMoveCommand } from '../shared/useMoveCommand'

export interface Use2048Options {
  bestKey?: string
  prevKey?: string
  presetKey?: string
  autoSaveWhenExit?: boolean
}

export interface TileItemPresets {
  getTileLabel: (_: number) => string
  getTileColor: (_: number) => string
}

function useModel() {
  const m = reactive(new G2048Model())
  const { gg, score, tiles, prevTiles, times } = toRefs(m)
  return {
    gg,
    score,
    tiles,
    times,
    canIBack: computed(() => !!prevTiles?.value),
    init: m.init.bind(m),
    move: m.move.bind(m),
    back: m.back.bind(m),
  }
}

function usePreset() {
  const getLabelByPresets = (arr: readonly string[]) => {
    return (level: number) => (level < arr.length ? arr[level - 1] : arr[arr.length - 1])
  }
  const getTileColor = (level: number) => {
    const suffix = 2 ** level
    return `tile-${suffix > 2048 ? 'super' : suffix}`
  }
  const presetList: TileItemPresets[] = [
    {
      getTileLabel: (level: number) => (2 ** level).toString(),
      getTileColor,
    },
    {
      getTileLabel: getLabelByPresets(labels.army),
      getTileColor,
    },
    {
      getTileLabel: getLabelByPresets(labels.dynasty),
      getTileColor,
    },
  ]

  const { state, next } = useCycleList(presetList)
  return {
    preset: state,
    nextPreset: next,
  }
}

export function useG2048(element: MaybeRef<HTMLElement | undefined>, options: Use2048Options = {}) {
  const { prevKey = 'g-2048-prev', bestKey = 'g-2048-best', autoSaveWhenExit = true } = options

  const { preset, nextPreset } = usePreset()
  const { gg, score, tiles, move, init, back, canIBack, times } = useModel()
  const best = useStorage(bestKey, score.value)

  useMoveCommand({
    element,
    onMoved: (direction: MoveCommand) => move(direction),
  })

  const stops = [
    watch(score, value => value > best.value && (best.value = value)),
    useEventListener('keydown', event => {
      if (gg.value && event.key === 'Enter') {
        init()
      }
    }),
  ]

  const autoSave = () => {
    if (gg.value) {
      localStorage.removeItem(prevKey)
      return
    }
    localStorage.setItem(
      prevKey,
      JSON.stringify({
        score: score.value,
        tiles: unref(tiles).map(({ x, y, level }) => ({ x, y, level })),
      })
    )
  }
  if (autoSaveWhenExit) {
    let called = false
    const saveOnce = () => {
      if (!called) {
        called = true
        autoSave()
      }
    }
    onUnmounted(() => saveOnce())
    useEventListener('pagehide', () => saveOnce())
  }

  const tryResume = () => {
    try {
      init(JSON.parse(localStorage.getItem(prevKey)!))
    } catch (e: any) {
      init()
    }
  }

  tryResume()
  onScopeDispose(() => stops.forEach(stop => stop()))

  return {
    gg,
    best,
    score,
    tiles,
    times,
    init,
    back,
    canIBack,
    preset,
    nextPreset,
  }
}
