import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

// initial value is set in index.html before paint (no flash)
const getTheme = () => (document.documentElement.dataset.theme as Theme) ?? 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
