import { defineConfig } from 'vitepress'
import uno from 'unocss/vite'
import { themeConfig } from './theme'
import { vitePathAlias as alias } from './alias'

export default defineConfig({
  srcDir: 'press',
  cacheDir: 'node_modules/.vitepress',
  cleanUrls: true,
  themeConfig,

  title: '小凡の网络日志',
  description: '这个人很懒, 什么都没有留下',
  head: [
    [
      'link',
      {
        href: 'https://cdn.staticfile.org/lxgw-wenkai-screen-webfont/1.7.0/lxgwwenkaiscreen.css',
        rel: 'stylesheet',
        as: 'font',
      },
    ],
  ],

  vite: {
    plugins: [uno()],
    resolve: { alias },
  },

  transformPageData({ relativePath, frontmatter }) {},
})
