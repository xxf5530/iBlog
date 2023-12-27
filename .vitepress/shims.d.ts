declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n ? never : T

interface Array<T> {
  filter(predicate: BooleanConstructor, thisArg?: any): NonFalsy<T>[]
}

interface MarkdownFileMeta {
  title: string
  description?: string
  date: string
  link: string
  category?: string
  tags?: string[]
  cover?: string[]
  draft?: boolean
  lastUpdateTime?: string
}

type MarkdownArr = MarkdownFileMeta[]
type MarkdownMap = Record<string, MarkdownArr>
