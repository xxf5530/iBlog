import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../..', import.meta.url))

export const r = (p = '', base = root) => resolve(base, p).replace(/\\/g, '/')

export const ROOT_DIR = r()
export const MAIN_DIR = r('.vitepress')

export const tsConfigPaths = [
  { find: /^~\//, replacement: `${ROOT_DIR}/` },
  { find: /^@\//, replacement: `${MAIN_DIR}/` },
]

export const vpComponentAlias = overrideComponents([
  { from: 'VPSwitchAppearance', to: 'ToggleDarkMode' },
])

// https://vitepress.dev/guide/extending-default-theme#overriding-internal-components
// TODO: 在主题中配置（themeConfig）
function overrideComponents(arr: { from: string; to?: string }[]) {
  return arr.map(({ from, to = from.slice(2) }) => ({
    find: new RegExp(`^.*\\/${from}\\.vue$`),
    replacement: r(`theme/components/${to}.vue`, MAIN_DIR),
  }))
}
