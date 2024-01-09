import { defineConfig } from 'vitepress'
import themeConfig from './theme'
import unocss from 'unocss/vite'
import { tsConfigPaths } from './alias'

export default defineConfig({
  srcDir: 'press',
  cacheDir: 'node_modules/.vitepress/.cache',
  cleanUrls: true,
  title: '小凡の网络日志',
  themeConfig,
  vite: {
    resolve: { alias: [...tsConfigPaths] },
    plugins: [unocss()],
  },
})
