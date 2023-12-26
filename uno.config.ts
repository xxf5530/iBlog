import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'inline-flex-center': 'inline-flex justify-center items-center',
    'btn': 'inline-flex-center gap-2 rounded cursor-pointer transition',
  },
  theme: {
    colors: {},
    borderRadius: {
      lg: 'calc(var(--radius) + 2px)',
      md: 'var(--radius)',
      DEFAULT: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
  },
})
