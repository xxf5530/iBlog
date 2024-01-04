import type { App, Component } from 'vue'
import T from './ToggleBlock.vue'
import DemoWrapper from './DemoWrapper.vue'
import GitRepoCard from './GitRepoCard.vue'

export const globals: Record<string, Component> = {
  T,
  DemoWrapper,
  GitRepoCard,
}

export function installComponents(app: App, map = globals) {
  Object.entries(map).forEach(kv => app.component(...kv))
}
