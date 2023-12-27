import { type Theme } from 'vitepress'
import Layout from './Layout.vue'
import Posts from './views/Posts.vue'
import Notes from './views/Notes.vue'
import { installComponents, globals } from './components'
import './styles/main.css'
import 'uno.css'

export default <Theme>{
  Layout,
  enhanceApp({ app }) {
    installComponents(app, {
      ...globals,
      Posts,
      Notes,
    })
  },
}
