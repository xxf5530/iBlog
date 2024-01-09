import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './styles/main.css'
import 'uno.css'

export default <Theme>{
  Layout,
  enhanceApp({ app }) {},
}
