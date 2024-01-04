import type { DefaultTheme } from 'vitepress'
import { getNotesByCategory } from '../theme/utils/notes'
import notesJson from '../data/__notes.json'

export type ThemeConfig = DefaultTheme.Config & {}

export const nav: ThemeConfig['nav'] = [
  { text: '日常', link: '/posts', activeMatch: '^/posts' },
  { text: '笔记', link: '/notes', activeMatch: '^/notes' },
  {
    text: '合集',
    items: [
      { text: '📰 资讯', link: '/topic/share', activeMatch: '^/topic/share' },
      { text: '🍚 干饭记', link: '/topic/cooks', activeMatch: '^/topic/cooks' },
      { text: '🍀 音·游·书·影', link: '/topic/arts', activeMatch: '^/topic/arts' },
    ],
  },
  { text: '关于', link: '/about' },
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/notes/': getNotesSidebar(getNotesByCategory(notesJson)),
}

export const themeConfig: ThemeConfig = {
  nav,
  sidebar,
  logo: { light: '/imgs/ai.jpeg', dark: '/imgs/fire.jpeg' },
  outline: { label: '本页导览', level: [2, 3] },
  sidebarMenuLabel: '目录',
  returnToTopLabel: '返回顶部',
  darkModeSwitchLabel: '深色模式',
}

function getNotesSidebar(notes: MarkdownMap) {
  return Object.keys(notes).map(key => ({
    text: key,
    collapsed: false,
    items: notes[key].map(({ title: text, link }) => ({ text, link })),
  }))
}
