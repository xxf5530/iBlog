import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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
]
