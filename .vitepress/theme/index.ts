import type { Theme } from 'vitepress'
import nProgress from 'nprogress'
import Layout from './Layout.vue'
import { globalComponents } from './components'
import './styles/main.css'
import 'uno.css'

const inBrowser = typeof window !== 'undefined'

export default <Theme>{
  Layout,
  enhanceApp({ app, router }) {
    Object.entries(globalComponents).forEach(kv => app.component(...kv))

    if (inBrowser) {
      const { onBeforeRouteChange, onAfterRouteChanged } = router
      router.onBeforeRouteChange = to => {
        nProgress.start()
        return onBeforeRouteChange?.(to)
      }
      router.onAfterRouteChanged = to => {
        nProgress.done()
        return onAfterRouteChanged?.(to)
      }
    }
  },
}
