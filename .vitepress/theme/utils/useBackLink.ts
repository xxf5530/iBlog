import { computed } from 'vue'
import { useData } from 'vitepress'

// magic comment: https://unocss.dev/guide/extracting#extracting-from-build-tools-pipeline
// @unocss-include

const fallbackIcon = 'i-tabler-sign-left'
const begin = { link: '/', icon: 'i-tabler-home', text: '返回首页' }
const posts = { link: '/posts', icon: 'i-tabler-layout-grid', text: '返回目录页' }
const notes = { link: '/notes', icon: 'i-tabler-list', text: '返回目录页' }

export function useBackLink() {
  const { page } = useData()
  return computed(() => {
    const slug = page.value.filePath.match(/^.*?(?=\/)/)?.[0]
    if (slug === 'notes') {
      return [notes, begin]
    }
    if (slug === 'posts') {
      return [posts, begin]
    }
    if (slug === 'topic') {
      return patchForTopic(page.value.filePath)
    }
    return [begin]
  })
}

function patchForTopic(link: string) {
  const item = link.match(/topic\/(share|arts|cooks)\/(.*)/)?.[1]
  if (item) {
    return [{ link: `/topic/${item}`, icon: fallbackIcon, text: '返回上一页' }, begin]
  }
  return [begin]
}
