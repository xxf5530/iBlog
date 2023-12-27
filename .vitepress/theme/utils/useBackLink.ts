import { computed } from 'vue'
import { useData } from 'vitepress'

// @unocss-include

const begin = { link: '/', icon: 'i-tabler-home', text: '返回首页' }
const posts = {
  link: '/posts',
  icon: 'i-tabler-layout-grid',
  text: '返回目录页',
}
const notes = { link: '/notes', icon: 'i-tabler-folder', text: '返回目录页' }

export function useBackLink() {
  const { page } = useData()
  return computed(() => {
    const slug = page.value.filePath.match(/^.*?(?=\/)/)?.[0]
    if (slug === 'notes') {
      return [notes, begin]
    } else if (slug === 'posts') {
      return [posts, begin]
    } else {
      return [begin]
    }
  })
}
