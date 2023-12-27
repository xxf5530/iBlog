import type { App, Component } from 'vue'
import T from './ToggleBlock.vue'
import GitRepoCard from './GitRepoCard.vue'

export const globals: Record<string, Component> = {
  T,
  GitRepoCard,
}

export function installComponents(app: App, map = globals) {
  for (const key in map) {
    app.component(key, map[key])
  }
}
