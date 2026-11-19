// theme registry: light + dark are always on, the rest are "extra" themes
// set VITE_ENABLE_EXTRA_THEMES=false in front/.env to turn the extras off
// (colors live in css/theme.css; index.html reads the same env var before paint)

export const BASE_THEMES = ['light', 'dark'] as const
export const EXTRA_THEMES = ['linen', 'matte', 'sage', 'hygge', 'spruce', 'fjord'] as const

export type Theme = (typeof BASE_THEMES)[number] | (typeof EXTRA_THEMES)[number]

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  linen: 'Linen',
  matte: 'Matte',
  sage: 'Sage',
  hygge: 'Hygge',
  spruce: 'Spruce',
  fjord: 'Fjord',
}

export const EXTRA_THEMES_ENABLED = import.meta.env.VITE_ENABLE_EXTRA_THEMES !== 'false'

export const THEMES: readonly Theme[] = EXTRA_THEMES_ENABLED
  ? [...BASE_THEMES, ...EXTRA_THEMES]
  : BASE_THEMES

// dark themes go in the right column of the settings picker, the rest on the left
const DARK: readonly Theme[] = ['dark', 'hygge', 'spruce', 'fjord']
export const isDarkTheme = (theme: Theme) => DARK.includes(theme)

export const isTheme = (value: unknown): value is Theme =>
  THEMES.includes(value as Theme)
