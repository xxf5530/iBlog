import { type MaybeRef, onScopeDispose, ref, watch } from 'vue'
import { useEventListener, useSwipe } from '@vueuse/core'

export type MoveCommand = 'up' | 'down' | 'left' | 'right'

export interface MoveCommandOptions {
  enableKeyboard?: boolean
  enableSwipe?: boolean
  element?: MaybeRef<HTMLElement | undefined>
  onMoved?: (direction: MoveCommand) => void
}

const EventKeyMap: Record<string, MoveCommand> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
}

export function useMoveCommand(options: MoveCommandOptions = {}) {
  const {
    enableKeyboard = true,
    enableSwipe = true,
    element,
    onMoved,
  } = options

  const command = ref<MoveCommand>()
  const _stops: Array<() => void> = []
  if (enableKeyboard) {
    _stops.push(
      useEventListener('keydown', event => {
        const direction = EventKeyMap[event.key]
        if (direction) {
          event.preventDefault()
          onMoved?.(direction)
          command.value = direction
        }
      }),
    )
  }
  if (enableSwipe) {
    const { direction } = useSwipe(element)
    _stops.push(
      watch(direction, value => {
        if (value && value !== 'none') {
          onMoved?.(value)
          command.value = value
        }
      }),
    )
  }

  onScopeDispose(() => _stops.forEach(fn => fn()))

  return {
    command,
  }
}
