import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      warn: true,
    }),
  ],
  transformers: [transformerVariantGroup()],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'inline-flex-center': 'inline-flex justify-center items-center',
  },
  preflights: [
    {
      getCSS: () => `
      *,
      ::before,
      ::after {
        border: 0 solid var(--border);
      }

      :root {
        --border: #e1e7ef;
        --radius: 0.5rem;
      }

      :root.dark {
        --border: #222;
      }
      `,
    },
  ],
  theme: {
    duration: {
      DEFAULT: '200ms',
    },
    borderRadius: {
      lg: 'calc(var(--radius) + 2px)',
      md: 'var(--radius)',
      DEFAULT: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
  },
})
