import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// __dirname
const root = fileURLToPath(new URL('../..', import.meta.url))

export function r(p = '', base = root) {
  return resolve(base, p).replace(/\\/g, '/')
}

export const ROOT_DIR = r()
export const MAIN_DIR = r('.vitepress')

export const vitePathAlias = [
  // align with tsconfig.json
  { find: /^~\//, replacement: `${ROOT_DIR}/` },
  { find: /^@\//, replacement: `${MAIN_DIR}/` },
  ...overrideComponents([
    { from: 'VPSwitchAppearance', to: 'ToggleDarkMode' },
    { from: 'VPDocFooter' },
  ]),
]

// https://vitepress.dev/guide/extending-default-theme#overriding-internal-components
// TODO: 在主题中配置（themeConfig）
function overrideComponents(arr: { from: string; to?: string }[]) {
  return arr.map(({ from, to = from.slice(2) }) => ({
    find: new RegExp(`^.*\\/${from}\\.vue$`),
    replacement: r(`theme/components/${to}.vue`, MAIN_DIR),
  }))
}
