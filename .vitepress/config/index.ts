import { defineConfig } from 'vitepress'
import uno from 'unocss/vite'
import { vitePathAlias as alias } from './alias'

export default defineConfig({
  srcDir: 'press',
  cacheDir: 'node_modules/.vitepress',
  cleanUrls: true,

  title: '小凡の网络日志',
  description: '这个人很懒, 什么都没有留下',
  head: [],

  vite: {
    plugins: [uno()],
    resolve: { alias },
  },
})
