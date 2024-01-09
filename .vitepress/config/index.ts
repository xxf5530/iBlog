import { defineConfig } from 'vitepress'

export default defineConfig({
  srcDir: 'press',
  cacheDir: 'node_modules/.vitepress/.cache',
  cleanUrls: true,
  title: '小凡の网络日志',
})
