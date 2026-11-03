interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // "false" hides the extra themes (linen, fjord, moss); anything else keeps them
  readonly VITE_ENABLE_EXTRA_THEMES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
