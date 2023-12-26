import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons({ scale: 1.2 }), presetAttributify()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: {},
  theme: {},
})
