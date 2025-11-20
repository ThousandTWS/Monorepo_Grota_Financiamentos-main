import { useEffect } from 'react'

export const useTheme = (theme: 'dark' | 'light' = 'dark') => {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "system")
    root.classList.add(theme)
  }, [theme])
}