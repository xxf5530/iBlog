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
