import { defineConfig } from 'vitepress'
import uno from 'unocss/vite'
import { themeConfig } from './theme'
import { vitePathAlias as alias } from './alias'
import postsJson from '../data/__posts.json'
import notesJson from '../data/__notes.json'

export default defineConfig({
  srcDir: 'press',
  outDir: 'dist',
  cacheDir: 'node_modules/.vitepress',
  cleanUrls: true,
  themeConfig,

  title: '小凡の网络日志',
  description: '这个人很懒，什么都没留下',
  head: [
    [
      'link',
      {
        href: 'https://lib.baomitu.com/lxgw-wenkai-screen-webfont/1.7.0/style.min.css',
        rel: 'stylesheet',
        as: 'font',
      },
    ],
  ],

  vite: {
    server: { port: 5530 },
    resolve: { alias },
    plugins: [uno()],
  },

  transformPageData({ frontmatter, relativePath }) {
    if (relativePath.startsWith('posts') || relativePath.startsWith('notes')) {
      const isPosts = relativePath.startsWith('posts')
      const fileLink = '/' + relativePath.replace(/\.md$/, '')
      const markMeta = getMarkdownMeta(fileLink, isPosts ? postsJson : notesJson)
      const updatedFrontmatter: Record<string, any> = {
        customHeader: isPosts ? 'center' : true,
        lastUpdateTime: markMeta?.lastUpdateTime,
      }
      if (isPosts) {
        updatedFrontmatter.prev = markMeta?.prev
        updatedFrontmatter.next = markMeta?.next
        updatedFrontmatter.aside = false
      }
      return {
        frontmatter: {
          ...updatedFrontmatter,
          ...frontmatter,
        },
      }
    }
  },
})

function getMarkdownMeta(fileLink: string, press: MarkdownArr) {
  const index = press.findIndex(({ link }) => link === fileLink)
  if (index > -1 && press.length > 1) {
    const prev =
      index > 0
        ? {
            date: press[index - 1]['date'],
            link: press[index - 1]['link'],
            text: press[index - 1]['title'],
          }
        : undefined
    const next =
      index < press.length - 1
        ? {
            date: press[index + 1]['date'],
            link: press[index + 1]['link'],
            text: press[index + 1]['title'],
          }
        : undefined
    const lastUpdateTime = press[index]['lastUpdateTime']
    return { prev, next, lastUpdateTime }
  }
}
