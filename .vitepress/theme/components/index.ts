import type { App, Component } from 'vue'

export const globals: Record<string, Component> = {}

export function installComponents(app: App, map = globals) {
  for (const key in map) {
    app.component(key, map[key])
  }
}
