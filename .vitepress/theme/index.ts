import { type Theme } from 'vitepress'
import Layout from './Layout.vue'
import { installComponents, globals } from './components'
import { begin, posts, notes } from './views'
import './styles/main.css'
import 'uno.css'

export default <Theme>{
  Layout,
  enhanceApp({ app }) {
    installComponents(app, { ...globals, begin, posts, notes })
  },
}
