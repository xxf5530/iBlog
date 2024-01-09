import type { DefaultTheme } from 'vitepress'

export type ThemeConfig = DefaultTheme.Config & {}

export const nav: ThemeConfig['nav'] = [
  { text: '日常', link: '/posts', activeMatch: '^/posts' },
  { text: '笔记', link: '/notes', activeMatch: '^/notes' },
  {
    text: '合集',
    items: [
      { text: '📰 资讯', link: '/topic/share' },
      { text: '🍚 干饭记', link: '/topic/cooks' },
      { text: '🍀 音·游·书·影', link: '/topic/arts' },
    ],
  },
  { text: '关于', link: '/about' },
]

export default <ThemeConfig>{
  nav,
  logo: { light: '/ai.png', dark: '/fire.png' },
  outline: { label: '本页导览', level: [2, 3] },
  sidebarMenuLabel: '目录',
  returnToTopLabel: '返回顶部',
  darkModeSwitchLabel: '深色模式',
  externalLinkIcon: true,
}
